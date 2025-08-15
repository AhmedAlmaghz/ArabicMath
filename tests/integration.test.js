/**
 * اختبارات التكامل الشامل
 */
describe('ArabicMath Integration Tests', () => {
    let arabicMath;
    let container;
    
    beforeEach(() => {
        // إنشاء حاوي للاختبار
        container = document.createElement('div');
        document.body.appendChild(container);
        
        arabicMath = new ArabicMath({
            rtl: true,
            translateNumbers: false,
            mathRenderer: 'mathjax'
        });
    });
    
    afterEach(() => {
        document.body.removeChild(container);
    });
    
    describe('End-to-End Translation', () => {
        test('should translate and render simple equation', async () => {
            const equation = 'f(x) = sin(x) + cos(x)';
            
            await arabicMath.render(container, equation);
            
            expect(container.innerHTML).toContain('ق(س)');
            expect(container.innerHTML).toContain('جا(س)');
            expect(container.innerHTML).toContain('جتا(س)');
            expect(container.classList.contains('arabic-math')).toBe(true);
        });
        
        test('should handle complex calculus expressions', async () => {
            const equation = '\\lim_{x \\to 0} \\frac{d}{dx}[\\sin(x^2)]';
            
            await arabicMath.render(container, equation);
            
            expect(container.innerHTML).toContain('نها');
            expect(container.innerHTML).toContain('جا');
            expect(container.dir).toBe('rtl');
        });
    });
    
    describe('RTL Handling', () => {
        test('should apply RTL classes and attributes', async () => {
            await arabicMath.render(container, 'x + y = z');
            
            expect(container.classList.contains('arabic-math')).toBe(true);
            expect(container.classList.contains('rtl')).toBe(true);
            expect(container.dir).toBe('rtl');
        });
        
        test('should flip arrows in RTL context', () => {
            const translated = arabicMath.translate('x → y → z');
            expect(translated).toContain('←');
            expect(translated).not.toContain('→');
        });
    });
    
    describe('Auto-translation Feature', () => {
        test('should auto-translate elements with math-equation class', () => {
            // إنشاء عناصر للاختبار
            const eq1 = document.createElement('div');
            eq1.className = 'math-equation';
            eq1.textContent = 'sin(x) + cos(y)';
            container.appendChild(eq1);
            
            const eq2 = document.createElement('div');
            eq2.className = 'math-equation';
            eq2.textContent = 'log(z) = ln(z)';
            container.appendChild(eq2);
            
            // تطبيق الترجمة التلقائية
            arabicMath.autoTranslate('.math-equation');
            
            // التحقق من الترجمة
            expect(eq1.innerHTML).toContain('جا');
            expect(eq1.innerHTML).toContain('جتا');
            expect(eq2.innerHTML).toContain('لو');
        });
    });
});
