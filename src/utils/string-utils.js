(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ArabicMathUtils = root.ArabicMathUtils || {};
    root.ArabicMathUtils.Strings = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class StringUtils {
    static reverseText(text = '') {
      return String(text).split('').reverse().join('');
    }

    static addDirectionalMarks(text = '') {
      return String(text).replace(/[\u0600-\u06FF\u0750-\u077F]+/g, '\u202E$&\u202C');
    }

    static sanitizeText(text = '') {
      return String(text)
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\u202A|\u202B|\u202C|\u202D|\u202E/g, '')
        .normalize('NFC');
    }

    static toSlug(text = '') {
      return String(text)
        .toLowerCase()
        .trim()
        .replace(/[\u0600-\u06FF]/g, (m) => {
          const map = {
            'أ': 'a','إ': 'i','آ': 'aa','ا': 'a','ب': 'b','ت': 't','ث': 'th','ج': 'j','ح': 'h','خ': 'kh',
            'د': 'd','ذ': 'dh','ر': 'r','ز': 'z','س': 's','ش': 'sh','ص': 's','ض': 'd','ط': 't','ظ': 'dh',
            'ع': 'a','غ': 'gh','ف': 'f','ق': 'q','ك': 'k','ل': 'l','م': 'm','ن': 'n','ه': 'h','و': 'w',
            'ي': 'y','ة': 'h','ى': 'a','ء': 'a'
          }; return map[m] || m; })
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }

  return StringUtils;
});
