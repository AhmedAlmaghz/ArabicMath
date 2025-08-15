/**
 * أدوات مساعدة للعمليات الرياضية
 */
class MathUtils {
  /**
   * تحديد نوع العبارة الرياضية
   * @param {string} expression - العبارة الرياضية
   * @returns {string} نوع العبارة
   */
  static detectExpressionType(expression) {
      const patterns = {
          limit: /\\?lim|نها/i,
          integral: /\\?int|∫|تك/i,
          derivative: /\\?frac\{d|d\/d|مشتقة/i,
          summation: /\\?sum|∑|مج/i,
          product: /\\?prod|∏|جد/i,
          matrix: /\\?begin\{.*matrix\}|مصفوفة/i,
          equation: /=/,
          inequality: /[<>≤≥≠]/,
          function: /\\?[a-z]+\s*\(|\b(sin|cos|tan|log|ln)\s*\(/i
      };
      
      for (const [type, pattern] of Object.entries(patterns)) {
          if (pattern.test(expression)) {
              return type;
          }
      }
      
      return 'expression';
  }
  
  /**
   * استخراج المتغيرات من المعادلة
   * @param {string} equation - المعادلة
   * @returns {Array<string>} قائمة المتغيرات
   */
  static extractVariables(equation) {
      // تنظيف المعادلة من الدوال وأوامر LaTeX
      const cleaned = equation
          .replace(/\\[a-zA-Z]+/g, '')                // إزالة أوامر LaTeX
          .replace(/\b(sin|cos|tan|log|ln|exp)\b/g, '') // إزالة الدوال
          .replace(/\d+/g, '')                        // إزالة الأرقام
          .replace(/[^\w\u0600-\u06FF]/g, ' ');       // الاحتفاظ بالحروف العربية والإنجليزية فقط
      
      const variables = new Set();
      const matches = cleaned.match(/\b[a-zA-Z\u0600-\u06FF]\b/g);
      
      if (matches) {
          matches.forEach(match => {
              if (match.length === 1) { // متغيرات من حرف واحد فقط
                  variables.add(match);
              }
          });
      }
      
      return Array.from(variables).sort();
  }
  
  /**
   * التحقق من توازن الأقواس
   * @param {string} expression - العبارة
   * @returns {Object} نتيجة التحقق
   */
  static checkBracketBalance(expression) {
      const brackets = {
          '(': ')',
          '[': ']',
          '{': '}',
          '\\{': '\\}',
          '\\[': '\\]',
          '\\(': '\\)'
      };
      
      const stack = [];
      const errors = [];
      
      let i = 0;
      while (i < expression.length) {
          const char = expression[i];
          const nextChars = expression.substr(i, 2);
          
          // فحص الأقواس المركبة (LaTeX)
          if (brackets[nextChars]) {
              stack.push(nextChars);
              i += 2;
              continue;
          }
          
          // فحص الأقواس البسيطة
          if (brackets[char]) {
              stack.push(char);
          } else if (Object.values(brackets).includes(char)) {
              const lastOpening = stack.pop();
              if (!lastOpening || brackets[lastOpening] !== char) {
                  errors.push({
                      type: 'mismatch',
                      position: i,
                      expected: lastOpening ? brackets[lastOpening] : 'opening bracket',
                      found: char
                  });
              }
          }
          
          i++;
      }
      
      // فحص الأقواس المفتوحة غير المغلقة
      if (stack.length > 0) {
          stack.forEach(opening => {
              errors.push({
                  type: 'unclosed',
                  bracket: opening,
                  expected: brackets[opening]
              });
          });
      }
      
      return {
          balanced: errors.length === 0,
          errors: errors
      };
  }
  
  /**
   * تحويل الأرقام من إنجليزي إلى عربي
   * @param {string} text - النص
   * @returns {string} النص مع الأرقام العربية
   */
  static convertNumbersToArabic(text) {
      const arabicNumbers = {
          '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
          '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
      };
      
      return text.replace(/[0-9]/g, digit => arabicNumbers[digit] || digit);
  }
  
  /**
   * تحويل الأرقام من عربي إلى إنجليزي
   * @param {string} text - النص
   * @returns {string} النص مع الأرقام الإنجليزية
   */
  static convertNumbersToEnglish(text) {
      const englishNumbers = {
          '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
          '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
      };
      
      return text.replace(/[٠-٩]/g, digit => englishNumbers[digit] || digit);
  }
  
  /**
   * تنظيف وتحسين المعادلة
   * @param {string} equation - المعادلة
   * @returns {string} المعادلة منظفة
   */
  static cleanEquation(equation) {
      return equation
          .replace(/\s+/g, ' ')                    // توحيد المسافات
          .replace(/\{\s+/g, '{')                  // إزالة المسافات بعد {
          .replace(/\s+\}/g, '}')                  // إزالة المسافات قبل }
          .replace(/\(\s+/g, '(')                  // إزالة المسافات بعد (
          .replace(/\s+\)/g, ')')                  // إزالة المسافات قبل )
          .replace(/\\,/g, ' ')                    // تحويل مسافات LaTeX
          .replace(/\\!/g, '')                     // إزالة المسافات السالبة
          .trim();
  }
  
  /**
   * اكتشاف لغة المعادلة
   * @param {string} equation - المعادلة
   * @returns {string} اللغة المكتشفة
   */
  static detectLanguage(equation) {
      const arabicPattern = /[\u0600-\u06FF]/;
      const arabicFunctions = /\b(جا|جتا|ظا|نها|مج|لو)\b/;
      const englishFunctions = /\b(sin|cos|tan|lim|sum|log)\b/;
      
      if (arabicPattern.test(equation) || arabicFunctions.test(equation)) {
          return 'arabic';
      } else if (englishFunctions.test(equation)) {
          return 'english';
      } else {
          return 'mixed';
      }
  }
  
  /**
   * تحليل بنية LaTeX
   * @param {string} latex - كود LaTeX
   * @returns {Object} تحليل البنية
   */
  static analyzeLaTeXStructure(latex) {
      const structure = {
          commands: [],
          environments: [],
          brackets: { curly: 0, square: 0, round: 0 },
          complexity: 0
      };
      
      // استخراج الأوامر
      const commands = latex.match(/\\[a-zA-Z]+/g);
      if (commands) {
          structure.commands = [...new Set(commands)];
          structure.complexity += commands.length;
      }
      
      // استخراج البيئات
      const environments = latex.match(/\\begin\{([^}]+)\}/g);
      if (environments) {
          structure.environments = environments.map(env => 
              env.match(/\\begin\{([^}]+)\}/)[1]
          );
          structure.complexity += environments.length * 2;
      }
      
      // عد الأقواس
      structure.brackets.curly = (latex.match(/\{/g) || []).length;
      structure.brackets.square = (latex.match(/\[/g) || []).length;
      structure.brackets.round = (latex.match(/\(/g) || []).length;
      
      return structure;
  }
}
