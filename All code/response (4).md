

<think>

المستخدم يريد المتابعة، سأقدم باقي الملفات المهمة لإكمال المشروع:

1. أدوات التطوير (development tools)
2. ملفات التكوين الإضافية (configuration files)
3. اختبارات الأداء (performance tests)
4. ملفات النشر والتوزيع (deployment)
5. ملفات التوثيق المتقدم (advanced documentation)
6. ملفات الصيانة والتحديث (maintenance)
7. ملفات الأمان (security)
8. ملفات CI/CD

سأبدأ بأدوات التطوير ثم أكمل باقي الملفات.

</think>

ممتاز! سأكمل باقي الملفات المهمة لجعل المشروع متكاملاً واحترافياً:

## 🛠️ **12. أدوات التطوير - tools/**

### **tools/serve.js:**
```javascript
/**
 * خادم التطوير المحلي
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const WebSocket = require('ws');

class DevServer {
    constructor(options = {}) {
        this.port = options.port || 3000;
        this.host = options.host || 'localhost';
        this.app = express();
        this.wss = null;
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupFileWatcher();
    }
    
    setupMiddleware() {
        // تسجيل الطلبات
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
        
        // ملفات ثابتة
        this.app.use('/dist', express.static(path.join(__dirname, '../dist')));
        this.app.use('/src', express.static(path.join(__dirname, '../src')));
        this.app.use('/examples', express.static(path.join(__dirname, '../examples')));
        this.app.use('/tests', express.static(path.join(__dirname, '../tests')));
        
        // دعم CORS للتطوير
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }
    
    setupRoutes() {
        // الصفحة الرئيسية
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../examples/interactive-demo.html'));
        });
        
        // صفحة الاختبارات
        this.app.get('/tests', (req, res) => {
            res.sendFile(path.join(__dirname, '../tests/test-runner.html'));
        });
        
        // قائمة الأمثلة
        this.app.get('/api/examples', (req, res) => {
            const examplesDir = path.join(__dirname, '../examples');
            const examples = fs.readdirSync(examplesDir)
                .filter(file => file.endsWith('.html'))
                .map(file => ({
                    name: file.replace('.html', ''),
                    url: `/examples/${file}`,
                    title: this.extractTitle(path.join(examplesDir, file))
                }));
            
            res.json(examples);
        });
        
        // معلومات المشروع
        this.app.get('/api/info', (req, res) => {
            const packageJson = require('../package.json');
            res.json({
                name: packageJson.name,
                version: packageJson.version,
                description: packageJson.description,
                buildTime: this.getBuildTime(),
                filesCount: this.getFilesCount()
            });
        });
        
        // نقطة نهاية لترجمة فورية
        this.app.post('/api/translate', express.json(), (req, res) => {
            try {
                const { equation, options = {} } = req.body;
                
                // هنا سنحتاج لتحميل المكتبة في بيئة Node.js
                // أو استخدام API خارجي للترجمة
                
                res.json({
                    success: true,
                    original: equation,
                    translated: `[مترجم] ${equation}`, // placeholder
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
    }
    
    setupFileWatcher() {
        // مراقبة تغييرات الملفات لإعادة التحميل التلقائي
        const watcher = chokidar.watch([
            'src/**/*.js',
            'src/**/*.css',
            'examples/**/*.html',
            'tests/**/*.js'
        ], {
            ignored: /node_modules/,
            persistent: true
        });
        
        watcher.on('change', (filePath) => {
            console.log(`📝 تم تغيير الملف: ${filePath}`);
            this.broadcastReload();
        });
    }
    
    setupWebSocket() {
        const server = require('http').createServer(this.app);
        this.wss = new WebSocket.Server({ server });
        
        this.wss.on('connection', (ws) => {
            console.log('🔌 عميل جديد متصل');
            
            ws.on('close', () => {
                console.log('🔌 عميل منقطع');
            });
        });
        
        return server;
    }
    
    broadcastReload() {
        if (this.wss) {
            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'reload' }));
                }
            });
        }
    }
    
    extractTitle(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const titleMatch = content.match(/<title>(.*?)<\/title>/i);
            return titleMatch ? titleMatch[1] : path.basename(filePath, '.html');
        } catch (error) {
            return path.basename(filePath, '.html');
        }
    }
    
    getBuildTime() {
        try {
            const distPath = path.join(__dirname, '../dist');
            const stats = fs.statSync(distPath);
            return stats.mtime.toISOString();
        } catch (error) {
            return null;
        }
    }
    
    getFilesCount() {
        const countFiles = (dir) => {
            try {
                const files = fs.readdirSync(dir);
                let count = 0;
                
                files.forEach(file => {
                    const filePath = path.join(dir, file);
                    const stat = fs.statSync(filePath);
                    
                    if (stat.isDirectory()) {
                        count += countFiles(filePath);
                    } else {
                        count++;
                    }
                });
                
                return count;
            } catch (error) {
                return 0;
            }
        };
        
        return {
            src: countFiles(path.join(__dirname, '../src')),
            examples: countFiles(path.join(__dirname, '../examples')),
            tests: countFiles(path.join(__dirname, '../tests'))
        };
    }
    
    start() {
        const server = this.setupWebSocket();
        
        server.listen(this.port, this.host, () => {
            console.log(`
🚀 خادم التطوير يعمل على:
   📍 العنوان: http://${this.host}:${this.port}
   📁 الأمثلة: http://${this.host}:${this.port}/examples/
   🧪 الاختبارات: http://${this.host}:${this.port}/tests
   📊 معلومات: http://${this.host}:${this.port}/api/info

🔄 مراقبة الملفات مفعلة - سيتم إعادة التحميل التلقائي
⏹️  اضغط Ctrl+C للإيقاف
            `);
        });
        
        // معالجة الإيقاف النظيف
        process.on('SIGINT', () => {
            console.log('\n⏹️  إيقاف الخادم...');
            server.close(() => {
                console.log('✅ تم إيقاف الخادم بنجاح');
                process.exit(0);
            });
        });
    }
}

// تشغيل الخادم إذا تم استدعاء الملف مباشرة
if (require.main === module) {
    const server = new DevServer();
    server.start();
}

module.exports = DevServer;
```

### **tools/build-advanced.js:**
```javascript
/**
 * نظام بناء متقدم للمكتبة
 */
const fs = require('fs').promises;
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const babel = require('@babel/core');
const rollup = require('rollup');
const typescript = require('typescript');
const sass = require('sass');

class AdvancedBuilder {
    constructor(config = {}) {
        this.config = {
            srcDir: path.resolve('src'),
            distDir: path.resolve('dist'),
            tempDir: path.resolve('.temp'),
            outputFormats: ['umd', 'esm', 'cjs'],
            minify: true,
            sourceMaps: true,
            typescript: false,
            babel: true,
            ...config
        };
        
        this.stats = {
            startTime: Date.now(),
            files: { processed: 0, generated: 0 },
            sizes: { original: 0, minified: 0 }
        };
    }
    
    async build() {
        console.log('🏗️  بدء عملية البناء المتقدم...\n');
        
        try {
            await this.cleanup();
            await this.createDirectories();
            
            // بناء JavaScript
            await this.buildJavaScript();
            
            // بناء CSS
            await this.buildCSS();
            
            // بناء TypeScript definitions
            await this.buildTypeDefinitions();
            
            // إنشاء ملفات package
            await this.generatePackageFiles();
            
            // إنشاء التوثيق
            await this.generateDocs();
            
            // تحليل النتائج
            await this.analyzeBundle();
            
            this.printStats();
            
        } catch (error) {
            console.error('❌ فشل البناء:', error);
            throw error;
        }
    }
    
    async cleanup() {
        console.log('🧹 تنظيف المجلدات السابقة...');
        
        try {
            await fs.rmdir(this.config.distDir, { recursive: true });
            await fs.rmdir(this.config.tempDir, { recursive: true });
        } catch (error) {
            // المجلدات غير موجودة، لا مشكلة
        }
    }
    
    async createDirectories() {
        const dirs = [
            this.config.distDir,
            this.config.tempDir,
            path.join(this.config.distDir, 'types'),
            path.join(this.config.distDir, 'css'),
            path.join(this.config.distDir, 'fonts')
        ];
        
        for (const dir of dirs) {
            await fs.mkdir(dir, { recursive: true });
        }
    }
    
    async buildJavaScript() {
        console.log('⚙️  بناء JavaScript...');
        
        // قراءة الملفات المصدرية
        const sourceFiles = await this.collectSourceFiles();
        
        // معالجة كل تنسيق إخراج
        for (const format of this.config.outputFormats) {
            await this.buildFormat(sourceFiles, format);
        }
    }
    
    async collectSourceFiles() {
        const files = [];
        const collectFromDir = async (dir, basePath = '') => {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.join(basePath, entry.name);
                
                if (entry.isDirectory()) {
                    await collectFromDir(fullPath, relativePath);
                } else if (entry.name.endsWith('.js')) {
                    const content = await fs.readFile(fullPath, 'utf8');
                    files.push({
                        path: relativePath,
                        fullPath,
                        content,
                        size: content.length
                    });
                    
                    this.stats.sizes.original += content.length;
                    this.stats.files.processed++;
                }
            }
        };
        
        await collectFromDir(this.config.srcDir);
        return files;
    }
    
    async buildFormat(sourceFiles, format) {
        console.log(`  📦 بناء تنسيق ${format.toUpperCase()}...`);
        
        // ترتيب الملفات حسب التبعيات
        const orderedFiles = this.orderFilesByDependencies(sourceFiles);
        
        // دمج الملفات
        let combinedContent = this.generateWrapper(format, 'start');
        
        for (const file of orderedFiles) {
            let content = file.content;
            
            // معالجة Babel إذا مطلوبة
            if (this.config.babel) {
                content = await this.processBabel(content, file.fullPath);
            }
            
            combinedContent += `\n// === ${file.path} ===\n`;
            combinedContent += content;
        }
        
        combinedContent += this.generateWrapper(format, 'end');
        
        // الملف العادي
        const filename = `arabic-math.${format}.js`;
        const filepath = path.join(this.config.distDir, filename);
        await fs.writeFile(filepath, combinedContent);
        
        this.stats.files.generated++;
        
        // الملف المصغر
        if (this.config.minify) {
            const minified = await this.minifyJS(combinedContent, filename);
            const minFilepath = path.join(this.config.distDir, `arabic-math.${format}.min.js`);
            
            let output = minified.code;
            if (this.config.sourceMaps && minified.map) {
                output += `\n//# sourceMappingURL=${path.basename(minFilepath)}.map`;
                await fs.writeFile(`${minFilepath}.map`, minified.map);
            }
            
            await fs.writeFile(minFilepath, output);
            this.stats.sizes.minified += minified.code.length;
            this.stats.files.generated += this.config.sourceMaps ? 2 : 1;
        }
    }
    
    orderFilesByDependencies(files) {
        // ترتيب بسيط: القواميس أولاً، ثم المساعدات، ثم الفئات الأساسية
        const order = [
            'dictionaries/',
            'utils/',
            'core/translator.js',
            'core/parser.js',
            'core/renderer.js',
            'core/ArabicMath.js',
            'index.js'
        ];
        
        const ordered = [];
        const remaining = [...files];
        
        // إضافة الملفات حسب الترتيب المحدد
        for (const pattern of order) {
            const matchingFiles = remaining.filter(file => 
                file.path.includes(pattern)
            );
            
            ordered.push(...matchingFiles);
            
            // إزالة الملفات المضافة من القائمة المتبقية
            matchingFiles.forEach(file => {
                const index = remaining.indexOf(file);
                if (index > -1) remaining.splice(index, 1);
            });
        }
        
        // إضافة أي ملفات متبقية
        ordered.push(...remaining);
        
        return ordered;
    }
    
    generateWrapper(format, position) {
        const wrappers = {
            umd: {
                start: `
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.ArabicMath = {}));
}(this, (function (exports) { 'use strict';
`,
                end: `
// Export main class
exports.ArabicMath = ArabicMath;
exports.default = ArabicMath;

Object.defineProperty(exports, '__esModule', { value: true });

})));
`
            },
            esm: {
                start: `// ES Module build of Arabic Math JS\n`,
                end: `\n// Export main class\nexport default ArabicMath;\nexport { ArabicMath };\n`
            },
            cjs: {
                start: `// CommonJS build of Arabic Math JS\n'use strict';\n`,
                end: `\n// Export main class\nmodule.exports = ArabicMath;\nmodule.exports.ArabicMath = ArabicMath;\nmodule.exports.default = ArabicMath;\n`
            }
        };
        
        return wrappers[format] ? wrappers[format][position] || '' : '';
    }
    
    async processBabel(code, filename) {
        const result = await babel.transformAsync(code, {
            filename,
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
                    }
                }]
            ],
            compact: false
        });
        
        return result.code;
    }
    
    async minifyJS(code, filename) {
        return await minify(code, {
            compress: {
                dead_code: true,
                drop_console: false,
                drop_debugger: true,
                keep_fargs: false,
                unsafe: true,
                unsafe_comps: true,
                unsafe_math: true,
                passes: 2
            },
            mangle: {
                toplevel: true,
                keep_fnames: false
            },
            output: {
                comments: false,
                beautify: false,
                ascii_only: true
            },
            sourceMap: this.config.sourceMaps ? {
                filename: filename,
                url: `${filename}.map`
            } : false
        });
    }
    
    async buildCSS() {
        console.log('🎨 بناء CSS...');
        
        const cssFiles = await this.collectCSSFiles();
        
        for (const file of cssFiles) {
            let content = file.content;
            
            // معالجة Sass إذا كان الملف .scss
            if (file.path.endsWith('.scss')) {
                const result = sass.renderSync({
                    data: content,
                    outputStyle: 'expanded'
                });
                content = result.css.toString();
            }
            
            // الملف العادي
            const normalPath = path.join(this.config.distDir, 'css', file.name);
            await fs.writeFile(normalPath, content);
            
            // الملف المصغر
            const minified = new CleanCSS({
                level: 2,
                returnPromise: true
            }).minify(content);
            
            const minPath = path.join(this.config.distDir, 'css', 
                file.name.replace('.css', '.min.css'));
            await fs.writeFile(minPath, (await minified).styles);
            
            this.stats.files.generated += 2;
        }
    }
    
    async collectCSSFiles() {
        const files = [];
        const stylesDir = path.join(this.config.srcDir, 'styles');
        
        try {
            const entries = await fs.readdir(stylesDir);
            
            for (const entry of entries) {
                if (entry.endsWith('.css') || entry.endsWith('.scss')) {
                    const fullPath = path.join(stylesDir, entry);
                    const content = await fs.readFile(fullPath, 'utf8');
                    
                    files.push({
                        name: entry.replace('.scss', '.css'),
                        path: entry,
                        fullPath,
                        content
                    });
                }
            }
        } catch (error) {
            console.warn('⚠️  لم يتم العثور على مجلد الأنماط');
        }
        
        return files;
    }
    
    async buildTypeDefinitions() {
        console.log('📘 بناء تعريفات TypeScript...');
        
        // نسخ ملف التعريفات الرئيسي
        const sourceTypesPath = path.resolve('index.d.ts');
        const targetTypesPath = path.join(this.config.distDir, 'types', 'index.d.ts');
        
        try {
            const typesContent = await fs.readFile(sourceTypesPath, 'utf8');
            await fs.writeFile(targetTypesPath, typesContent);
            
            // إنشاء ملف types مبسط في الجذر
            const simplifiedTypes = `export * from './types/index';\nexport { default } from './types/index';\n`;
            await fs.writeFile(path.join(this.config.distDir, 'index.d.ts'), simplifiedTypes);
            
            this.stats.files.generated += 2;
        } catch (error) {
            console.warn('⚠️  لم يتم العثور على ملف التعريفات index.d.ts');
        }
    }
    
    async generatePackageFiles() {
        console.log('📦 إنشاء ملفات الحزمة...');
        
        // package.json للتوزيع
        const distPackageJson = {
            name: 'arabic-math-js',
            version: require('../package.json').version,
            description: 'مكتبة جافا سكريبت متقدمة لترجمة وعرض المعادلات الرياضية باللغة العربية',
            main: 'arabic-math.cjs.js',
            module: 'arabic-math.esm.js',
            browser: 'arabic-math.umd.js',
            types: 'index.d.ts',
            files: [
                'arabic-math.*.js',
                'index.d.ts',
                'types/',
                'css/',
                'fonts/',
                'README.md',
                'LICENSE'
            ],
            keywords: [
                'arabic', 'math', 'mathematics', 'rtl', 'latex', 
                'mathjax', 'katex', 'equations', 'translation'
            ],
            author: require('../package.json').author,
            license: require('../package.json').license,
            repository: require('../package.json').repository,
            bugs: require('../package.json').bugs,
            homepage: require('../package.json').homepage,
            peerDependencies: {
                'mathjax': '^3.0.0'
            }
        };
        
        await fs.writeFile(
            path.join(this.config.distDir, 'package.json'),
            JSON.stringify(distPackageJson, null, 2)
        );
        
        // نسخ ملفات مهمة
        const filesToCopy = ['README.md', 'LICENSE', 'CHANGELOG.md'];
        
        for (const file of filesToCopy) {
            try {
                const content = await fs.readFile(file, 'utf8');
                await fs.writeFile(path.join(this.config.distDir, file), content);
                this.stats.files.generated++;
            } catch (error) {
                console.warn(`⚠️  لم يتم العثور على ${file}`);
            }
        }
    }
    
    async generateDocs() {
        console.log('📚 إنشاء التوثيق...');
        
        // إنشاء README مبسط للتوزيع
        const quickStart = `
# 🔢 Arabic Math JS

مكتبة JavaScript لترجمة وعرض المعادلات الرياضية باللغة العربية.

## التثبيت

\`\`\`bash
npm install arabic-math-js
\`\`\`

## الاستخدام السريع

\`\`\`javascript
import ArabicMath from 'arabic-math-js';

const arabicMath = new ArabicMath();
arabicMath.render('#equation', 'sin(x) + cos(y) = 1');
\`\`\`

للتوثيق الكامل، راجع: [https://github.com/username/arabic-math-js](https://github.com/username/arabic-math-js)
`;
        
        await fs.writeFile(path.join(this.config.distDir, 'QUICKSTART.md'), quickStart.trim());
        this.stats.files.generated++;
    }
    
    async analyzeBundle() {
        console.log('🔍 تحليل الحزمة...');
        
        const analysis = {
            timestamp: new Date().toISOString(),
            version: require('../package.json').version,
            files: {},
            totalSize: { original: 0, minified: 0, gzipped: 0 },
            formats: this.config.outputFormats
        };
        
        // تحليل أحجام الملفات
        const files = await fs.readdir(this.config.distDir);
        
        for (const file of files) {
            if (file.endsWith('.js')) {
                const filePath = path.join(this.config.distDir, file);
                const stats = await fs.stat(filePath);
                
                analysis.files[file] = {
                    size: stats.size,
                    sizeFormatted: this.formatBytes(stats.size)
                };
                
                if (file.includes('.min.')) {
                    analysis.totalSize.minified += stats.size;
                } else {
                    analysis.totalSize.original += stats.size;
                }
            }
        }
        
        // حفظ تحليل الحزمة
        await fs.writeFile(
            path.join(this.config.distDir, 'bundle-analysis.json'),
            JSON.stringify(analysis, null, 2)
        );
        
        this.bundleAnalysis = analysis;
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    printStats() {
        const endTime = Date.now();
        const duration = endTime - this.stats.startTime;
        
        console.log(`
✅ اكتملت عملية البناء بنجاح!

📊 الإحصائيات:
   ⏱️  المدة: ${duration}ms
   📁 الملفات المعالجة: ${this.stats.files.processed}
   📦 الملفات المولدة: ${this.stats.files.generated}
   
📏 الأحجام:
   📄 الأصلي: ${this.formatBytes(this.stats.sizes.original)}
   🗜️  المصغر: ${this.formatBytes(this.stats.sizes.minified)}
   📉 التوفير: ${Math.round((1 - this.stats.sizes.minified / this.stats.sizes.original) * 100)}%

📦 التنسيقات: ${this.config.outputFormats.join(', ').toUpperCase()}

🎯 الملفات جاهزة في: ${this.config.distDir}
        `);
        
        if (this.bundleAnalysis) {
            console.log('📊 تحليل مفصل محفوظ في: bundle-analysis.json');
        }
    }
}

// تشغيل البناء إذا تم استدعاء الملف مباشرة
if (require.main === module) {
    const builder = new AdvancedBuilder();
    
    builder.build().catch(error => {
        console.error('فشل البناء:', error);
        process.exit(1);
    });
}

module.exports = AdvancedBuilder;
```

## 🧪 **13. اختبارات الأداء - tests/performance/**

### **tests/performance/benchmark.js:**
```javascript
/**
 * اختبارات الأداء والمقارنة المرجعية
 */
class PerformanceBenchmark {
    constructor() {
        this.results = [];
        this.arabicMath = null;
    }
    
    async setup() {
        console.log('🚀 إعداد اختبارات الأداء...');
        
        // انتظار تحميل المكتبة
        while (typeof ArabicMath === 'undefined') {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.arabicMath = new ArabicMath({
            rtl: true,
            mathRenderer: 'mathjax',
            autoTranslate: true
        });
        
        console.log('✅ الإعداد مكتمل');
    }
    
    async runAllBenchmarks() {
        await this.setup();
        
        console.log('📊 بدء اختبارات الأداء...\n');
        
        // اختبارات الترجمة
        await this.benchmarkTranslation();
        
        // اختبارات العرض
        await this.benchmarkRendering();
        
        // اختبارات الذاكرة
        await this.benchmarkMemory();
        
        // اختبارات التعقيد
        await this.benchmarkComplexity();
        
        // طباعة النتائج النهائية
        this.printSummary();
    }
    
    async benchmarkTranslation() {
        console.log('🔄 اختبار أداء الترجمة...');
        
        const testCases = [
            { name: 'معادلة بسيطة', eq: 'sin(x) + cos(y) = 1' },
            { name: 'نهاية', eq: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },
            { name: 'تكامل', eq: '\\int_0^1 x^2 dx = \\frac{1}{3}' },
            { name: 'مجموع', eq: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}' },
            { name: 'معادلة معقدة', eq: '\\frac{d^2}{dx^2}[\\sin(\\cos(x^2))] = \\cos(\\cos(x^2)) \\cdot \\sin^2(x^2) - \\sin(\\cos(x^2)) \\cdot [\\cos(x^2) + 4x^2\\sin(x^2)]' }
        ];
        
        for (const testCase of testCases) {
            const times = [];
            const iterations = 1000;
            
            // إحماء
            for (let i = 0; i < 10; i++) {
                this.arabicMath.translate(testCase.eq);
            }
            
            // القياس الفعلي
            for (let i = 0; i < iterations; i++) {
                const start = performance.now();
                this.arabicMath.translate(testCase.eq);
                const end = performance.now();
                times.push(end - start);
            }
            
            const stats = this.calculateStats(times);
            
            this.results.push({
                category: 'ترجمة',
                test: testCase.name,
                iterations,
                ...stats
            });
            
            console.log(`  ✅ ${testCase.name}: ${stats.average.toFixed(2)}ms ±${stats.stdDev.toFixed(2)}`);
        }
    }
    
    async benchmarkRendering() {
        console.log('🎨 اختبار أداء العرض...');
        
        const testCases = [
            'f(x) = sin(x)',
            '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
            '\\int_0^\\pi \\sin(x) dx',
            '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}',
            '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'
        ];
        
        for (const equation of testCases) {
            const times = [];
            const iterations = 100;
            
            for (let i = 0; i < iterations; i++) {
                // إنشاء عنصر جديد لكل اختبار
                const container = document.createElement('div');
                document.body.appendChild(container);
                
                const start = performance.now();
                await this.arabicMath.render(container, equation);
                const end = performance.now();
                
                times.push(end - start);
                
                // تنظيف
                document.body.removeChild(container);
            }
            
            const stats = this.calculateStats(times);
            
            this.results.push({
                category: 'عرض',
                test: equation.substring(0, 30) + '...',
                iterations,
                ...stats
            });
            
            console.log(`  ✅ ${equation.substring(0, 30)}...: ${stats.average.toFixed(2)}ms`);
        }
    }
    
    async benchmarkMemory() {
        console.log('💾 اختبار استهلاك الذاكرة...');
        
        if (!performance.memory) {
            console.log('  ⚠️  معلومات الذاكرة غير متوفرة في هذا المتصفح');
            return;
        }
        
        const initialMemory = performance.memory.usedJSHeapSize;
        
        // إنشاء عدد كبير من المعادلات
        const containers = [];
        const equations = [
            'sin(x) + cos(y)',
            '\\int_0^1 x^2 dx',
            '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
            '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}'
        ];
        
        const testCount = 500;
        const start = performance.now();
        
        for (let i = 0; i < testCount; i++) {
            const container = document.createElement('div');
            document.body.appendChild(container);
            
            const equation = equations[i % equations.length];
            await this.arabicMath.render(container, equation);
            
            containers.push(container);
        }
        
        const afterCreation = performance.memory.usedJSHeapSize;
        const creationTime = performance.now() - start;
        
        // تنظيف
        const cleanupStart = performance.now();
        containers.forEach(container => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });
        
        // إجبار garbage collection
        if (window.gc) {
            window.gc();
        }
        
        const afterCleanup = performance.memory.usedJSHeapSize;
        const cleanupTime = performance.now() - cleanupStart;
        
        this.results.push({
            category: 'ذاكرة',
            test: `${testCount} معادلة`,
            memoryBefore: this.formatBytes(initialMemory),
            memoryAfter: this.formatBytes(afterCreation),
            memoryAfterCleanup: this.formatBytes(afterCleanup),
            memoryUsed: this.formatBytes(afterCreation - initialMemory),
            memoryLeaked: this.formatBytes(afterCleanup - initialMemory),
            creationTime: creationTime.toFixed(2),
            cleanupTime: cleanupTime.toFixed(2)
        });
        
        console.log(`  ✅ إنشاء ${testCount} معادلة: ${creationTime.toFixed(2)}ms`);
        console.log(`  ✅ استهلاك الذاكرة: ${this.formatBytes(afterCreation - initialMemory)}`);
        console.log(`  ✅ تسريب الذاكرة: ${this.formatBytes(afterCleanup - initialMemory)}`);
    }
    
    async benchmarkComplexity() {
        console.log('🧮 اختبار التعقيد والتوسع...');
        
        const complexityTests = [
            { size: 10, desc: 'صغير' },
            { size: 50, desc: 'متوسط' },
            { size: 100, desc: 'كبير' },
            { size: 200, desc: 'ضخم' }
        ];
        
        for (const test of complexityTests) {
            // إنشاء معادلة معقدة بناءً على الحجم
            let equation = 'f(x) = ';
            for (let i = 0; i < test.size; i++) {
                if (i > 0) equation += ' + ';
                equation += `a_${i} \\cdot \\sin(${i}x)`;
            }
            
            const times = [];
            const iterations = Math.max(1, Math.floor(100 / test.size));
            
            for (let i = 0; i < iterations; i++) {
                const start = performance.now();
                this.arabicMath.translate(equation);
                const end = performance.now();
                times.push(end - start);
            }
            
            const stats = this.calculateStats(times);
            
            this.results.push({
                category: 'تعقيد',
                test: `${test.desc} (${test.size} حد)`,
                iterations,
                equationLength: equation.length,
                ...stats
            });
            
            console.log(`  ✅ ${test.desc} (${test.size} حد): ${stats.average.toFixed(2)}ms`);
        }
    }
    
    calculateStats(times) {
        const sorted = [...times].sort((a, b) => a - b);
        const sum = times.reduce((a, b) => a + b, 0);
        const average = sum / times.length;
        
        const variance = times.reduce((acc, time) => {
            return acc + Math.pow(time - average, 2);
        }, 0) / times.length;
        
        const stdDev = Math.sqrt(variance);
        
        return {
            min: sorted[0],
            max: sorted[sorted.length - 1],
            average,
            median: sorted[Math.floor(sorted.length / 2)],
            stdDev,
            p95: sorted[Math.floor(sorted.length * 0.95)],
            p99: sorted[Math.floor(sorted.length * 0.99)]
        };
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    printSummary() {
        console.log('\n📊 ملخص نتائج الأداء:');
        console.log('='.repeat(50));
        
        const categories = [...new Set(this.results.map(r => r.category))];
        
        for (const category of categories) {
            console.log(`\n🏷️  ${category}:`);
            
            const categoryResults = this.results.filter(r => r.category === category);
            
            if (category === 'ذاكرة') {
                categoryResults.forEach(result => {
                    console.log(`  📊 ${result.test}:`);
                    console.log(`     استهلاك: ${result.memoryUsed}`);
                    console.log(`     تسريب: ${result.memoryLeaked}`);
                    console.log(`     زمن الإنشاء: ${result.creationTime}ms`);
                });
            } else {
                categoryResults.forEach(result => {
                    console.log(`  ⚡ ${result.test}: ${result.average.toFixed(2)}ms (±${result.stdDev.toFixed(2)})`);
                    console.log(`     نطاق: ${result.min.toFixed(2)}ms - ${result.max.toFixed(2)}ms`);
                });
            }
        }
        
        // توصيات الأداء
        this.generateRecommendations();
    }
    
    generateRecommendations() {
        console.log('\n💡 توصيات تحسين الأداء:');
        console.log('='.repeat(50));
        
        const translationResults = this.results.filter(r => r.category === 'ترجمة');
        const avgTranslationTime = translationResults.reduce((acc, r) => acc + r.average, 0) / translationResults.length;
        
        if (avgTranslationTime > 10) {
            console.log('⚠️  الترجمة بطيئة - فكر في تحسين خوارزمية البحث والاستبدال');
        }
        
        const renderingResults = this.results.filter(r => r.category === 'عرض');
        const avgRenderingTime = renderingResults.reduce((acc, r) => acc + r.average, 0) / renderingResults.length;
        
        if (avgRenderingTime > 100) {
            console.log('⚠️  العرض بطيء - فكر في تحسين تفاعل MathJax أو التخزين المؤقت');
        }
        
        const memoryResults = this.results.filter(r => r.category === 'ذاكرة');
        if (memoryResults.length > 0) {
            const memoryLeak = parseInt(memoryResults[0].memoryLeaked);
            if (memoryLeak > 1024 * 1024) { // أكثر من 1MB
                console.log('⚠️  تسريب ذاكرة محتمل - تحقق من تنظيف العناصر والمتغيرات');
            }
        }
        
        console.log('✅ اختبارات الأداء مكتملة!');
    }
    
    exportResults(format = 'json') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `benchmark-results-${timestamp}.${format}`;
        
        if (format === 'json') {
            const data = JSON.stringify({
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                results: this.results
            }, null, 2);
            
            this.downloadFile(filename, data, 'application/json');
        } else if (format === 'csv') {
            const csvData = this.convertToCSV(this.results);
            this.downloadFile(filename, csvData, 'text/csv');
        }
        
        console.log(`📁 تم تصدير النتائج إلى: ${filename}`);
    }
    
    convertToCSV(data) {
        const headers = Object.keys(data[0]);
        const rows = data.map(row => 
            headers.map(header => 
                typeof row[header] === 'object' ? JSON.stringify(row[header]) : row[header]
            ).join(',')
        );
        
        return [headers.join(','), ...rows].join('\n');
    }
    
    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// تشغيل الاختبارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.performanceBenchmark = new PerformanceBenchmark();
    
    // إضافة أزرار للواجهة
    const buttonsContainer = document.createElement('div');
    buttonsContainer.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; z-index: 1000; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <button onclick="performanceBenchmark.runAllBenchmarks()" style="margin: 5px; padding: 10px;">
                🚀 تشغيل اختبارات الأداء
            </button>
            <button onclick="performanceBenchmark.exportResults('json')" style="margin: 5px; padding: 10px;">
                📊 تصدير JSON
            </button>
            <button onclick="performanceBenchmark.exportResults('csv')" style="margin: 5px; padding: 10px;">
                📈 تصدير CSV
            </button>
        </div>
    `;
    document.body.appendChild(buttonsContainer);
});
```

هل تريد مني المتابعة مع ملفات CI/CD، ملفات الأمان، أو أي ملفات أخرى مهمة للمشروع؟