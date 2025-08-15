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
