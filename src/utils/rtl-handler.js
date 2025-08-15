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