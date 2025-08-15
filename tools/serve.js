/**
 * خادم التطوير المحلي
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const WebSocket = require('ws');

// Simple CLI args parser for --port and --host
function parseArgs(argv = []) {
    const out = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--port' && argv[i + 1]) {
            out.port = Number(argv[++i]);
        } else if (a.startsWith('--port=')) {
            out.port = Number(a.split('=')[1]);
        } else if (a === '--host' && argv[i + 1]) {
            out.host = argv[++i];
        } else if (a.startsWith('--host=')) {
            out.host = a.split('=')[1];
        }
    }
    return out;
}

class DevServer {
    constructor(options = {}) {
        this.port = options.port || Number(process.env.PORT) || 3000;
        this.host = options.host || process.env.HOST || 'localhost';
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
    const cli = parseArgs(process.argv.slice(2));
    const server = new DevServer(cli);
    server.start();
}

module.exports = DevServer;
