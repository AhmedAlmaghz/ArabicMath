'use strict';

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ArabicMathUtils = root.ArabicMathUtils || {};
    root.ArabicMathUtils.Math = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  class MathUtils {
    static detectExpressionType(expression = '') {
      const patterns = {
        limit: /\\?lim|نها/i,
        integral: /\\?int|∫|تك/i,
        derivative: /\\?frac\{d|d\s*\/\s*d|مشتقة/i,
        summation: /\\?sum|∑|مج/i,
        product: /\\?prod|∏|جد/i,
        matrix: /\\?begin\{.*matrix\}|مصفوفة/i,
        equation: /=/,
        inequality: /[<>≤≥≠]/,
        function: /\\?[a-z]+\s*\(|\b(sin|cos|tan|log|ln)\s*\(/i
      };
      for (const [type, re] of Object.entries(patterns)) {
        if (re.test(expression)) return type;
      }
      return 'expression';
    }

    static extractVariables(equation = '') {
      const cleaned = equation
        .replace(/\\[a-zA-Z]+/g, '')
        .replace(/\b(sin|cos|tan|log|ln|exp)\b/gi, '')
        .replace(/\d+/g, '')
        .replace(/[^\w\u0600-\u06FF]/g, ' ');
      const set = new Set();
      const matches = cleaned.match(/\b[a-zA-Z\u0600-\u06FF]\b/g);
      if (matches) matches.forEach((m) => set.add(m));
      return Array.from(set).sort();
    }

    static checkBracketBalance(expression = '') {
      const pairs = { '(': ')', '{': '}', '[': ']' };
      const stack = [];
      for (let i = 0; i < expression.length; i++) {
        const ch = expression[i];
        if (pairs[ch]) stack.push(ch);
        else if (Object.values(pairs).includes(ch)) {
          const open = stack.pop();
          if (!open || pairs[open] !== ch) {
            return { balanced: false, errorAt: i };
          }
        }
      }
      return { balanced: stack.length === 0, errorAt: stack.length ? expression.length : -1 };
    }

    static analyzeLaTeXStructure(latex = '') {
      const structure = { commands: [], environments: [], brackets: { curly: 0, square: 0, round: 0 }, complexity: 0 };
      const commands = latex.match(/\\[a-zA-Z]+/g);
      if (commands) { structure.commands = [...new Set(commands)]; structure.complexity += commands.length; }
      const environments = latex.match(/\\begin\{([^}]+)\}/g);
      if (environments) {
        structure.environments = environments.map((env) => env.match(/\\begin\{([^}]+)\}/)[1]);
        structure.complexity += environments.length * 2;
      }
      structure.brackets.curly = (latex.match(/\{/g) || []).length;
      structure.brackets.square = (latex.match(/\[/g) || []).length;
      structure.brackets.round = (latex.match(/\(/g) || []).length;
      return structure;
    }
  }
  return MathUtils;
});
