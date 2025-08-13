'use strict';
// Simple font loader utility exposed globally
(function (root) {
  class FontLoader {
    constructor() {
      this.loadedFonts = new Set();
      this.fontPromises = new Map();
    }
    async loadFont(fontName, fontUrl) {
      if (this.loadedFonts.has(fontName)) return Promise.resolve();
      if (this.fontPromises.has(fontName)) return this.fontPromises.get(fontName);
      const p = this._load(fontName, fontUrl).then(() => {
        this.loadedFonts.add(fontName);
      }).catch((e) => { this.fontPromises.delete(fontName); throw e; });
      this.fontPromises.set(fontName, p);
      return p;
    }
    async _load(fontName, fontUrl) {
      if ('FontFace' in root) {
        const ff = new root.FontFace(fontName, `url(${fontUrl})`);
        await ff.load();
        root.document && root.document.fonts && root.document.fonts.add(ff);
        return;
      }
      return new Promise((resolve, reject) => {
        const style = document.createElement('style');
        style.textContent = `@font-face{font-family:"${fontName}";src:url('${fontUrl}') format('woff2');font-display:swap;}`;
        document.head.appendChild(style);
        // naive check via canvas width difference
        setTimeout(() => {
          try {
            const ok = this._isAvailable(fontName);
            if (ok) resolve(); else reject(new Error('Font not detected'));
          } catch (e) { reject(e); }
        }, 300);
      });
    }
    _isAvailable(fontName) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const str = 'ABCDEFG xyz 1234 π∞∑∫';
      ctx.font = '32px monospace';
      const w1 = ctx.measureText(str).width;
      ctx.font = `32px ${fontName}, monospace`;
      const w2 = ctx.measureText(str).width;
      return w1 !== w2;
    }
  }
  root.ArabicMathFontLoader = new FontLoader();
})(typeof self !== 'undefined' ? self : this);
