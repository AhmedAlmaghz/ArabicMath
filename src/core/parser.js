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
