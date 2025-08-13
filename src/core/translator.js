(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../dictionaries/symbols'));
  } else {
    root.ArabicMathTranslator = factory(root.ArabicMathDictionaries);
  }
})(typeof self !== 'undefined' ? self : this, function (Dictionaries) {
  'use strict';

  const dict = (function resolveDict(d) {
    try {
      // CommonJS default export handling
      if (d && d.default) return d.default;
      return d || {};
    } catch (_) {
      return {};
    }
  })(Dictionaries);

  const SYM = dict.MathSymbols || {};
  const FUN = dict.MathFunctions || {};
  const OPS = dict.MathOperations || {};
  const DIGITS = dict.ArabicDigitsMap || {};

  class Translator {
    constructor(options = {}) {
      this.options = {
        translateNumbers: options.translateNumbers !== false,
        translateFunctions: options.translateFunctions !== false,
        translateVariables: options.translateVariables !== false,
        flipArrows: options.flipArrows !== false
      };
    }

    translate(input) {
      if (!input || typeof input !== 'string') return '';
      let out = input;
      if (this.options.translateFunctions) out = this.translateFunctions(out);
      if (this.options.translateVariables) out = this.translateSymbols(out);
      if (this.options.translateNumbers) out = this.translateNumbers(out);
      if (this.options.flipArrows) out = this.flipArrows(out);
      return out;
    }

    translateSymbols(str) {
      // Replace whole-word symbols first (alpha, beta, ...)
      const wordKeys = Object.keys(SYM).filter(k => /[A-Za-z]+/.test(k)).sort((a,b)=>b.length-a.length);
      for (const key of wordKeys) {
        const re = new RegExp(`\\b${this.escapeReg(key)}\\b`, 'g');
        str = str.replace(re, SYM[key]);
      }
      // Replace single-char variables
      return str.replace(/[A-Za-z]/g, (ch) => SYM[ch] || ch);
    }

    translateFunctions(str) {
      const keys = Object.keys(FUN).sort((a,b)=>b.length-a.length);
      for (const key of keys) {
        const re = new RegExp(`\\b${this.escapeReg(key)}\\b`, 'g');
        str = str.replace(re, FUN[key]);
      }
      return str;
    }

    translateNumbers(str) {
      return str.replace(/\d/g, (d) => DIGITS[d] || d);
    }

    flipArrows(str) {
      const keys = Object.keys(OPS).filter(k => ['→','←','⟹','⟸','↔','⟺'].includes(k));
      for (const key of keys) {
        const re = new RegExp(this.escapeReg(key), 'g');
        str = str.replace(re, OPS[key]);
      }
      return str;
    }

    escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  }

  return Translator;
});
