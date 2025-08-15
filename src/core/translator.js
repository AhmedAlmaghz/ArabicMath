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
        flipArrows: options.flipArrows !== false,
        // NEW: Translate LaTeX command tokens like \sin, \cos, \alpha ...
        // Structural commands like \frac, \sqrt, \begin, \end are preserved.
        translateLatexCommands: options.translateLatexCommands === true,
        // RTL mirroring should generally be handled by RTLHandler outside the translator
        // to avoid double processing. Enable only when using Translator standalone.
        applyRTL: options.applyRTL === true
      };
    }

    translate(input) {
      if (!input || typeof input !== 'string') return '';
      let out = input;
      
      // Step 1: Translate LaTeX commands first (structural)
      if (this.options.translateLatexCommands) out = this.translateLatexCommands(out);
      
      // Step 2: Translate functions
      if (this.options.translateFunctions) out = this.translateFunctions(out);
      
      // Step 3: Translate variables and symbols
      if (this.options.translateVariables) out = this.translateSymbols(out);
      
      // Step 4: Translate numbers to Arabic numerals
      if (this.options.translateNumbers) out = this.translateNumbers(out);
      
      // Step 5: Apply RTL mirroring and rearrangement (opt-in)
      // By default, RTL handling is performed by RTLHandler in ArabicMath.translate().
      if (this.options.applyRTL) {
        out = this.mirrorMathSymbols(out);
      }
      
      // Step 6: Final cleanup and formatting
      out = this.formatForRTL(out);
      
      return out;
    }

    // Mask LaTeX command tokens (e.g., \frac, \sqrt, \alpha, \sum) to preserve them
    _maskCommands(str) {
      const commands = [];
      const masked = str.replace(/\\[A-Za-z]+/g, (m) => {
        const id = commands.length;
        commands.push(m);
        return `__CMD${id}__`;
      });
      return { masked, commands };
    }

    _unmaskCommands(str, commands) {
      return str.replace(/__CMD(\d+)__/g, (_, i) => commands[Number(i)] || _);
    }

    translateSymbols(str) {
      const { masked, commands } = this._maskCommands(str);
      let s = masked;
      // Replace whole-word symbols first (alpha, beta, ...)
      const wordKeys = Object.keys(SYM).filter(k => /[A-Za-z]+/.test(k)).sort((a,b)=>b.length-a.length);
      for (const key of wordKeys) {
        const re = new RegExp(`\\b${this.escapeReg(key)}\\b`, 'g');
        s = s.replace(re, SYM[key]);
      }
      // Replace single-char variables
      s = s.replace(/[A-Za-z]/g, (ch) => SYM[ch] || ch);
      return this._unmaskCommands(s, commands);
    }

    translateFunctions(str) {
      const { masked, commands } = this._maskCommands(str);
      let s = masked;
      const keys = Object.keys(FUN).sort((a,b)=>b.length-a.length);
      for (const key of keys) {
        const re = new RegExp(`\\b${this.escapeReg(key)}\\b`, 'g');
        s = s.replace(re, FUN[key]);
      }
      return this._unmaskCommands(s, commands);
    }

    translateNumbers(str) {
      return str.replace(/\d/g, (d) => DIGITS[d] || d);
    }

    // Translate LaTeX command tokens that represent functions/greek symbols.
    // Keep structural commands intact so downstream parsing/rendering remains stable.
    translateLatexCommands(str) {
      let result = str;
      
      // First, handle structural LaTeX commands with Arabic equivalents
      const structuralCommands = {
        // '\\frac': 'frac',
        '\\sqrt': 'arsqrt',
        '\\lim': 'نها',
        '\\int': 'arint',
        '\\sum': 'مجـ',
        // '\\prod': 'جد',
        '\\to': '←',
        '\\infty': '∞',
        '\\cdot': '·',
        '\\times': '×',
        '\\div': '÷'
      };
      
      // Replace structural commands
      for (const [latex, arabic] of Object.entries(structuralCommands)) {
        result = result.replace(new RegExp(this.escapeReg(latex), 'g'), arabic);
      }
      
      // Commands to keep as-is (layout commands)
      const preserve = new Set([
        'left','right','begin','end','pmatrix','bmatrix','matrix',
        'text','displaystyle','limits','nonumber','qquad','quad'
      ]);
      
      // Handle remaining LaTeX commands
      result = result.replace(/\\([A-Za-z]+)/g, (full, name) => {
        if (preserve.has(name)) return full; // keep intact
        // function name
        if (FUN[name]) return FUN[name];
        // greek or word symbol (e.g., pi, alpha)
        if (SYM[name]) return SYM[name];
        // otherwise, keep original
        return full;
      });
      
      return result;
    }

    flipArrows(str) {
      const keys = Object.keys(OPS).filter(k => ['→','←','⟹','⟸','↔','⟺'].includes(k));
      for (const key of keys) {
        const re = new RegExp(this.escapeReg(key), 'g');
        str = str.replace(re, OPS[key]);
      }
      return str;
    }

    // Mirror math symbols for RTL display and rearrange expressions
    mirrorMathSymbols(str) {
      let result = str;
      
      // Handle fractions - rearrange for RTL
      result = result.replace(/كسر\{([^}]+)\}\{([^}]+)\}/g, '$2/$1');
      result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$2/$1');
      
      // Handle limits - rearrange subscript and superscript for RTL
      result = result.replace(/نها_\{([^}]+)\}\^\{([^}]+)\}/g, 'نها^{$2}_{$1}');
      result = result.replace(/\\lim_\{([^}]+)\}\^\{([^}]+)\}/g, 'نها^{$2}_{$1}');
      
      // Handle integrals - rearrange bounds for RTL
      result = result.replace(/arint_\{([^}]+)\}\^\{([^}]+)\}/g, 'arint^{$2}_{$1}');
      result = result.replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}/g, 'arint^{$2}_{$1}');
      
      // Handle sums - rearrange bounds for RTL
      result = result.replace(/مجـ_\{([^}]+)\}\^\{([^}]+)\}/g, 'مج^{$2}_{$1}');
      result = result.replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, 'مج^{$2}_{$1}');
      
      // Mirror brackets and parentheses
      const brackets = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{' };
      for (const [from, to] of Object.entries(brackets)) {
        result = result.replace(new RegExp(this.escapeReg(from), 'g'), to);
      }
      
      // Mirror arrows
      const arrows = { '→': '←', '←': '→', '⟹': '⟸', '⟸': '⟹', '↦': '↤', '↤': '↦' };
      for (const [from, to] of Object.entries(arrows)) {
        result = result.replace(new RegExp(this.escapeReg(from), 'g'), to);
      }
      
      // Handle LaTeX arrows
      result = result.replace(/\\rightarrow/g, '←');
      result = result.replace(/\\leftarrow/g, '→');
      result = result.replace(/\\Rightarrow/g, '⟸');
      result = result.replace(/\\Leftarrow/g, '⟹');
      
      return result;
    }

    // Format the final output for RTL display
    formatForRTL(str) {
      let result = str;
      
      // Clean up extra spaces
      result = result.replace(/\s+/g, ' ').trim();
      
      // Ensure proper spacing around Arabic text
      result = result.replace(/([\u0600-\u06FF])\s*([+\-=])\s*([\u0600-\u06FF])/g, '$1 $2 $3');
      
      // Handle mixed Arabic-English expressions
      result = result.replace(/([\u0600-\u06FF])\s*([a-zA-Z])/g, '$1 $2');
      result = result.replace(/([a-zA-Z])\s*([\u0600-\u06FF])/g, '$1 $2');
      
      return result;
    }

    escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  }

  return Translator;
});
