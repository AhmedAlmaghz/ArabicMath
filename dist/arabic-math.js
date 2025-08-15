'use strict';

// Basic Arabic math dictionaries
const MathSymbols = {
  // variables (Arabic letters)
  x: 'س', y: 'ص', z: 'ع', w: 'و',
  a: 'أ', b: 'ب', c: 'ج', d: 'د',
  e: 'هـ', f: 'ق', g: 'غ', h: 'ح',
  i: 'ي', j: 'ج', k: 'ك', l: 'ل',
  m: 'م', n: 'ن', o: 'ع', p: 'ف',
  q: 'ق', r: 'ر', s: 'س', t: 'ت',
  u: 'ض', v: 'خ',
  // greek letters (word-level)
  alpha: 'ألفا', beta: 'بيتا', gamma: 'جاما', delta: 'دلتا',
  epsilon: 'إبسيلون', zeta: 'زيتا', eta: 'إيتا', theta: 'ثيتا',
  iota: 'يوتا', kappa: 'كابا', lambda: 'لامدا', mu: 'مو',
  nu: 'نو', xi: 'كسي', omicron: 'أوميكرون', pi: 'باي',
  rho: 'رو', sigma: 'سيجما', tau: 'تاو', upsilon: 'أوبسيلون',
  phi: 'فاي', chi: 'خي', psi: 'بساي', omega: 'أوميغا',
  // capital greek
  Alpha: 'ألفا', Beta: 'بيتا', Gamma: 'جاما', Delta: 'دلتا',
  Epsilon: 'إبسيلون', Zeta: 'زيتا', Eta: 'إيتا', Theta: 'ثيتا',
  Iota: 'يوتا', Kappa: 'كابا', Lambda: 'لامدا', Mu: 'مو',
  Nu: 'نو', Xi: 'كسي', Omicron: 'أوميكرون', Pi: 'باي',
  Rho: 'رو', Sigma: 'سيجما', Tau: 'تاو', Upsilon: 'أوبسيلون',
  Phi: 'فاي', Chi: 'خي', Psi: 'بساي', Omega: 'أوميغا',
  // special constants
  e: 'هـ', pi: 'ط', infinity: '∞', infty: '∞'
};

const MathFunctions = {
  // trigonometric
  sin: 'جا', cos: 'جتا', tan: 'ظا',
  cot: 'ظتا', sec: 'قا', csc: 'قتا',
  // inverse trigonometric
  asin: 'قوس جا', acos: 'قوس جتا', atan: 'قوس ظا',
  acot: 'قوس ظتا', asec: 'قوس قا', acsc: 'قوس قتا',
  // hyperbolic
  sinh: 'جا ز', cosh: 'جتا ز', tanh: 'ظا ز',
  coth: 'ظتا ز', sech: 'قا ز', csch: 'قتا ز',
  // logarithmic / exp
  ln: 'لو', log: 'لو', exp: 'هـ^', lg: 'لو١٠',
  // roots and powers
  sqrt: 'جذر', cbrt: 'جذر٣', pow: 'أس',
  // other functions
  abs: 'مطلق', max: 'غا', min: 'صغ',
  floor: 'أرض', ceil: 'سقف', round: 'تقريب',
  // calculus
  lim: 'نها', sum: 'مج', prod: 'جد', int: 'تك',
  diff: 'مشتق', grad: 'تدرج', div: 'تباعد', curl: 'دوران',
  // probability/statistics
  prob: 'احتمال', mean: 'متوسط', var: 'تباين', std: 'انحراف',
  // complex
  real: 'حقيقي', imag: 'تخيلي', conj: 'مرافق', arg: 'وسيطة'
};

const MathOperations = {
  // arrows (mirrored for RTL)
  '→': '←', '←': '→', '⟹': '⟸', '⟸': '⟹', '↔': '↔', '⟺': '⟺',
  '↦': '↤', '↤': '↦', '⇒': '⇐', '⇐': '⇒', '⇔': '⇔',
  // brackets (mirrored for RTL)
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '⟨': '⟩', '⟩': '⟨', '⌊': '⌋', '⌋': '⌊', '⌈': '⌉', '⌉': '⌈',
  // calculus and sums (keep same but add RTL context)
  '∫': '∫', '∬': '∬', '∭': '∭', '∮': '∮', '∑': '∑', '∏': '∏',
  '√': '√', '∛': '∛', '∜': '∜',
  // comparisons
  '≤': '≤', '≥': '≥', '≠': '≠', '≈': '≈', '≡': '≡',
  '<': '<', '>': '>', '=': '=', '±': '±', '∓': '∓',
  // sets
  '∈': '∈', '∉': '∉', '⊂': '⊂', '⊃': '⊃', '∪': '∪', '∩': '∩', '∅': '∅',
  '⊆': '⊆', '⊇': '⊇', '⊊': '⊊', '⊋': '⊋', '∖': '∖',
  // logic
  '∧': '∧', '∨': '∨', '¬': '¬', '∀': '∀', '∃': '∃', '∄': '∄',
  // additional math symbols
  '∞': '∞', '∂': '∂', '∇': '∇', '△': '△', '□': '□', '◊': '◊',
  '⊕': '⊕', '⊗': '⊗', '⊙': '⊙', '⊥': '⊥', '∥': '∥', '∦': '∦'
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

/**
 * محلل المعادلات الرياضية
 * يحول النص إلى هيكل بيانات قابل للمعالجة
 */
class MathParser {
    constructor() {
        this.tokenTypes = {
            FUNCTION: 'function',
            VARIABLE: 'variable',
            NUMBER: 'number',
            OPERATOR: 'operator',
            SYMBOL: 'symbol',
            BRACKET: 'bracket',
            LATEX_COMMAND: 'latex_command'
        };
    }
    
    /**
     * تحليل المعادلة الرياضية
     * @param {string} input - النص المدخل
     * @returns {Array} مصفوفة من الرموز المحللة
     */
    parse(input) {
        // تنظيف النص المدخل
        const cleaned = this.preprocess(input);
        
        // تقسيم إلى رموز
        const tokens = this.tokenize(cleaned);
        
        // تحليل تركيبي
        const ast = this.buildAST(tokens);
        
        return ast;
    }
    
    preprocess(input) {
        return input
            .replace(/\s+/g, ' ')           // توحيد المسافات
            .replace(/\\,/g, ' ')           // مسافات LaTeX
            .replace(/\\!/g, '')            // إزالة المسافات السالبة
            .trim();
    }
    
    tokenize(input) {
        const tokens = [];
        const patterns = [
            { type: this.tokenTypes.LATEX_COMMAND, regex: /\\[a-zA-Z]+\*?/g },
            { type: this.tokenTypes.FUNCTION, regex: /\b(sin|cos|tan|log|ln|exp|sqrt|lim|sum|prod|int)\b/g },
            { type: this.tokenTypes.NUMBER, regex: /\d+\.?\d*/g },
            { type: this.tokenTypes.VARIABLE, regex: /\b[a-zA-Z]\b/g },
            { type: this.tokenTypes.OPERATOR, regex: /[+\-*/=<>≤≥≠≈]/g },
            { type: this.tokenTypes.SYMBOL, regex: /[∫∑∏√∞π∂∇]/g },
            { type: this.tokenTypes.BRACKET, regex: /[(){}\[\]]/g }
        ];
        
        let position = 0;
        while (position < input.length) {
            let matched = false;
            
            for (const pattern of patterns) {
                pattern.regex.lastIndex = position;
                const match = pattern.regex.exec(input);
                
                if (match && match.index === position) {
                    tokens.push({
                        type: pattern.type,
                        value: match[0],
                        position: position
                    });
                    position = match.index + match[0].length;
                    matched = true;
                    break;
                }
            }
            
            if (!matched) {
                position++;
            }
        }
        
        return tokens;
    }
    
    buildAST(tokens) {
        // بناء شجرة التحليل التركيبي
        // هذا مبسط - في التطبيق الحقيقي نحتاج parser أعقد
        return {
            type: 'expression',
            tokens: tokens,
            structure: this.analyzeStructure(tokens)
        };
    }
    
    analyzeStructure(tokens) {
        const structure = {
            functions: [],
            variables: [],
            operators: [],
            commands: []
        };
        
        tokens.forEach(token => {
            switch (token.type) {
                case this.tokenTypes.FUNCTION:
                    structure.functions.push(token);
                    break;
                case this.tokenTypes.VARIABLE:
                    structure.variables.push(token);
                    break;
                case this.tokenTypes.OPERATOR:
                    structure.operators.push(token);
                    break;
                case this.tokenTypes.LATEX_COMMAND:
                    structure.commands.push(token);
                    break;
            }
        });
        
        return structure;
    }
}

// UMD-style export to expose the parser in both browser and Node environments
;(function (root) {
  try {
    if (typeof module === 'object' && module.exports) {
      module.exports = MathParser;
    } else if (typeof root !== 'undefined') {
      root.ArabicMathParser = root.ArabicMathParser || MathParser;
    }
  } catch (_) { /* noop */ }
})(typeof self !== 'undefined' ? self : this);

/**
 * معالج الكتابة من اليمين إلى اليسار
 * يتعامل مع تعقيدات RTL في المعادلات الرياضية
 */
;(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ArabicMathRenderer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class Renderer {
    constructor(options = {}) {
      this.options = Object.assign({
        // future options
      }, options);
    }

    // Render AST safely to the target element
    // context: { targetElement, options, version, equation }
    render(ast, context) {
      const el = context && context.targetElement;
      if (!el) throw new Error('Renderer: targetElement is required');

      // Clear target
      while (el.firstChild) el.removeChild(el.firstChild);

      const engine = (context.options && context.options.mathRenderer) || 'none';
      const tex = (context && typeof context.equation === 'string') ? context.equation : this._textFromAST(ast);

      if (engine === 'mathjax') {
        // Inject arabic-mathjax macro when RTL/applyRTL is requested
        const hasArabicChars = /[\u0600-\u06FF]/.test(tex);
        const wantsRTLApply = !!(context.options && context.options.preTranslate && context.options.preTranslate.applyRTL);
        const needsArabicMacro = (hasArabicChars || wantsRTLApply) && !(/\\alwaysar\b|\\ar\b/.test(tex));
        const texForMJ = needsArabicMacro ? `\\alwaysar{${tex}}` : tex;

        // Ensure TeX delimiters \( ... \)
        const wrapped = /^\s*\\\(|\\\[|\$/.test(texForMJ) ? texForMJ : `\\(${texForMJ}\\)`;
        const span = document.createElement('span');
        span.textContent = wrapped;
        el.appendChild(span);
        // Trigger MathJax typeset (support v3/v4 and v2)
        if (typeof MathJax !== 'undefined') {
          if (MathJax.typesetPromise) {
            try { return MathJax.typesetPromise([el]).then(() => el); } catch (_) { /* noop */ }
          } else if (MathJax.Hub && MathJax.Hub.Queue) {
            try {
              return new Promise((resolve) => {
                MathJax.Hub.Queue(['Typeset', MathJax.Hub, el], function() { resolve(el); });
              });
            } catch (_) { /* noop */ }
          }
        }
      } else if (engine === 'katex') {
        if (typeof katex !== 'undefined' && katex.render) {
          try { katex.render(tex, el, { throwOnError: false, trust: false }); }
          catch (_) { el.textContent = tex; }
        } else {
          el.textContent = tex;
        }
      } else {
        // Simple safe text rendering with Arabic translation
        const span = document.createElement('span');
        span.className = 'arabic-math-text';
        // Use the translated equation text instead of AST
        span.textContent = tex;
        el.appendChild(span);
      }

      // Basic RTL styling if requested
      if (context.options && context.options.rtl) {
        el.style.direction = 'rtl';
        el.style.textAlign = 'right';
      }

      return el;
    }

    _textFromAST(ast) {
      try {
        if (ast && Array.isArray(ast.tokens)) {
          return ast.tokens.map(t => t && t.value != null ? String(t.value) : '').join(' ').trim();
        }
      } catch (_) {}
      return '';
    }
  }

  return Renderer;
});

/**
 * معالج الكتابة من اليمين إلى اليسار
 * يتعامل مع تعقيدات RTL في المعادلات الرياضية
 */
var RTLHandler = (typeof window !== 'undefined' && window.RTLHandler) || class RTLHandler {
  constructor() {
      this.rtlPatterns = {
          // الأسهم التي تحتاج قلب
          arrows: [
              { from: '→', to: '←' },
              { from: '←', to: '→' },
              { from: '⟹', to: '⟸' },
              { from: '⟸', to: '⟹' },
              { from: '↦', to: '↤' },
              { from: '↤', to: '↦' }
          ],
          
          // الأقواس التي تحتاج قلب
          brackets: [
              { from: '(', to: ')' },
              { from: ')', to: '(' },
              { from: '[', to: ']' },
              { from: ']', to: '[' },
              { from: '{', to: '}' },
              { from: '}', to: '{' }
          ]
      };
  }
  
  /**
   * معالجة معادلة للكتابة من اليمين إلى اليسار
   * @param {string} equation - المعادلة
   * @param {object} options - خيارات المعالجة
   * @returns {string} المعادلة معدلة للـ RTL
   */
  processRTL(equation, options = {}) {
      let result = equation;
      
      // قلب الأسهم
      if (options.flipArrows !== false) {
          result = this.flipArrows(result);
      }
      
      // معالجة حدود التكامل والمجاميع
      if (options.swapBounds !== false) {
          result = this.swapIntegralBounds(result);
          result = this.swapSumBounds(result);
      }
      
      // معالجة الكسور
      if (options.handleFractions !== false) {
          result = this.processFractions(result);
      }
      
      // معالجة المصفوفات
      if (options.handleMatrices !== false) {
          result = this.processMatrices(result);
      }
      
      return result;
  }
  
  flipArrows(equation) {
      let result = equation;
      this.rtlPatterns.arrows.forEach(arrow => {
          result = result.replace(new RegExp(arrow.from, 'g'), arrow.to);
      });
      return result;
  }
  
  swapIntegralBounds(equation) {
      // تبديل حدود التكامل من ∫_a^b إلى ∫^b_a
      return equation.replace(
          /\\int_\{([^}]+)\}\^\{([^}]+)\}/g,
          '\\int^{$2}_{$1}'
      ).replace(
          /∫_\{([^}]+)\}\^\{([^}]+)\}/g,
          '∫^{$2}_{$1}'
      );
  }
  
  swapSumBounds(equation) {
      // تبديل حدود المجاميع
      return equation.replace(
          /\\sum_\{([^}]+)\}\^\{([^}]+)\}/g,
          '\\sum^{$2}_{$1}'
      ).replace(
          /∑_\{([^}]+)\}\^\{([^}]+)\}/g,
          '∑^{$2}_{$1}'
      );
  }
  
  processFractions(equation) {
      // في معظم الحالات، الكسور لا تحتاج تعديل خاص
      // لكن يمكن إضافة معالجة خاصة إذا لزم الأمر
      return equation;
  }
  
  processMatrices(equation) {
      // معالجة المصفوفات للعرض الصحيح في RTL
      // هذا يتطلب تحليل أعقد للبنية
      return equation.replace(
          /\\begin\{(pmatrix|bmatrix|vmatrix)\}([\s\S]*?)\\end\{\1\}/g,
          (match, matrixType, content) => {
              // قلب ترتيب الأعمدة في المصفوفة
              const rows = content.trim().split('\\\\');
              const flippedRows = rows.map(row => {
                  const columns = row.split('&');
                  return columns.reverse().join('&');
              });
              return `\\begin{${matrixType}}${flippedRows.join('\\\\')}\\end{${matrixType}}`;
          }
      );
  }
  
  /**
   * معالجة عنصر HTML بعد العرض
   * @param {HTMLElement} element - العنصر المعروض
   */
  postProcessElement(element) {
      // إضافة خصائص RTL
      element.style.direction = 'rtl';
      element.style.textAlign = 'right';
      
      // معالجة العناصر الفرعية
      const mathElements = element.querySelectorAll('.MathJax, .katex');
      mathElements.forEach(mathEl => {
          mathEl.style.direction = 'ltr'; // الرياضيات تحتاج LTR داخليًا
          mathEl.parentElement.style.direction = 'rtl'; // لكن الحاوي RTL
      });
  }
}

// UMD-style export: provide ArabicMathRTL with ensureRTL API expected by ArabicMath.js
/* eslint-disable no-undef */
try {
  if (typeof module === 'object' && module.exports) {
    module.exports = {
      ensureRTL: (eq, options) => new RTLHandler().processRTL(eq, options)
    };
  } else if (typeof self !== 'undefined') {
    // Expose a stable API without redeclaring the class globally
    self.ArabicMathRTL = self.ArabicMathRTL || {
      ensureRTL: (eq, options) => new RTLHandler().processRTL(eq, options)
    };
    // Also expose constructor once for debugging, but guard against redeclare
    if (!self.RTLHandler) self.RTLHandler = RTLHandler;
  }
} catch (_) {
  // no-op in restricted environments
}
/**
 * أدوات مساعدة للنصوص
 */
class StringUtils {
    /**
     * تحويل النص إلى كتابة من اليمين إلى اليسار
     * @param {string} text - النص
     * @returns {string} النص معكوس
     */
    static reverseText(text) {
        return text.split('').reverse().join('');
    }
    
    /**
     * إدراج علامات الاتجاه للنص المختلط
     * @param {string} text - النص المختلط
     * @returns {string} النص مع علامات الاتجاه
     */
    static addDirectionalMarks(text) {
        // إضافة علامات RTL للنص العربي
        return text.replace(/[\u0600-\u06FF\u0750-\u077F]+/g, '\u202E$&\u202C');
    }
    
    /**
     * تنظيف النص من العلامات الخاصة
     * @param {string} text - النص
     * @returns {string} النص منظف
     */
    static sanitizeText(text) {
        return text
            .replace(/[\u200B-\u200D\uFEFF]/g, '')  // إزالة Zero Width characters
            .replace(/\u202A|\u202B|\u202C|\u202D|\u202E/g, '') // إزالة علامات الاتجاه
            .normalize('NFC');                       // تطبيع Unicode
    }
    
    /**
     * تقسيم النص مع الاحتفاظ بالفواصل
     * @param {string} text - النص
     * @param {RegExp} separator - الفاصل
     * @returns {Array} مصفوفة الأجزاء والفواصل
     */
    static splitKeepSeparator(text, separator) {
        const parts = [];
        let lastIndex = 0;
        let match;
        
        while ((match = separator.exec(text)) !== null) {
            // إضافة النص قبل الفاصل
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            
            // إضافة الفاصل
            parts.push(match[0]);
            
            lastIndex = separator.lastIndex;
        }
        
        // إضافة النص المتبقي
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        
        return parts.filter(part => part.length > 0);
    }
    
    /**
     * البحث والاستبدال مع دعم الـ callbacks
     * @param {string} text - النص
     * @param {RegExp|string} searchValue - القيمة المراد البحث عنها
     * @param {Function|string} replaceValue - القيمة البديلة أو function
     * @returns {string} النص بعد الاستبدال
     */
    static smartReplace(text, searchValue, replaceValue) {
        if (typeof replaceValue === 'function') {
            return text.replace(searchValue, (...args) => {
                return replaceValue(...args);
            });
        }
        
        return text.replace(searchValue, replaceValue);
    }
    
    /**
     * تحديد الكلمات المحيطة بموقع معين
     * @param {string} text - النص
     * @param {number} position - الموقع
     * @param {number} radius - نصف قطر البحث (بالأحرف)
     * @returns {Object} السياق المحيط
     */
    static getContext(text, position, radius = 10) {
        const start = Math.max(0, position - radius);
        const end = Math.min(text.length, position + radius);
        
        return {
            before: text.substring(start, position),
            at: text.charAt(position),
            after: text.substring(position + 1, end),
            full: text.substring(start, end),
            position: position,
            relativePosition: position - start
        };
    }
    
    /**
     * إزالة التكرار من النص مع الاحتفاظ بالترتيب
     * @param {string} text - النص
     * @param {string} separator - الفاصل
     * @returns {string} النص بدون تكرار
     */
    static removeDuplicates(text, separator = ' ') {
        const parts = text.split(separator);
        const unique = [];
        const seen = new Set();
        
        parts.forEach(part => {
            if (!seen.has(part)) {
                unique.push(part);
                seen.add(part);
            }
        });
        
        return unique.join(separator);
    }
    
    /**
     * تحويل النص إلى slug URL-friendly
     * @param {string} text - النص
     * @returns {string} الـ slug
     */
    static toSlug(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\u0600-\u06FF]/g, (match) => {
                // تحويل الحروف العربية إلى transliteration
                const arabicToLatin = {
                    'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ا': 'a', 'ب': 'b', 'ت': 't',
                    'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
                    'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
                    'ط': 't', 'ظ': 'dh', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
                    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
                    'ي': 'y', 'ة': 'h', 'ى': 'a', 'ء': 'a'
                };
                return arabicToLatin[match] || match;
            })
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

/**
 * أدوات مساعدة للعمليات الرياضية
 */
class MathUtils {
  /**
   * تحديد نوع العبارة الرياضية
   * @param {string} expression - العبارة الرياضية
   * @returns {string} نوع العبارة
   */
  static detectExpressionType(expression) {
      const patterns = {
          limit: /\\?lim|نها/i,
          integral: /\\?int|∫|تك/i,
          derivative: /\\?frac\{d|d\/d|مشتقة/i,
          summation: /\\?sum|∑|مج/i,
          product: /\\?prod|∏|جد/i,
          matrix: /\\?begin\{.*matrix\}|مصفوفة/i,
          equation: /=/,
          inequality: /[<>≤≥≠]/,
          function: /\\?[a-z]+\s*\(|\b(sin|cos|tan|log|ln)\s*\(/i
      };
      
      for (const [type, pattern] of Object.entries(patterns)) {
          if (pattern.test(expression)) {
              return type;
          }
      }
      
      return 'expression';
  }
  
  /**
   * استخراج المتغيرات من المعادلة
   * @param {string} equation - المعادلة
   * @returns {Array<string>} قائمة المتغيرات
   */
  static extractVariables(equation) {
      // تنظيف المعادلة من الدوال وأوامر LaTeX
      const cleaned = equation
          .replace(/\\[a-zA-Z]+/g, '')                // إزالة أوامر LaTeX
          .replace(/\b(sin|cos|tan|log|ln|exp)\b/g, '') // إزالة الدوال
          .replace(/\d+/g, '')                        // إزالة الأرقام
          .replace(/[^\w\u0600-\u06FF]/g, ' ');       // الاحتفاظ بالحروف العربية والإنجليزية فقط
      
      const variables = new Set();
      const matches = cleaned.match(/\b[a-zA-Z\u0600-\u06FF]\b/g);
      
      if (matches) {
          matches.forEach(match => {
              if (match.length === 1) { // متغيرات من حرف واحد فقط
                  variables.add(match);
              }
          });
      }
      
      return Array.from(variables).sort();
  }
  
  /**
   * التحقق من توازن الأقواس
   * @param {string} expression - العبارة
   * @returns {Object} نتيجة التحقق
   */
  static checkBracketBalance(expression) {
      const brackets = {
          '(': ')',
          '[': ']',
          '{': '}',
          '\\{': '\\}',
          '\\[': '\\]',
          '\\(': '\\)'
      };
      
      const stack = [];
      const errors = [];
      
      let i = 0;
      while (i < expression.length) {
          const char = expression[i];
          const nextChars = expression.substr(i, 2);
          
          // فحص الأقواس المركبة (LaTeX)
          if (brackets[nextChars]) {
              stack.push(nextChars);
              i += 2;
              continue;
          }
          
          // فحص الأقواس البسيطة
          if (brackets[char]) {
              stack.push(char);
          } else if (Object.values(brackets).includes(char)) {
              const lastOpening = stack.pop();
              if (!lastOpening || brackets[lastOpening] !== char) {
                  errors.push({
                      type: 'mismatch',
                      position: i,
                      expected: lastOpening ? brackets[lastOpening] : 'opening bracket',
                      found: char
                  });
              }
          }
          
          i++;
      }
      
      // فحص الأقواس المفتوحة غير المغلقة
      if (stack.length > 0) {
          stack.forEach(opening => {
              errors.push({
                  type: 'unclosed',
                  bracket: opening,
                  expected: brackets[opening]
              });
          });
      }
      
      return {
          balanced: errors.length === 0,
          errors: errors
      };
  }
  
  /**
   * تحويل الأرقام من إنجليزي إلى عربي
   * @param {string} text - النص
   * @returns {string} النص مع الأرقام العربية
   */
  static convertNumbersToArabic(text) {
      const arabicNumbers = {
          '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
          '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
      };
      
      return text.replace(/[0-9]/g, digit => arabicNumbers[digit] || digit);
  }
  
  /**
   * تحويل الأرقام من عربي إلى إنجليزي
   * @param {string} text - النص
   * @returns {string} النص مع الأرقام الإنجليزية
   */
  static convertNumbersToEnglish(text) {
      const englishNumbers = {
          '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
          '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
      };
      
      return text.replace(/[٠-٩]/g, digit => englishNumbers[digit] || digit);
  }
  
  /**
   * تنظيف وتحسين المعادلة
   * @param {string} equation - المعادلة
   * @returns {string} المعادلة منظفة
   */
  static cleanEquation(equation) {
      return equation
          .replace(/\s+/g, ' ')                    // توحيد المسافات
          .replace(/\{\s+/g, '{')                  // إزالة المسافات بعد {
          .replace(/\s+\}/g, '}')                  // إزالة المسافات قبل }
          .replace(/\(\s+/g, '(')                  // إزالة المسافات بعد (
          .replace(/\s+\)/g, ')')                  // إزالة المسافات قبل )
          .replace(/\\,/g, ' ')                    // تحويل مسافات LaTeX
          .replace(/\\!/g, '')                     // إزالة المسافات السالبة
          .trim();
  }
  
  /**
   * اكتشاف لغة المعادلة
   * @param {string} equation - المعادلة
   * @returns {string} اللغة المكتشفة
   */
  static detectLanguage(equation) {
      const arabicPattern = /[\u0600-\u06FF]/;
      const arabicFunctions = /\b(جا|جتا|ظا|نها|مج|لو)\b/;
      const englishFunctions = /\b(sin|cos|tan|lim|sum|log)\b/;
      
      if (arabicPattern.test(equation) || arabicFunctions.test(equation)) {
          return 'arabic';
      } else if (englishFunctions.test(equation)) {
          return 'english';
      } else {
          return 'mixed';
      }
  }
  
  /**
   * تحليل بنية LaTeX
   * @param {string} latex - كود LaTeX
   * @returns {Object} تحليل البنية
   */
  static analyzeLaTeXStructure(latex) {
      const structure = {
          commands: [],
          environments: [],
          brackets: { curly: 0, square: 0, round: 0 },
          complexity: 0
      };
      
      // استخراج الأوامر
      const commands = latex.match(/\\[a-zA-Z]+/g);
      if (commands) {
          structure.commands = [...new Set(commands)];
          structure.complexity += commands.length;
      }
      
      // استخراج البيئات
      const environments = latex.match(/\\begin\{([^}]+)\}/g);
      if (environments) {
          structure.environments = environments.map(env => 
              env.match(/\\begin\{([^}]+)\}/)[1]
          );
          structure.complexity += environments.length * 2;
      }
      
      // عد الأقواس
      structure.brackets.curly = (latex.match(/\{/g) || []).length;
      structure.brackets.square = (latex.match(/\[/g) || []).length;
      structure.brackets.round = (latex.match(/\(/g) || []).length;
      
      return structure;
  }
}

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
          defaultTarget: null,
          // Optional: pre-translate input before handing to MathJax/KaTeX
          // applyRTL=false by default to avoid affecting TeX parsing
          preTranslate: { mathjax: false, katex: false, applyRTL: false }
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
      const engine = options.mathRenderer || 'none';
      const pt = options.preTranslate || {};
      if (options.autoTranslate) {
        if (engine === 'none') {
          const translated = this.translator.translate(text);
          text = options.rtl ? RTL.ensureRTL(translated) : translated;
        } else if ((engine === 'mathjax' && pt.mathjax) || (engine === 'katex' && pt.katex)) {
          // SAFE pre-translation for TeX engines: only convert digits
          let translated = this.translator.translateNumbers(text);
          if (options.rtl && pt.applyRTL) translated = RTL.ensureRTL(translated);
          text = translated;
        }
      }

      // Parse (stub-safe)
      const ast = this.parser.parse(text);

      // Render
      const context = { targetElement: el, options, version: VERSION, equation: text };
      this.emit('before:render', { equation: text, context });
      const result = this.renderer.render(ast, context);
      // If renderer returns a Promise (e.g., MathJax typesetting), wait for it
      if (result && typeof result.then === 'function') {
        return result.then((value) => {
          this.emit('after:render', { equation: text, context });
          return value || el;
        });
      }
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

