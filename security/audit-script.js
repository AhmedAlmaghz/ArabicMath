/**
 * سكريبت فحص أمني للمكتبة
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SecurityAudit {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.info = [];
    }
    
    async runAudit() {
        console.log('🔒 بدء الفحص الأمني...\n');
        
        await this.checkDependencies();
        await this.scanSourceCode();
        await this.validateBuildOutput();
        await this.checkConfigurations();
        
        this.generateReport();
    }
    
    async checkDependencies() {
        console.log('📦 فحص التبعيات...');
        
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            
            // فحص التبعيات المعروفة بالمشاكل
            const vulnerablePackages = [
                'lodash', 'moment', 'request', 'colors', 'minimist'
            ];
            
            const dependencies = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };
            
            for (const [pkg, version] of Object.entries(dependencies)) {
                if (vulnerablePackages.includes(pkg)) {
                    this.warnings.push({
                        type: 'dependency',
                        message: `الحزمة ${pkg} قد تحتوي على ثغرات معروفة`,
                        package: pkg,
                        version: version
                    });
                }
                
                // فحص الإصدارات القديمة
                if (version.includes('^') || version.includes('~')) {
                    this.info.push({
                        type: 'dependency',
                        message: `الحزمة ${pkg} تستخدم نطاق إصدارات - تأكد من الأمان`,
                        package: pkg,
                        version: version
                    });
                }
            }
            
        } catch (error) {
            this.issues.push({
                type: 'dependency',
                message: 'فشل في قراءة package.json',
                error: error.message
            });
        }
    }
    
    async scanSourceCode() {
        console.log('🔍 فحص الكود المصدري...');
        
        await this.scanDirectory('src');
        await this.scanDirectory('examples');
    }
    
    async scanDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) return;
        
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const file of files) {
            const fullPath = path.join(dirPath, file.name);
            
            if (file.isDirectory()) {
                await this.scanDirectory(fullPath);
            } else if (file.name.endsWith('.js') || file.name.endsWith('.html')) {
                await this.scanFile(fullPath);
            }
        }
    }
    
    async scanFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // أنماط أمنية خطيرة
        const dangerousPatterns = [
            {
                regex: /eval\s*\(/g,
                message: 'استخدام eval() خطير أمنياً',
                severity: 'high'
            },
            {
                regex: /innerHTML\s*=/g,
                message: 'استخدام innerHTML قد يؤدي إلى XSS',
                severity: 'medium'
            },
            {
                regex: /document\.write\s*\(/g,
                message: 'استخدام document.write خطير',
                severity: 'medium'
            },
            {
                regex: /\$\{[^}]*\}/g,
                message: 'تأكد من تنظيف template literals',
                severity: 'low'
            },
            {
                regex: /<script[^>]*>/gi,
                message: 'وجود script tags - تأكد من الأمان',
                severity: 'medium'
            }
        ];
        
        for (const pattern of dangerousPatterns) {
            const matches = content.match(pattern.regex);
            if (matches) {
                const item = {
                    type: 'code',
                    file: filePath,
                    message: pattern.message,
                    matches: matches.length,
                    severity: pattern.severity
                };
                
                if (pattern.severity === 'high') {
                    this.issues.push(item);
                } else if (pattern.severity === 'medium') {
                    this.warnings.push(item);
                } else {
                    this.info.push(item);
                }
            }
        }
        
        // فحص أنماط أخرى مشبوهة
        this.checkSuspiciousPatterns(filePath, content);
    }
    
    checkSuspiciousPatterns(filePath, content) {
        // فحص كلمات مرور مدفونة
        const passwordPatterns = [
            /password\s*=\s*["'][^"']+["']/gi,
            /api_key\s*=\s*["'][^"']+["']/gi,
            /secret\s*=\s*["'][^"']+["']/gi,
            /token\s*=\s*["'][^"']+["']/gi
        ];
        
        for (const pattern of passwordPatterns) {
            if (pattern.test(content)) {
                this.issues.push({
                    type: 'credentials',
                    file: filePath,
                    message: 'احتمالية وجود بيانات اعتماد في الكود',
                    severity: 'high'
                });
            }
        }
        
        // فحص console.log في كود الإنتاج
        if (content.includes('console.log') && !filePath.includes('dev')) {
            this.info.push({
                type: 'logging',
                file: filePath,
                message: 'وجود console.log في كود الإنتاج',
                severity: 'low'
            });
        }
    }
    
    async validateBuildOutput() {
        console.log('🏗️ فحص مخرجات البناء...');
        
        if (!fs.existsSync('dist')) {
            this.warnings.push({
                type: 'build',
                message: 'مجلد dist غير موجود - تأكد من تشغيل البناء'
            });
            return;
        }
        
        const distFiles = fs.readdirSync('dist');
        
        // فحص أحجام الملفات
        for (const file of distFiles) {
            if (file.endsWith('.js')) {
                const filePath = path.join('dist', file);
                const stats = fs.statSync(filePath);
                const sizeKB = stats.size / 1024;
                
                if (sizeKB > 500) {
                    this.warnings.push({
                        type: 'build',
                        message: `الملف ${file} كبير الحجم (${sizeKB.toFixed(1)}KB)`,
                        file: file,
                        size: sizeKB
                    });
                }
                
                // فحص المحتوى للكود المشبوه
                const content = fs.readFileSync(filePath, 'utf8');
                if (content.includes('eval(') || content.includes('Function(')) {
                    this.issues.push({
                        type: 'build',
                        message: `الملف ${file} يحتوي على كود تنفيذي خطير`,
                        file: file
                    });
                }
            }
        }
        
        // التحقق من checksums
        this.generateChecksums();
    }
    
    generateChecksums() {
        const distPath = 'dist';
        const checksums = {};
        
        if (!fs.existsSync(distPath)) return;
        
        const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
        
        for (const file of files) {
            const content = fs.readFileSync(path.join(distPath, file));
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            checksums[file] = hash;
        }
        
        fs.writeFileSync(
            path.join(distPath, 'checksums.json'),
            JSON.stringify(checksums, null, 2)
        );
        
        this.info.push({
            type: 'build',
            message: 'تم إنشاء checksums للملفات المبنية',
            checksums: Object.keys(checksums).length
        });
    }
    
    async checkConfigurations() {
        console.log('⚙️ فحص ملفات التكوين...');
        
        // فحص .gitignore
        if (fs.existsSync('.gitignore')) {
            const gitignore = fs.readFileSync('.gitignore', 'utf8');
            
            const sensitivePatterns = [
                'node_modules', '.env', '*.key', '*.pem', 'dist'
            ];
            
            for (const pattern of sensitivePatterns) {
                if (!gitignore.includes(pattern)) {
                    this.warnings.push({
                        type: 'config',
                        message: `.gitignore لا يحتوي على ${pattern}`,
                        pattern: pattern
                    });
                }
            }
        } else {
            this.issues.push({
                type: 'config',
                message: 'ملف .gitignore غير موجود'
            });
        }
        
        // فحص package.json للحقول الأمنية
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        if (!packageJson.license) {
            this.warnings.push({
                type: 'config',
                message: 'لا يوجد ترخيص محدد في package.json'
            });
        }
        
        if (!packageJson.repository) {
            this.info.push({
                type: 'config',
                message: 'لا يوجد مستودع محدد في package.json'
            });
        }
    }
    
    generateReport() {
        console.log('\n📋 تقرير الفحص الأمني:');
        console.log('='.repeat(50));
        
        if (this.issues.length > 0) {
            console.log('\n🚨 مشاكل أمنية حرجة:');
            this.issues.forEach((issue, i) => {
                console.log(`  ${i + 1}. [${issue.type.toUpperCase()}] ${issue.message}`);
                if (issue.file) console.log(`     الملف: ${issue.file}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  تحذيرات أمنية:');
            this.warnings.forEach((warning, i) => {
                console.log(`  ${i + 1}. [${warning.type.toUpperCase()}] ${warning.message}`);
                if (warning.file) console.log(`     الملف: ${warning.file}`);
            });
        }
        
        if (this.info.length > 0) {
            console.log('\n💡 معلومات أمنية:');
            this.info.forEach((info, i) => {
                console.log(`  ${i + 1}. [${info.type.toUpperCase()}] ${info.message}`);
            });
        }
        
        // النتيجة الإجمالية
        console.log('\n📊 الخلاصة:');
        console.log(`   🚨 مشاكل حرجة: ${this.issues.length}`);
        console.log(`   ⚠️  تحذيرات: ${this.warnings.length}`);
        console.log(`   💡 معلومات: ${this.info.length}`);
        
        const overallSecurity = this.calculateSecurityScore();
        console.log(`   🛡️  نقاط الأمان: ${overallSecurity}/100`);
        
        // حفظ التقرير
        this.saveReport();
        
        // تحديد كود الخروج
        if (this.issues.length > 0) {
            console.log('\n❌ الفحص الأمني فشل - يوجد مشاكل حرجة');
            process.exit(1);
        } else if (this.warnings.length > 5) {
            console.log('\n⚠️  الفحص الأمني مر بتحذيرات - راجع المشاكل');
            process.exit(1);
        } else {
            console.log('\n✅ الفحص الأمني نجح');
        }
    }
    
    calculateSecurityScore() {
        let score = 100;
        
        // خصم نقاط للمشاكل
        score -= this.issues.length * 20;        // مشاكل حرجة
        score -= this.warnings.length * 5;       // تحذيرات
        score -= this.info.length * 1;          // معلومات
        
        return Math.max(0, score);
    }
    
    saveReport() {
        const report = {
            timestamp: new Date().toISOString(),
            issues: this.issues,
            warnings: this.warnings,
            info: this.info,
            score: this.calculateSecurityScore(),
            summary: {
                totalIssues: this.issues.length,
                totalWarnings: this.warnings.length,
                totalInfo: this.info.length
            }
        };
        
        if (!fs.existsSync('reports')) {
            fs.mkdirSync('reports');
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = `reports/security-audit-${timestamp}.json`;
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📁 تقرير مفصل محفوظ في: ${reportPath}`);
    }
}

// تشغيل الفحص إذا تم استدعاء الملف مباشرة
if (require.main === module) {
    const audit = new SecurityAudit();
    audit.runAudit().catch(console.error);
}

module.exports = SecurityAudit;
