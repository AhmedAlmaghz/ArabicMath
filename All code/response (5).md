

<think>

المستخدم يريد المتابعة، سأقدم باقي الملفات المهمة لإكمال المشروع:

1. ملفات CI/CD (GitHub Actions, etc.)
2. ملفات الأمان (Security)
3. ملفات الصيانة والتحديث
4. ملفات التوثيق المتقدم
5. ملفات النشر والتوزيع
6. ملفات التكوين الإضافية
7. ملفات الموارد والأصول
8. ملفات المساهمة والمجتمع

سأبدأ بملفات CI/CD ثم أكمل باقي الملفات.

</think>

ممتاز! سأكمل باقي الملفات الضرورية لجعل المشروع مكتملاً ومتاحاً للإنتاج:

## ⚙️ **14. CI/CD وأتمتة النشر - .github/workflows/**

### **.github/workflows/ci.yml:**
```yaml
name: 🔄 التكامل المستمر

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: 🧪 الاختبارات
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
        
    steps:
    - name: 📥 استنساخ الكود
      uses: actions/checkout@v3
      
    - name: 🟢 إعداد Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        
    - name: 📦 تثبيت التبعيات
      run: npm ci
      
    - name: 🔍 فحص الجودة
      run: npm run lint
      
    - name: 🧪 تشغيل الاختبارات
      run: npm test
      
    - name: 📊 تقرير التغطية
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  build:
    name: 🏗️ البناء
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - name: 📥 استنساخ الكود
      uses: actions/checkout@v3
      
    - name: 🟢 إعداد Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
        
    - name: 📦 تثبيت التبعيات
      run: npm ci
      
    - name: 🏗️ بناء المكتبة
      run: npm run build
      
    - name: 📤 رفع الملفات المبنية
      uses: actions/upload-artifact@v3
      with:
        name: dist-files
        path: dist/
        retention-days: 30

  browser-test:
    name: 🌐 اختبارات المتصفح
    runs-on: ubuntu-latest
    needs: build
    
    strategy:
      matrix:
        browser: [chrome, firefox, safari]
        
    steps:
    - name: 📥 استنساخ الكود
      uses: actions/checkout@v3
      
    - name: 🟢 إعداد Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
        
    - name: 📦 تثبيت التبعيات
      run: npm ci
      
    - name: 📥 تحميل الملفات المبنية
      uses: actions/download-artifact@v3
      with:
        name: dist-files
        path: dist/
        
    - name: 🌐 تشغيل اختبارات المتصفح
      run: npm run test:browser -- --browser=${{ matrix.browser }}

  performance:
    name: ⚡ اختبارات الأداء
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - name: 📥 استنساخ الكود
      uses: actions/checkout@v3
      
    - name: 🟢 إعداد Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
        
    - name: 📦 تثبيت التبعيات
      run: npm ci
      
    - name: 📥 تحميل الملفات المبنية
      uses: actions/download-artifact@v3
      with:
        name: dist-files
        path: dist/
        
    - name: ⚡ تشغيل اختبارات الأداء
      run: npm run test:performance
      
    - name: 📊 رفع تقرير الأداء
      uses: actions/upload-artifact@v3
      with:
        name: performance-report
        path: tests/performance/reports/

  security:
    name: 🔒 فحص الأمان
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 استنساخ الكود
      uses: actions/checkout@v3
      
    - name: 🟢 إعداد Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
        
    - name: 📦 تثبيت التبعيات
      run: npm ci
      
    - name: 🔍 فحص الثغرات الأمنية
      run: npm audit
      
    - name: 🔒 فحص CodeQL
      uses: github/codeql-action/analyze@v2
      with:
        languages: javascript

  docs:
    name: 📚 بناء التوثيق
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: 📥 استنساخ الكود
      uses: actions/checkout@v3
      
    - name: 🟢 إعداد Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
        
    - name: 📦 تثبيت التبعيات
      run: npm ci
      
    - name: 📚 بناء التوثيق
      run: npm run docs:build
      
    - name: 🚀 نشر إلى GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs-dist
        cname: arabic-math-js.github.io
```

### **.github/workflows/release.yml:**
```yaml
name: 🚀 نشر إصدار جديد

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: 🏷️ إنشاء الإصدار
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 استنساخ الكود
      uses: actions/checkout@v3
      
    - name: 🟢 إعداد Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
        registry-url: 'https://registry.npmjs.org'
        
    - name: 📦 تثبيت التبعيات
      run: npm ci
      
    - name: 🧪 تشغيل الاختبارات
      run: npm test
      
    - name: 🏗️ بناء المكتبة
      run: npm run build
      
    - name: 📚 بناء التوثيق
      run: npm run docs:build
      
    - name: 📋 استخراج ملاحظات الإصدار
      id: extract_notes
      run: |
        VERSION=${GITHUB_REF#refs/tags/v}
        echo "VERSION=$VERSION" >> $GITHUB_OUTPUT
        
        # استخراج ملاحظات الإصدار من CHANGELOG.md
        sed -n "/## \[$VERSION\]/,/## \[/p" CHANGELOG.md | head -n -1 > release_notes.md
        
    - name: 🏷️ إنشاء إصدار GitHub
      uses: softprops/action-gh-release@v1
      with:
        files: |
          dist/*.js
          dist/*.css
          dist/*.map
        body_path: release_notes.md
        draft: false
        prerelease: false
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        
    - name: 📦 نشر إلى NPM
      run: |
        cd dist
        npm publish --access public
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        
    - name: 🐳 بناء Docker Image
      run: |
        echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
        docker build -t arabic-math-js:${{ steps.extract_notes.outputs.VERSION }} .
        docker tag arabic-math-js:${{ steps.extract_notes.outputs.VERSION }} arabic-math-js:latest
        docker push arabic-math-js:${{ steps.extract_notes.outputs.VERSION }}
        docker push arabic-math-js:latest

  notify:
    name: 📢 إشعارات
    runs-on: ubuntu-latest
    needs: release
    
    steps:
    - name: 📢 إشعار Discord
      uses: sarisia/actions-status-discord@v1
      with:
        webhook: ${{ secrets.DISCORD_WEBHOOK }}
        title: "🎉 إصدار جديد من Arabic Math JS"
        description: "تم نشر الإصدار ${{ github.ref_name }} بنجاح!"
        color: 0x00FF00
        
    - name: 📧 إشعار البريد الإلكتروني
      uses: dawidd6/action-send-mail@v3
      with:
        server_address: smtp.gmail.com
        server_port: 587
        username: ${{ secrets.EMAIL_USERNAME }}
        password: ${{ secrets.EMAIL_PASSWORD }}
        subject: "🚀 إصدار جديد: Arabic Math JS ${{ github.ref_name }}"
        to: subscribers@arabic-math-js.com
        from: noreply@arabic-math-js.com
        body: |
          تم إصدار نسخة جديدة من مكتبة الرياضيات العربية!
          
          الإصدار: ${{ github.ref_name }}
          التاريخ: ${{ github.event.created_at }}
          الرابط: https://github.com/arabic-math-js/arabic-math-js/releases/tag/${{ github.ref_name }}
          
          ميزات هذا الإصدار موجودة في ملاحظات الإصدار.
```

## 🔒 **15. ملفات الأمان - security/**

### **security/security-policy.md:**
```markdown
# 🔐 سياسة الأمان

## الإصدارات المدعومة

نحن ندعم الإصدارات التالية بتحديثات الأمان:

| الإصدار | مدعوم          |
| ------- | -------------- |
| 1.x.x   | ✅ مدعوم       |
| 0.9.x   | ❌ غير مدعوم   |
| < 0.9   | ❌ غير مدعوم   |

## الإبلاغ عن الثغرات الأمنية

### 🚨 للثغرات الحرجة

إذا اكتشفت ثغرة أمنية حرجة، يرجى **عدم** الإبلاغ عنها علناً. بدلاً من ذلك:

1. أرسل بريد إلكتروني إلى: security@arabic-math-js.com
2. استخدم PGP للتشفير إذا أمكن (المفتاح العام متوفر أدناه)
3. اتبع نموذج التقرير المحدد

### 📝 نموذج التقرير

```
العنوان: [SECURITY] وصف مختصر للثغرة

الوصف التفصيلي:
- وصف الثغرة
- الخطوات لإعادة إنتاجها
- التأثير المحتمل
- اقتراحات الإصلاح (إن وجدت)

البيئة:
- إصدار المكتبة:
- المتصفح:
- نظام التشغيل:

مرفقات:
- لقطات شاشة
- كود الاختبار
- ملفات أخرى ذات صلة
```

### ⏱️ زمن الاستجابة

- **الاعتراف بالتقرير**: خلال 24 ساعة
- **التقييم الأولي**: خلال 72 ساعة
- **الإصلاح والنشر**: حسب خطورة الثغرة
  - حرجة: خلال 7 أيام
  - عالية: خلال 30 يوماً
  - متوسطة: خلال 90 يوماً

### 🏆 برنامج المكافآت

نحن نقدر جهود الباحثين الأمنيين:

- **ثغرات حرجة**: مذكور في قائمة الشكر + شهادة تقدير
- **ثغرات عالية**: مذكور في قائمة الشكر
- **ثغرات متوسطة**: مذكور في التغييرات

### 🔑 مفتاح PGP العام

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[سيتم إضافة المفتاح الفعلي هنا]
-----END PGP PUBLIC KEY BLOCK-----
```

## 🛡️ أفضل الممارسات الأمنية

### للمطورين

1. **التحقق من صحة المدخلات**: تحقق دائماً من صحة المعادلات قبل المعالجة
2. **منع XSS**: تأكد من تنظيف HTML المولد
3. **تحديد الموارد**: استخدم Content Security Policy (CSP)
4. **التشفير**: استخدم HTTPS دائماً في الإنتاج

### للمستخدمين

1. **استخدم الإصدار الأحدث**: تأكد من استخدام آخر إصدار آمن
2. **فحص التبعيات**: تحقق من وجود ثغرات في التبعيات
3. **البيئات الآمنة**: تجنب استخدام المكتبة في بيئات غير آمنة
4. **المراجعة الدورية**: راجع استخدام المكتبة دورياً

## 📊 تقارير الأمان

### التقارير المحلولة

| التاريخ | الثغرة | الخطورة | الإصدار المتأثر | الحل |
|---------|--------|---------|----------------|-----|
| - | - | - | - | - |

### التنبيهات النشطة

لا توجد تنبيهات أمنية نشطة حالياً.

## 🔄 التحديثات الأمنية

سيتم نشر التحديثات الأمنية عبر:

1. **GitHub Security Advisories**
2. **قائمة البريد الإلكتروني الأمنية**
3. **NPM Security Alerts**
4. **موقع المشروع الرسمي**

للاشتراك في التنبيهات الأمنية، أرسل إلى: security-subscribe@arabic-math-js.com
```

### **security/audit-script.js:**
```javascript
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
```

## 📋 **16. ملفات التوثيق المتقدم - docs/**

### **docs/deployment-guide.md:**
```markdown
# 🚀 دليل النشر والتوزيع

## نظرة عامة

هذا الدليل يغطي جميع طرق نشر وتوزيع مكتبة الرياضيات العربية في بيئات الإنتاج المختلفة.

## 📦 النشر على NPM

### التحضير للنشر

```bash
# 1. تأكد من نظافة المجلد
npm run clean

# 2. تشغيل الاختبارات
npm test

# 3. بناء المكتبة
npm run build

# 4. فحص الجودة
npm run lint

# 5. فحص أمني
npm run audit
```

### إنشاء إصدار جديد

```bash
# إصدار patch (1.0.0 -> 1.0.1)
npm version patch

# إصدار minor (1.0.0 -> 1.1.0)
npm version minor

# إصدار major (1.0.0 -> 2.0.0)
npm version major
```

### النشر

```bash
# نشر عادي
npm publish

# نشر beta
npm publish --tag beta

# نشر مع access عام
npm publish --access public
```

## 🌐 CDN والتوزيع

### jsDelivr

```html
<!-- النسخة الحديثة -->
<script src="https://cdn.jsdelivr.net/npm/arabic-math-js@latest/dist/arabic-math.min.js"></script>

<!-- إصدار محدد -->
<script src="https://cdn.jsdelivr.net/npm/arabic-math-js@1.0.0/dist/arabic-math.min.js"></script>

<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/arabic-math-js@latest/dist/css/arabic-math.min.css">
```

### unpkg

```html
<script src="https://unpkg.com/arabic-math-js@latest/dist/arabic-math.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/arabic-math-js@latest/dist/css/arabic-math.min.css">
```

### cdnjs

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/arabic-math-js/1.0.0/arabic-math.min.js"></script>
```

## 🐳 النشر باستخدام Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci --only=production

# نسخ الكود
COPY dist/ ./dist/
COPY public/ ./public/

# إنشاء خادم بسيط
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  arabic-math-demo:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - arabic-math-demo
    restart: unless-stopped
```

## ☁️ النشر السحابي

### AWS S3 + CloudFront

```bash
# تحميل إلى S3
aws s3 sync dist/ s3://your-bucket-name/arabic-math-js/ --delete

# إنشاء CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json

# تحديث cache
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

### Vercel

```json
{
  "name": "arabic-math-js",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

## 🎯 بيئات خاصة

### GitHub Pages

```yaml
# .github/workflows/gh-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Firebase Hosting

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## 🔧 تكوين الخادم

### nginx.conf

```nginx
server {
    listen 80;
    server_name arabic-math-js.com;
    
    # إعادة توجيه HTTP إلى HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name arabic-math-js.com;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Static files
    location /dist/ {
        alias /var/www/arabic-math-js/dist/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Main application
    location / {
        root /var/www/arabic-math-js;
        try_files $uri $uri/ /index.html;
    }
}
```

## 📊 مراقبة النشر

### Health Check Endpoint

```javascript
// server.js
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version,
        uptime: process.uptime()
    });
});

app.get('/metrics', (req, res) => {
    const memoryUsage = process.memoryUsage();
    
    res.json({
        memory: {
            rss: memoryUsage.rss,
            heapTotal: memoryUsage.heapTotal,
            heapUsed: memoryUsage.heapUsed,
            external: memoryUsage.external
        },
        uptime: process.uptime(),
        pid: process.pid,
        version: process.version
    });
});
```

### Monitoring Script

```bash
#!/bin/bash
# monitor-deployment.sh

URL="https://arabic-math-js.com/health"
EMAIL="admin@arabic-math-js.com"

# فحص الحالة
response=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $response -ne 200 ]; then
    echo "❌ الموقع لا يعمل - HTTP $response"
    
    # إرسال تنبيه
    echo "الموقع arabic-math-js.com لا يستجيب. HTTP Code: $response" | \
    mail -s "تنبيه: الموقع معطل" $EMAIL
    
    # محاولة إعادة تشغيل
    sudo systemctl restart arabic-math-js
    
    exit 1
else
    echo "✅ الموقع يعمل بشكل طبيعي"
fi
```

## 🔄 التحديث والصيانة

### صيانة دورية

```bash
#!/bin/bash
# maintenance.sh

echo "🔄 بدء الصيانة الدورية..."

# تحديث التبعيات
npm update

# فحص الثغرات
npm audit fix

# إعادة بناء
npm run build

# إعادة تشغيل
pm2 restart arabic-math-js

echo "✅ الصيانة مكتملة"
```

### Rollback Script

```bash
#!/bin/bash
# rollback.sh

if [ -z "$1" ]; then
    echo "الاستخدام: ./rollback.sh <version>"
    exit 1
fi

VERSION=$1

echo "🔄 العودة إلى الإصدار $VERSION..."

# تحميل الإصدار المحدد
npm install arabic-math-js@$VERSION

# إعادة بناء
npm run build

# إعادة تشغيل
pm2 restart arabic-math-js

echo "✅ تم الرجوع إلى الإصدار $VERSION"
```

## 📈 تحسين الأداء

### Gzip Compression

```nginx
# في nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

### Browser Caching

```javascript
// في Express server
app.use(express.static('dist', {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));
```

## 🛡️ الأمان في الإنتاج

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;">
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // حد الطلبات
    message: 'تم تجاوز حد الطلبات المسموح'
});

app.use('/api/', limiter);
```

## 🎯 خلاصة أفضل الممارسات

### قائمة مراجعة النشر

- [ ] تشغيل جميع الاختبارات
- [ ] فحص أمني شامل
- [ ] تحسين أحجام الملفات
- [ ] تفعيل HTTPS
- [ ] تكوين headers أمنية
- [ ] إعداد مراقبة الأداء
- [ ] تفعيل النسخ الاحتياطي
- [ ] اختبار خطة الطوارئ
- [ ] توثيق التغييرات
- [ ] إشعار المستخدمين

### مؤشرات الأداء الرئيسية

- **وقت التحميل**: < 3 ثواني
- **أول محتوى مرئي**: < 1.5 ثانية
- **التفاعل**: < 100ms
- **استهلاك الذاكرة**: < 50MB
- **معدل النجاح**: > 99.9%
```

هل تريد مني المتابعة مع المزيد من الملفات مثل ملفات المجتمع والمساهمة، أو التركيز على أي جانب معين من المشروع؟