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
