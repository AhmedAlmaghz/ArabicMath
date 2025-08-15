/**
 * اختبارات محرك الترجمة
 */
describe('MathTranslator Tests', () => {
    let translator;
    
    beforeEach(() => {
        translator = new MathTranslator();
    });
    
    describe('Basic Symbol Translation', () => {
        test('should translate basic variables', () => {
            expect(translator.translateSymbols('x + y = z')).toBe('س + ص = ع');
            expect(translator.translateSymbols('a * b + c')).toBe('أ * ب + جـ');
        });
        
        test('should translate mathematical constants', () => {
            expect(translator.translateSymbols('pi * e')).toBe('π * هـ');
            expect(translator.translateSymbols('infinity')).toBe('∞');
        });
    });
    
    describe('Function Translation', () => {
        test('should translate trigonometric functions', () => {
            expect(translator.translateFunctions('sin(x)')).toBe('جا(س)');
            expect(translator.translateFunctions('cos(theta)')).toBe('جتا(theta)');
            expect(translator.translateFunctions('tan(x) + cot(y)')).toBe('ظا(س) + ظتا(ص)');
        });
        
        test('should translate logarithmic functions', () => {
            expect(translator.translateFunctions('ln(x)')).toBe('لو(س)');
            expect(translator.translateFunctions('log(10)')).toBe('لو(10)');
            expect(translator.translateFunctions('exp(x)')).toBe('هـ^(س)');
        });
    });
    
    describe('Compound Expressions', () => {
        test('should translate limits correctly', () => {
            const input = '\\lim_{x \\to 0} \\frac{\\sin x}{x}';
            const expected = '\\نها_{س \\leftarrow 0} \\frac{\\جا س}{س}';
            expect(translator.translateCompounds(input)).toBe(expected);
        });
        
        test('should translate integrals with bound swapping', () => {
            const input = '\\int_{0}^{1} x^2 dx';
            const expected = '\\int^{1}_{0} س^2 دس';
            expect(translator.translateCompounds(input)).toBe(expected);
        });
        
        test('should translate derivatives', () => {
            const input = '\\frac{dx}{dt}';
            const expected = '\\frac{دس}{دت}';
            expect(translator.translateCompounds(input)).toBe(expected);
        });
    });
    
    describe('Complex Equations', () => {
        test('should translate complete equations', () => {
            const input = '\\lim_{n \\to \\infty} \\sum_{k=1}^{n} \\frac{1}{k^2} = \\frac{\\pi^2}{6}';
            const expected = '\\نها_{ن \\leftarrow ∞} \\مج^{ن}_{ك=1} \\frac{1}{ك^2} = \\frac{π^2}{6}';
            
            const result = translator.translate(input);
            expect(result).toContain('\\نها');
            expect(result).toContain('\\مج');
            expect(result).toContain('ن');
            expect(result).toContain('ك');
        });
    });
    
    describe('Edge Cases', () => {
        test('should handle empty input', () => {
            expect(translator.translate('')).toBe('');
            expect(translator.translate(null)).toBe('');
            expect(translator.translate(undefined)).toBe('');
        });
        
        test('should handle mixed Arabic-English', () => {
            const input = 'sin(س) + جا(x)';
            const result = translator.translate(input);
            expect(result).toContain('جا');
            expect(result).toContain('س');
        });
        
        test('should preserve non-mathematical text', () => {
            const input = 'The function f(x) = sin(x)';
            const result = translator.translate(input);
            expect(result).toContain('The function'); // النص العادي يبقى
            expect(result).toContain('ق(س)');
            expect(result).toContain('جا(س)');
        });
    });
});
