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
        // Ensure TeX delimiters \( ... \)
        const wrapped = /^\s*\\\(|\\\[|\$/.test(tex) ? tex : `\\(${tex}\\)`;
        const span = document.createElement('span');
        span.textContent = wrapped;
        el.appendChild(span);
        // Trigger MathJax v3/v4 typeset if available
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
          try { return MathJax.typesetPromise([el]).then(() => el); } catch (_) { /* noop */ }
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
