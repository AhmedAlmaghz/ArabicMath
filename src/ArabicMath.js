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
