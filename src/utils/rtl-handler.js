(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ArabicMathRTL = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F]+/g;

  const RTL = {
    ensureRTL(text) {
      if (!text) return '';
      // Wrap Arabic runs with RLE/PDF to force RTL where mixed
      return String(text).replace(ARABIC_RE, (m) => `\u202B${m}\u202C`);
    },

    isRTLChar(ch) {
      return /[\u0600-\u06FF\u0750-\u077F]/.test(ch || '');
    },

    normalizeMixed(text) {
      if (!text) return '';
      // Remove stray bidi controls then re-apply for Arabic runs
      return String(text)
        .replace(/[\u202A-\u202E\u2066-\u2069]/g, '')
        .replace(ARABIC_RE, (m) => `\u202B${m}\u202C`);
    },

    applyToElement(el) {
      if (!el) return;
      el.setAttribute('dir', 'rtl');
      el.classList.add('arabic-math');
      // Improve bidi in nested inline blocks
      el.style.unicodeBidi = 'isolate-override';
      el.style.direction = 'rtl';
    }
  };

  return RTL;
});
