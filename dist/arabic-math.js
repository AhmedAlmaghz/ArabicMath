'use strict';

// Basic Arabic math dictionaries
const MathSymbols = {
  // variables
  x: 'س', y: 'ص', z: 'ع', w: 'و',
  a: 'أ', b: 'ب', c: 'ج', d: 'د',
  f: 'ق', g: 'ج', h: 'ح', n: 'ن',
  t: 'ت', u: 'هـ', v: 'خ', r: 'ر'
};

const MathFunctions = {
  // trigonometric
  sin: 'جا', cos: 'جتا', tan: 'ظا',
  cot: 'ظتا', sec: 'قا', csc: 'قتا',
  // logarithmic / exp
  ln: 'لو', log: 'لو', exp: 'هـ^',
  // other
  sqrt: 'جذر', abs: 'مطلق', max: 'غا', min: 'صغ',
  lim: 'نها', sum: 'مج', prod: 'جد', int: 'تك'
};

const MathOperations = {
  // arrows
  '→': '←', '←': '→', '⟹': '⟸', '⟸': '⟹', '↔': '↔', '⟺': '⟺',
  // calculus and sums
  '∫': '∫', '∬': '∬', '∭': '∭', '∮': '∮', '∑': '∑', '∏': '∏',
  // comparisons
  '≤': '≤', '≥': '≥', '≠': '≠', '≈': '≈', '≡': '≡',
  // sets
  '∈': '∈', '∉': '∉', '⊂': '⊂', '⊃': '⊃', '∪': '∪', '∩': '∩', '∅': '∅',
  // logic
  '∧': '∧', '∨': '∨', '¬': '¬', '∀': '∀', '∃': '∃'
};

const CompoundPatterns = [
  { name: 'limit', pattern: /\\?lim|نها/i },
  { name: 'integral', pattern: /\\?int|∫|تك/i },
  { name: 'derivative', pattern: /d\s*\/\s*dx|\\?frac\{d/i },
  { name: 'summation', pattern: /\\?sum|∑|مج/i },
  { name: 'product', pattern: /\\?prod|∏|جد/i },
  { name: 'matrix', pattern: /\\?begin\{.*matrix\}|مصفوفة/i }
];

const ArabicDigitsMap = { '0': '٠','1': '١','2': '٢','3': '٣','4': '٤','5': '٥','6': '٦','7': '٧','8': '٨','9': '٩' };

const Dictionaries = {
  MathSymbols,
  MathFunctions,
  MathOperations,
  CompoundPatterns,
  ArabicDigitsMap
};

// UMD-style export
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ArabicMathDictionaries = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  return Dictionaries;
});

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

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ArabicMathParser = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class Parser {
    constructor(options = {}) {
      this.options = Object.assign({ strict: false }, options);
    }

    parse(equation) {
      const text = String(equation || '');
      const issues = this._basicChecks(text);
      return {
        type: 'Equation',
        raw: text,
        issues
      };
    }

    validate(equation) {
      const text = String(equation || '');
      const { errors, warnings } = this._basicChecks(text);
      return {
        valid: errors.length === 0,
        errors,
        warnings
      };
    }

    _basicChecks(text) {
      const errors = [];
      const warnings = [];

      // Bracket balance check for (), {}, []
      const pairs = { '(': ')', '{': '}', '[': ']' };
      const stack = [];
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (pairs[ch]) stack.push(ch);
        else if (Object.values(pairs).includes(ch)) {
          const open = stack.pop();
          if (!open || pairs[open] !== ch) {
            errors.push(`Unbalanced bracket near index ${i}`);
            break;
          }
        }
      }
      if (stack.length) errors.push('Unbalanced brackets: missing closing');

      // Very naive LaTeX command format check
      const unmatchedBraces = (text.match(/\{/g) || []).length !== (text.match(/\}/g) || []).length;
      if (unmatchedBraces) errors.push('Mismatched curly braces');

      if (/\\invalid\b/.test(text)) warnings.push('Contains unsupported command \\invalid');

      return { errors, warnings };
    }
  }

  return Parser;
});

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ArabicMathRenderer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class Renderer {
    constructor(options = {}) {
      this.options = Object.assign({ displayMode: true }, options);
    }

    render(ast, context) {
      const el = context && context.targetElement;
      if (!el) throw new Error('Renderer requires a target element');

      // Ensure RTL container
      el.setAttribute('dir', 'rtl');
      el.classList.add('arabic-math');

      const raw = ast && ast.raw ? ast.raw : '';
      const mode = (context && context.options && context.options.mathRenderer) || 'none';

      if (mode === 'mathjax' && typeof window !== 'undefined' && window.MathJax) {
        el.innerHTML = raw;
        if (typeof window.MathJax.typesetPromise === 'function') {
          return window.MathJax.typesetPromise([el]).catch(() => {});
        } else if (window.MathJax.Hub && window.MathJax.Hub.Queue) {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, el]);
        }
        return el;
      }

      if (mode === 'katex' && typeof window !== 'undefined' && window.katex) {
        try {
          window.katex.render(raw, el, { displayMode: this.options.displayMode, throwOnError: false });
        } catch (e) {
          el.textContent = raw;
        }
        return el;
      }

      // Fallback simple text rendering
      el.textContent = raw;
      return el;
    }
  }

  return Renderer;
});

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

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./core/translator'),
      require('./core/parser'),
      require('./core/renderer'),
      require('./utils/rtl-handler'),
      require('./dictionaries/symbols')
    );
  } else {
    root.ArabicMath = factory(
      root.ArabicMathTranslator,
      root.ArabicMathParser,
      root.ArabicMathRenderer,
      root.ArabicMathRTL,
      root.ArabicMathDictionaries
    );
  }
})(typeof self !== 'undefined' ? self : this, function (
  Translator,
  Parser,
  Renderer,
  RTL,
  Dictionaries
) {
  'use strict';

  const VERSION = '0.1.0';

  class ArabicMath {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          rtl: true,
          autoTranslate: true,
          mathRenderer: 'none', // 'none' | 'mathjax' | 'katex'
          defaultTarget: null
        },
        options
      );

      this.translator = new Translator(options.translate || {});
      this.parser = new Parser(options.parser || {});
      this.renderer = new Renderer(options.renderer || {});

      this._listeners = new Map();
    }

    setOptions(patch = {}) {
      this.options = Object.assign({}, this.options, patch);
      this.emit('options:change', this.options);
    }

    translate(input) {
      const text = String(input || '');
      const out = this.translator.translate(text);
      return this.options.rtl ? RTL.ensureRTL(out) : out;
    }

    validateEquation(equation) {
      return this.parser.validate(equation);
    }

    render(target, equation, opts = {}) {
      const options = Object.assign({}, this.options, opts);
      const el = this._resolveTarget(target || this.options.defaultTarget);
      if (!el) throw new Error('Target element not found');

      // Translate if needed
      let text = String(equation || '');
      if (options.autoTranslate) {
        text = this.translate(text);
      }

      // Parse (stub-safe)
      const ast = this.parser.parse(text);

      // Render
      const context = { targetElement: el, options, version: VERSION };
      this.emit('before:render', { equation: text, context });
      this.renderer.render(ast, context);
      this.emit('after:render', { equation: text, context });

      return el;
    }

    // Basic event system
    on(evt, cb) {
      if (!this._listeners.has(evt)) this._listeners.set(evt, new Set());
      this._listeners.get(evt).add(cb);
      return () => this.off(evt, cb);
    }

    off(evt, cb) {
      if (!this._listeners.has(evt)) return;
      this._listeners.get(evt).delete(cb);
    }

    emit(evt, payload) {
      if (!this._listeners.has(evt)) return;
      this._listeners.get(evt).forEach((cb) => {
        try { cb(payload); } catch (e) { /* noop */ }
      });
    }

    _resolveTarget(target) {
      if (!target) return null;
      if (typeof target === 'string') return document.querySelector(target);
      if (target && target.nodeType === 1) return target;
      return null;
    }

    static get version() { return VERSION; }
    get version() { return VERSION; }

    static get dictionaries() { return Dictionaries; }
  }

  return ArabicMath;
});

