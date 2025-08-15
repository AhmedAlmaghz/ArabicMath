/**
 * محمل الخطوط العربية للرياضيات
 */
class FontLoader {
  constructor() {
      this.loadedFonts = new Set();
      this.fontPromises = new Map();
  }
  
  /**
   * تحميل خط عربي للرياضيات
   * @param {string} fontName - اسم الخط
   * @param {string} fontUrl - رابط الخط
   * @returns {Promise} وعد بتحميل الخط
   */
  async loadFont(fontName, fontUrl) {
      if (this.loadedFonts.has(fontName)) {
          return Promise.resolve();
      }
      
      if (this.fontPromises.has(fontName)) {
          return this.fontPromises.get(fontName);
      }
      
      const promise = this._loadFontFile(fontName, fontUrl);
      this.fontPromises.set(fontName, promise);
      
      try {
          await promise;
          this.loadedFonts.add(fontName);
          console.log(`✅ تم تحميل الخط: ${fontName}`);
      } catch (error) {
          console.error(`❌ فشل تحميل الخط ${fontName}:`, error);
          this.fontPromises.delete(fontName);
          throw error;
      }
      
      return promise;
  }
  
  async _loadFontFile(fontName, fontUrl) {
      // استخدام Font Loading API إذا متوفر
      if ('FontFace' in window) {
          const font = new FontFace(fontName, `url(${fontUrl})`);
          await font.load();
          document.fonts.add(font);
          return;
      }
      
      // طريقة بديلة باستخدام CSS
      return this._loadFontWithCSS(fontName, fontUrl);
  }
  
  _loadFontWithCSS(fontName, fontUrl) {
      return new Promise((resolve, reject) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = fontUrl;
          
          link.onload = () => resolve();
          link.onerror = () => reject(new Error(`فشل في تحميل ${fontUrl}`));
          
          document.head.appendChild(link);
          
          // timeout للحماية من التعليق
          setTimeout(() => {
              reject(new Error(`انتهت مهلة تحميل الخط ${fontName}`));
          }, 10000);
      });
  }
  
  /**
   * تحميل الخطوط الافتراضية للمكتبة
   */
  async loadDefaultFonts() {
      const defaultFonts = [
          {
              name: 'Amiri',
              url: 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap'
          },
          {
              name: 'Cairo',
              url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;700;900&display=swap'
          },
          {
              name: 'Scheherazade New',
              url: 'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap'
          }
      ];
      
      const loadPromises = defaultFonts.map(font => 
          this.loadFont(font.name, font.url).catch(error => {
              console.warn(`تحذير: لم يتم تحميل الخط ${font.name}`, error);
          })
      );
      
      await Promise.allSettled(loadPromises);
  }
  
  /**
   * التحقق من توفر خط معين
   * @param {string} fontName - اسم الخط
   * @returns {boolean} هل الخط متوفر
   */
  isFontAvailable(fontName) {
      return this.loadedFonts.has(fontName) || this._checkSystemFont(fontName);
  }
  
  _checkSystemFont(fontName) {
      const testString = 'mmmmmmmmmllli';
      const testSize = '72px';
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      context.font = `${testSize} monospace`;
      const baselineWidth = context.measureText(testString).width;
      
      context.font = `${testSize} ${fontName}, monospace`;
      const testWidth = context.measureText(testString).width;
      
      return testWidth !== baselineWidth;
  }
}

// تصدير مثيل عام
window.ArabicMathFontLoader = new FontLoader();
