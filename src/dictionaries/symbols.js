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
