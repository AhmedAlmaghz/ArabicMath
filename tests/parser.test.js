/**
 * اختبارات محلل المعادلات
 */
describe('MathParser Tests', () => {
    let parser;
    
    beforeEach(() => {
        parser = new MathParser();
    });
    
    describe('Tokenization', () => {
        test('should tokenize basic mathematical expression', () => {
            const tokens = parser.tokenize('sin(x) + cos(y)');
            
            expect(tokens).toHaveLength(7);
            expect(tokens[0]).toEqual({
                type: 'function',
                value: 'sin',
                position: 0
            });
            expect(tokens[2]).toEqual({
                type: 'variable',
                value: 'x',
                position: 4
            });
        });
        
        test('should handle LaTeX commands', () => {
            const tokens = parser.tokenize('\\frac{x}{y} + \\sqrt{z}');
            
            const fracToken = tokens.find(t => t.value === '\\frac');
            const sqrtToken = tokens.find(t => t.value === '\\sqrt');
            
            expect(fracToken).toBeDefined();
            expect(fracToken.type).toBe('latex_command');
            expect(sqrtToken).toBeDefined();
            expect(sqrtToken.type).toBe('latex_command');
        });
    });
    
    describe('Structure Analysis', () => {
        test('should identify function calls', () => {
            const ast = parser.parse('sin(x) + log(y)');
            
            expect(ast.structure.functions).toHaveLength(2);
            expect(ast.structure.functions[0].value).toBe('sin');
            expect(ast.structure.functions[1].value).toBe('log');
        });
        
        test('should identify variables', () => {
            const ast = parser.parse('a*x^2 + b*x + c');
            
            expect(ast.structure.variables).toHaveLength(4);
            const varNames = ast.structure.variables.map(v => v.value);
            expect(varNames).toEqual(expect.arrayContaining(['a', 'x', 'b', 'c']));
        });
    });
    
    describe('Complex Expressions', () => {
        test('should parse nested functions', () => {
            const ast = parser.parse('sin(cos(x))');
            
            expect(ast.structure.functions).toHaveLength(2);
            expect(ast.structure.functions.map(f => f.value))
                .toEqual(expect.arrayContaining(['sin', 'cos']));
        });
        
        test('should parse integrals with bounds', () => {
            const ast = parser.parse('\\int_{0}^{\\pi} sin(x) dx');
            
            expect(ast.structure.commands.some(c => c.value === '\\int')).toBe(true);
            expect(ast.structure.functions.some(f => f.value === 'sin')).toBe(true);
        });
    });
});
