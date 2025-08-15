/**
 * محلل المعادلات الرياضية
 * يحول النص إلى هيكل بيانات قابل للمعالجة
 */
class MathParser {
    constructor() {
        this.tokenTypes = {
            FUNCTION: 'function',
            VARIABLE: 'variable',
            NUMBER: 'number',
            OPERATOR: 'operator',
            SYMBOL: 'symbol',
            BRACKET: 'bracket',
            LATEX_COMMAND: 'latex_command'
        };
    }
    
    /**
     * تحليل المعادلة الرياضية
     * @param {string} input - النص المدخل
     * @returns {Array} مصفوفة من الرموز المحللة
     */
    parse(input) {
        // تنظيف النص المدخل
        const cleaned = this.preprocess(input);
        
        // تقسيم إلى رموز
        const tokens = this.tokenize(cleaned);
        
        // تحليل تركيبي
        const ast = this.buildAST(tokens);
        
        return ast;
    }
    
    preprocess(input) {
        return input
            .replace(/\s+/g, ' ')           // توحيد المسافات
            .replace(/\\,/g, ' ')           // مسافات LaTeX
            .replace(/\\!/g, '')            // إزالة المسافات السالبة
            .trim();
    }
    
    tokenize(input) {
        const tokens = [];
        const patterns = [
            { type: this.tokenTypes.LATEX_COMMAND, regex: /\\[a-zA-Z]+\*?/g },
            { type: this.tokenTypes.FUNCTION, regex: /\b(sin|cos|tan|log|ln|exp|sqrt|lim|sum|prod|int)\b/g },
            { type: this.tokenTypes.NUMBER, regex: /\d+\.?\d*/g },
            { type: this.tokenTypes.VARIABLE, regex: /\b[a-zA-Z]\b/g },
            { type: this.tokenTypes.OPERATOR, regex: /[+\-*/=<>≤≥≠≈]/g },
            { type: this.tokenTypes.SYMBOL, regex: /[∫∑∏√∞π∂∇]/g },
            { type: this.tokenTypes.BRACKET, regex: /[(){}\[\]]/g }
        ];
        
        let position = 0;
        while (position < input.length) {
            let matched = false;
            
            for (const pattern of patterns) {
                pattern.regex.lastIndex = position;
                const match = pattern.regex.exec(input);
                
                if (match && match.index === position) {
                    tokens.push({
                        type: pattern.type,
                        value: match[0],
                        position: position
                    });
                    position = match.index + match[0].length;
                    matched = true;
                    break;
                }
            }
            
            if (!matched) {
                position++;
            }
        }
        
        return tokens;
    }
    
    buildAST(tokens) {
        // بناء شجرة التحليل التركيبي
        // هذا مبسط - في التطبيق الحقيقي نحتاج parser أعقد
        return {
            type: 'expression',
            tokens: tokens,
            structure: this.analyzeStructure(tokens)
        };
    }
    
    analyzeStructure(tokens) {
        const structure = {
            functions: [],
            variables: [],
            operators: [],
            commands: []
        };
        
        tokens.forEach(token => {
            switch (token.type) {
                case this.tokenTypes.FUNCTION:
                    structure.functions.push(token);
                    break;
                case this.tokenTypes.VARIABLE:
                    structure.variables.push(token);
                    break;
                case this.tokenTypes.OPERATOR:
                    structure.operators.push(token);
                    break;
                case this.tokenTypes.LATEX_COMMAND:
                    structure.commands.push(token);
                    break;
            }
        });
        
        return structure;
    }
}

// UMD-style export to expose the parser in both browser and Node environments
;(function (root) {
  try {
    if (typeof module === 'object' && module.exports) {
      module.exports = MathParser;
    } else if (typeof root !== 'undefined') {
      root.ArabicMathParser = root.ArabicMathParser || MathParser;
    }
  } catch (_) { /* noop */ }
})(typeof self !== 'undefined' ? self : this);
