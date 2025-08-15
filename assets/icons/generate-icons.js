/**
 * مولد أيقونات المكتبة
 */
const fs = require('fs');
const path = require('path');

class IconGenerator {
    constructor() {
        this.baseIcon = `
            <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea"/>
                        <stop offset="100%" style="stop-color:#764ba2"/>
                    </linearGradient>
                </defs>
                
                <!-- خلفية دائرية -->
                <circle cx="32" cy="32" r="30" fill="url(#gradient)"/>
                
                <!-- رمز الرياضيات -->
                <text x="32" y="42" font-family="Arial, sans-serif" 
                      font-size="28" font-weight="bold" 
                      text-anchor="middle" fill="white">∑</text>
                
                <!-- نص عربي صغير -->
                <text x="32" y="55" font-family="Arial, sans-serif" 
                      font-size="8" text-anchor="middle" fill="white" opacity="0.8">عربي</text>
            </svg>
        `;
    }
    
    async generateAll() {
        console.log('🎨 إنشاء الأيقونات...');
        
        await this.createDirectories();
        await this.generateSVGIcons();
        await this.generatePNGIcons();
        await this.generateFavicons();
        await this.generateLogo();
        await this.createIconManifest();
        
        console.log('✅ تم إنشاء جميع الأيقونات');
    }
    
    async createDirectories() {
        const dirs = [
            'assets/icons',
            'assets/icons/svg',
            'assets/icons/png',
            'assets/icons/favicon',
            'assets/logos'
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    
    async generateSVGIcons() {
        const variations = {
            'icon-main': {
                gradient: ['#667eea', '#764ba2'],
                symbol: '∑',
                text: 'عربي'
            },
            'icon-dark': {
                gradient: ['#2d3748', '#1a202c'],
                symbol: '∫',
                text: 'رياضيات'
            },
            'icon-light': {
                gradient: ['#ffffff', '#f7fafc'],
                symbol: 'π',
                text: 'عربي',
                textColor: '#2d3748'
            }
        };
        
        for (const [name, config] of Object.entries(variations)) {
            const svg = this.createSVG(config);
            fs.writeFileSync(`assets/icons/svg/${name}.svg`, svg);
        }
    }
    
    createSVG(config) {
        const textColor = config.textColor || 'white';
        
        return `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${config.gradient[0]}"/>
            <stop offset="100%" style="stop-color:${config.gradient[1]}"/>
        </linearGradient>
        <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
    </defs>
    
    <circle cx="32" cy="32" r="30" fill="url(#gradient)" filter="url(#shadow)"/>
    
    <text x="32" y="42" font-family="Arial, sans-serif" 
          font-size="28" font-weight="bold" 
          text-anchor="middle" fill="${textColor}">${config.symbol}</text>
    
    <text x="32" y="55" font-family="Arial, sans-serif" 
          font-size="8" text-anchor="middle" fill="${textColor}" opacity="0.8">${config.text}</text>
</svg>`.trim();
    }
    
    async generatePNGIcons() {
        // هذا يتطلب مكتبة تحويل SVG إلى PNG مثل sharp أو puppeteer
        console.log('ملاحظة: تحويل PNG يتطلب مكتبة إضافية مثل sharp');
        
        const sizes = [16, 32, 48, 64, 128, 256, 512];
        const placeholder = 'ملفات PNG ستُنشأ هنا عند تثبيت sharp';
        
        sizes.forEach(size => {
            const dir = `assets/icons/png/${size}x${size}`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(`${dir}/icon.placeholder`, placeholder);
        });
    }
    
    async generateFavicons() {
        // إنشاء ملف favicon.ico placeholder
        const faviconSizes = [16, 32, 48];
        
        faviconSizes.forEach(size => {
            const svg = this.createSVG({
                gradient: ['#667eea', '#764ba2'],
                symbol: '∑',
                text: 'ع'
            });
            
            fs.writeFileSync(`assets/icons/favicon/favicon-${size}x${size}.svg`, svg);
        });
        
        // ملف manifest للـ web app
        const webManifest = {
            name: 'Arabic Math JS',
            short_name: 'ArabicMath',
            description: 'مكتبة الرياضيات العربية',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#667eea',
            icons: faviconSizes.map(size => ({
                src: `assets/icons/favicon/favicon-${size}x${size}.svg`,
                sizes: `${size}x${size}`,
                type: 'image/svg+xml'
            }))
        };
        
        fs.writeFileSync('assets/icons/favicon/manifest.json', JSON.stringify(webManifest, null, 2));
    }
    
    async generateLogo() {
        const logoSVG = `
<svg width="300" height="100" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
        </linearGradient>
    </defs>
    
    <!-- الأيقونة -->
    <circle cx="50" cy="50" r="35" fill="url(#logoGradient)"/>
    <text x="50" y="65" font-family="Arial, sans-serif" 
          font-size="32" font-weight="bold" 
          text-anchor="middle" fill="white">∑</text>
    
    <!-- النص الإنجليزي -->
    <text x="110" y="40" font-family="Arial, sans-serif" 
          font-size="24" font-weight="bold" fill="#2d3748">Arabic Math JS</text>
    
    <!-- النص العربي -->
    <text x="110" y="70" font-family="Arial, sans-serif" 
          font-size="16" fill="#718096">مكتبة الرياضيات العربية</text>
</svg>`.trim();
        
        fs.writeFileSync('assets/logos/logo.svg', logoSVG);
        
        // شعار مبسط
        const logoSimple = `
<svg width="200" height="50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="35" font-family="Arial, sans-serif" 
          font-size="20" font-weight="bold" fill="#667eea">Arabic Math JS</text>
</svg>`.trim();
        
        fs.writeFileSync('assets/logos/logo-simple.svg', logoSimple);
    }
    
    async createIconManifest() {
        const manifest = {
            name: 'Arabic Math JS Icons',
            version: '1.0.0',
            description: 'مجموعة أيقونات مكتبة الرياضيات العربية',
            icons: {
                svg: {
                    main: 'assets/icons/svg/icon-main.svg',
                    dark: 'assets/icons/svg/icon-dark.svg',
                    light: 'assets/icons/svg/icon-light.svg'
                },
                png: {
                    sizes: [16, 32, 48, 64, 128, 256, 512],
                    path: 'assets/icons/png/{size}x{size}/icon.png'
                },
                favicon: {
                    ico: 'assets/icons/favicon/favicon.ico',
                    svg: 'assets/icons/favicon/favicon.svg',
                    manifest: 'assets/icons/favicon/manifest.json'
                },
                logos: {
                    main: 'assets/logos/logo.svg',
                    simple: 'assets/logos/logo-simple.svg'
                }
            },
            usage: {
                web: 'استخدم favicon.svg للمواقع الإلكترونية',
                app: 'استخدم manifest.json للتطبيقات التقدمية',
                print: 'استخدم logo.svg للمواد المطبوعة',
                social: 'استخدم icon-main.svg لوسائل التواصل'
            }
        };
        
        fs.writeFileSync('assets/icons/manifest.json', JSON.stringify(manifest, null, 2));
    }
}

// تشغيل المولد
if (require.main === module) {
    const generator = new IconGenerator();
    generator.generateAll().catch(console.error);
}

module.exports = IconGenerator;
