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
