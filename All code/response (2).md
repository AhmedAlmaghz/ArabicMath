

<think>

المستخدم يريد بقية الملفات المفقودة لإكمال المشروع. سأقدم:

1. ملفات الاختبارات (tests/)
2. ملفات التوثيق (docs/)  
3. أمثلة إضافية (examples/)
4. ملفات التكوين الإضافية
5. ملفات الخطوط
6. ملفات الأدوات المساعدة
7. TypeScript definitions
8. ملفات أخرى مهمة

سأقدمها بشكل منظم ومفصل.

</think>

ممتاز! سأكمل باقي الملفات المفقودة لجعل المشروع متكاملاً واحترافياً:

## 🧪 **5. ملفات الاختبارات - tests/**

### **tests/translator.test.js:**
```javascript
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
```

### **tests/parser.test.js:**
```javascript
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
```

### **tests/integration.test.js:**
```javascript
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
```

### **tests/test-runner.html:**
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مجموعة اختبارات المكتبة</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mocha@9/mocha.css">
    <style>
        body { 
            font-family: 'Amiri', serif; 
            background: #f5f5f5; 
        }
        .test-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .test-section {
            background: white;
            margin: 20px 0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .example {
            border: 1px solid #ddd;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .original { background: #ffe6e6; }
        .translated { background: #e6ffe6; }
        .error { background: #ffcccc; color: #cc0000; }
        .success { background: #ccffcc; color: #006600; }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>🧪 مجموعة اختبارات مكتبة الرياضيات العربية</h1>
        
        <div class="test-section">
            <h2>اختبارات يدوية</h2>
            <div id="manual-tests"></div>
        </div>
        
        <div class="test-section">
            <h2>اختبارات الوحدة (Unit Tests)</h2>
            <div id="mocha"></div>
        </div>
    </div>
    
    <!-- تحميل المكتبات -->
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mocha@9/mocha.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chai@4/chai.min.js"></script>
    
    <!-- تحميل مكتبتنا -->
    <script src="../dist/arabic-math.js"></script>
    
    <script>
        // إعداد Mocha
        mocha.setup('bdd');
        const { expect } = chai;
        
        // الاختبارات اليدوية
        document.addEventListener('DOMContentLoaded', async function() {
            await runManualTests();
            
            // تشغيل اختبارات الوحدة
            // هنا ستحمل ملفات الاختبار
            // loadTest('translator.test.js');
            // loadTest('parser.test.js');
            
            mocha.run();
        });
        
        async function runManualTests() {
            const container = document.getElementById('manual-tests');
            const arabicMath = new ArabicMath();
            
            const testCases = [
                {
                    name: 'الدوال المثلثية',
                    input: 'sin(x) + cos(y) = tan(z)',
                    expected: 'جا(س) + جتا(ص) = ظا(ع)'
                },
                {
                    name: 'النهايات',
                    input: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
                    expected: 'نها مع اتجاه س نحو 0'
                },
                {
                    name: 'التكاملات',
                    input: '\\int_0^1 x^2 dx = \\frac{1}{3}',
                    expected: 'تكامل من 1 إلى 0'
                },
                {
                    name: 'المعادلات المعقدة',
                    input: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
                    expected: 'مجموع مع حدود مقلوبة'
                }
            ];
            
            for (const testCase of testCases) {
                const testDiv = document.createElement('div');
                testDiv.className = 'example';
                testDiv.innerHTML = `
                    <h4>${testCase.name}</h4>
                    <div class="original">الأصل: <code>${testCase.input}</code></div>
                    <div class="translated">المترجم: <span class="arabic-math" data-equation="${testCase.input}"></span></div>
                    <div class="status">الحالة: <span class="status-text">جاري المعالجة...</span></div>
                `;
                container.appendChild(testDiv);
                
                try {
                    const mathElement = testDiv.querySelector('.arabic-math');
                    await arabicMath.render(mathElement, testCase.input);
                    
                    const statusText = testDiv.querySelector('.status-text');
                    statusText.textContent = 'تم بنجاح ✅';
                    statusText.className = 'success';
                } catch (error) {
                    const statusText = testDiv.querySelector('.status-text');
                    statusText.textContent = `فشل: ${error.message} ❌`;
                    statusText.className = 'error';
                }
            }
        }
        
        function loadTest(filename) {
            const script = document.createElement('script');
            script.src = filename;
            script.onload = () => console.log(`تم تحميل ${filename}`);
            script.onerror = () => console.error(`فشل تحميل ${filename}`);
            document.head.appendChild(script);
        }
    </script>
</body>
</html>
```

## 📚 **6. ملفات التوثيق - docs/**

### **docs/api-reference.md:**
```markdown
# 📋 مرجع واجهة برمجة التطبيقات (API Reference)

## الفئة الرئيسية: ArabicMath

### المنشئ (Constructor)

```javascript
new ArabicMath(options)
```

**المعاملات:**
- `options` (Object): خيارات التكوين
  - `rtl` (Boolean): تفعيل الكتابة من اليمين إلى اليسار (افتراضي: `true`)
  - `translateNumbers` (Boolean): ترجمة الأرقام إلى العربية (افتراضي: `false`)
  - `font` (String): خط المعادلات (افتراضي: `'Amiri Math'`)
  - `mathRenderer` (String): محرك العرض - `'mathjax'` أو `'katex'` (افتراضي: `'mathjax'`)
  - `autoTranslate` (Boolean): الترجمة التلقائية (افتراضي: `true`)

**مثال:**
```javascript
const arabicMath = new ArabicMath({
    rtl: true,
    translateNumbers: true,
    mathRenderer: 'mathjax'
});
```

---

### الطرق (Methods)

#### `translate(equation, options)`

ترجم معادلة رياضية من الإنجليزية إلى العربية.

**المعاملات:**
- `equation` (String): المعادلة بالإنجليزية (LaTeX أو نص عادي)
- `options` (Object, اختياري): خيارات إضافية للترجمة

**القيمة المرجعة:**
- `String`: المعادلة مترجمة إلى العربية

**أمثلة:**
```javascript
// مثال بسيط
const arabic = arabicMath.translate('sin(x) + cos(y)');
console.log(arabic); // 'جا(س) + جتا(ص)'

// مثال معقد
const complex = arabicMath.translate('\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1');
console.log(complex); // '\\نها_{س \\leftarrow 0} \\frac{\\جا س}{س} = 1'
```

#### `render(target, equation, options)`

عرض معادلة مترجمة في عنصر HTML.

**المعاملات:**
- `target` (String|HTMLElement): العنصر المستهدف أو محدد CSS
- `equation` (String): المعادلة (ستترجم تلقائياً إذا لزم الأمر)
- `options` (Object, اختياري): خيارات العرض

**أمثلة:**
```javascript
// بمحدد CSS
arabicMath.render('#equation1', 'f(x) = sin(x)');

// بعنصر HTML مباشر
const element = document.getElementById('math-container');
arabicMath.render(element, '\\int_0^1 x^2 dx', {
    displayMode: 'block'
});
```

#### `autoTranslate(selector)`

ترجمة تلقائية لجميع العناصر التي تطابق المحدد.

**المعاملات:**
- `selector` (String): محدد CSS للعناصر المراد ترجمتها (افتراضي: `'.math-equation'`)

**مثال:**
```javascript
// ترجمة جميع العناصر ذات الفئة math-equation
arabicMath.autoTranslate();

// ترجمة عناصر محددة
arabicMath.autoTranslate('.formula');
```

---

### الخيارات المتقدمة

#### خيارات الترجمة

```javascript
const options = {
    // تخصيص قاموس الترجمة
    customDictionary: {
        'f': 'د',  // دالة مخصصة
        'theta': 'θ'
    },
    
    // تجاهل ترجمة بعض العناصر
    ignorePatterns: [/\\text\{[^}]*\}/g],
    
    // معالجة RTL متقدمة
    rtlOptions: {
        flipArrows: true,
        swapBounds: true,
        handleMatrices: true
    }
};

arabicMath.translate(equation, options);
```

#### خيارات العرض

```javascript
const renderOptions = {
    // نمط العرض
    displayMode: 'block', // أو 'inline' أو 'auto'
    
    // حجم الخط
    fontSize: '16px',
    
    // لون النص
    color: '#333333',
    
    // تحريك العرض
    animated: true,
    
    // معالجة الأخطاء
    errorHandler: (error) => {
        console.error('خطأ في العرض:', error);
    }
};

arabicMath.render(element, equation, renderOptions);
```

---

### الأحداث (Events)

```javascript
// عند اكتمال الترجمة
arabicMath.on('translated', (originalEquation, translatedEquation) => {
    console.log('تمت الترجمة:', translatedEquation);
});

// عند اكتمال العرض
arabicMath.on('rendered', (element, equation) => {
    console.log('تم العرض في:', element);
});

// عند حدوث خطأ
arabicMath.on('error', (error, context) => {
    console.error('خطأ:', error.message);
});
```

---

### المساعدات الثابتة (Static Helpers)

#### `ArabicMath.isArabicEquation(text)`

تحقق من كون النص معادلة عربية.

```javascript
const isArabic = ArabicMath.isArabicEquation('جا(س) + جتا(ص)');
console.log(isArabic); // true
```

#### `ArabicMath.detectLanguage(equation)`

اكتشاف لغة المعادلة.

```javascript
const lang = ArabicMath.detectLanguage('sin(x) + cos(y)');
console.log(lang); // 'english'
```

#### `ArabicMath.validateEquation(equation)`

التحقق من صحة بناء المعادلة.

```javascript
const validation = ArabicMath.validateEquation('\\frac{sin(x)}{cos(y)}');
console.log(validation);
// {
//   valid: true,
//   errors: [],
//   warnings: ['Missing braces around function arguments']
// }
```

---

### أمثلة شاملة

#### مثال متكامل للموقع:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء مثيل المكتبة
    const arabicMath = new ArabicMath({
        rtl: true,
        mathRenderer: 'mathjax',
        translateNumbers: false
    });
    
    // ترجمة تلقائية للعناصر الموجودة
    arabicMath.autoTranslate('.math-equation');
    
    // معالج للمعادلات الجديدة
    const equationInput = document.getElementById('equation-input');
    const outputDiv = document.getElementById('output');
    
    equationInput.addEventListener('input', function() {
        const equation = this.value;
        if (equation.trim()) {
            arabicMath.render(outputDiv, equation);
        }
    });
    
    // معالجة الأخطاء
    arabicMath.on('error', function(error) {
        console.error('خطأ في المكتبة:', error);
        // عرض رسالة خطأ للمستخدم
    });
});
```
```

### **docs/examples.md:**
```markdown
# 🧩 أمثلة الاستخدام

## أمثلة أساسية

### 1. الدوال المثلثية

```javascript
const arabicMath = new ArabicMath();

// الدوال الأساسية
arabicMath.render('#demo1', 'sin(x) + cos(y) = 1');
// النتيجة: جا(س) + جتا(ص) = ١

// الدوال المقلوبة
arabicMath.render('#demo2', 'arcsin(x) + arccos(y)');
// النتيجة: قاجا(س) + قاجتا(ص)
```

### 2. اللوغاريتمات والأسس

```javascript
// اللوغاريتمات
arabicMath.render('#demo3', 'ln(x) + log_10(y) = z');
// النتيجة: لو(س) + لو₁٠(ص) = ع

// الأسس
arabicMath.render('#demo4', 'e^x + 2^y = z^2');
// النتيجة: هـ^س + ٢^ص = ع^٢
```

## أمثلة متقدمة

### 3. النهايات والتفاضل

```javascript
// نهايات بسيطة
arabicMath.render('#demo5', '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1');
// النتيجة: نها_{س ← ٠} (جا س)/(س) = ١

// نهايات معقدة
arabicMath.render('#demo6', '\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e');
// النتيجة: نها_{ن ← ∞} (١ + ١/ن)^ن = هـ

// المشتقات
arabicMath.render('#demo7', '\\frac{d}{dx}[\\sin(x^2)] = 2x\\cos(x^2)');
// النتيجة: (د/دس)[جا(س²)] = ٢س جتا(س²)
```

### 4. التكامل

```javascript
// تكاملات محددة
arabicMath.render('#demo8', '\\int_0^\\pi \\sin(x) dx = 2');
// النتيجة: ∫^π_٠ جا(س) دس = ٢

// تكاملات مضاعفة
arabicMath.render('#demo9', '\\int_0^1 \\int_0^1 xy \\, dx \\, dy = \\frac{1}{4}');
// النتيجة: ∫^١_٠ ∫^١_٠ سص دس دص = ١/٤
```

### 5. المتسلسلات والمجاميع

```javascript
// متسلسلة هندسية
arabicMath.render('#demo10', '\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1-r}');
// النتيجة: مج^∞_{ن=٠} أ ر^ن = أ/(١-ر)

// متسلسلة تايلور
arabicMath.render('#demo11', 
    'e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots'
);
```

## أمثلة للجبر الخطي

### 6. المتجهات والمصفوفات

```javascript
// الجداء النقطي
arabicMath.render('#demo12', '\\vec{a} \\cdot \\vec{b} = |a||b|\\cos\\theta');
// النتيجة: أ⃗ · ب⃗ = |أ||ب| جتا θ

// المصفوفات
arabicMath.render('#demo13', 
    '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax+by \\\\ cx+dy \\end{pmatrix}'
);
```

## أمثلة للإحصاء والاحتمالات

### 7. التوزيعات

```javascript
// التوزيع الطبيعي
arabicMath.render('#demo14', 
    'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}'
);

// متوسط وتباين
arabicMath.render('#demo15', '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i');
// النتيجة: س̄ = (١/ن) مج^ن_{ط=١} س_ط
```

## أمثلة تفاعلية

### 8. معالج الإدخال المباشر

```html
<div class="interactive-example">
    <input type="text" id="equation-input" placeholder="اكتب معادلة بالإنجليزية">
    <div id="output" class="arabic-math"></div>
</div>

<script>
const arabicMath = new ArabicMath();
const input = document.getElementById('equation-input');
const output = document.getElementById('output');

input.addEventListener('input', function() {
    if (this.value.trim()) {
        arabicMath.render(output, this.value);
    }
});
</script>
```

### 9. مقارنة جنباً إلى جنب

```javascript
function createComparison(originalEq, containerId) {
    const container = document.getElementById(containerId);
    const arabicMath = new ArabicMath();
    
    container.innerHTML = `
        <div class="comparison">
            <div class="original">
                <h4>الأصل (إنجليزي):</h4>
                <div class="math-display">${originalEq}</div>
            </div>
            <div class="translated">
                <h4>المترجم (عربي):</h4>
                <div id="${containerId}-arabic" class="arabic-math"></div>
            </div>
        </div>
    `;
    
    arabicMath.render(`#${containerId}-arabic`, originalEq);
}

// الاستخدام
createComparison('\\int_0^1 x^2 dx = \\frac{1}{3}', 'comparison1');
```

## أمثلة للتخصيص

### 10. قاموس مخصص

```javascript
const customMath = new ArabicMath({
    customDictionary: {
        'f': 'د',           // دالة
        'g': 'جـ',          // دالة أخرى  
        'theta': 'ث',       // ثيتا
        'lambda': 'ل',      // لامبدا
        'velocity': 'ع',    // العجلة
        'acceleration': 'عج' // العجلة
    }
});

customMath.render('#custom-demo', 'f(theta) = velocity * acceleration');
// النتيجة: د(ث) = ع * عج
```

### 11. أنماط مخصصة

```css
.my-arabic-math {
    font-family: 'Amiri', serif;
    font-size: 18px;
    color: #2c3e50;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.my-arabic-math .arabic-function {
    color: #e74c3c;
    font-weight: bold;
}

.my-arabic-math .arabic-variable {
    color: #3498db;
    font-style: italic;
}
```

```javascript
const styledMath = new ArabicMath({
    cssClass: 'my-arabic-math'
});

styledMath.render('#styled-demo', '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}');
```

## استكشاف الأخطاء وإصلاحها

### 12. معالجة الأخطاء

```javascript
const arabicMath = new ArabicMath();

// معالج أخطاء مخصص
arabicMath.on('error', function(error, context) {
    console.error('خطأ في الترجمة:', error.message);
    
    // عرض رسالة خطأ للمستخدم
    const errorDiv = document.createElement('div');
    errorDiv.className = 'math-error';
    errorDiv.innerHTML = `
        <p>❌ حدث خطأ في معالجة المعادلة:</p>
        <code>${context.originalEquation}</code>
        <p>الخطأ: ${error.message}</p>
    `;
    
    context.targetElement.appendChild(errorDiv);
});

// اختبار معادلة خاطئة
arabicMath.render('#error-demo', '\\invalid{command}');
```

### 13. التحقق من الصحة

```javascript
function validateAndRender(equation, targetId) {
    const validation = ArabicMath.validateEquation(equation);
    
    if (!validation.valid) {
        document.getElementById(targetId).innerHTML = `
            <div class="validation-error">
                <h4>الأخطاء:</h4>
                <ul>
                    ${validation.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        return;
    }
    
    if (validation.warnings.length > 0) {
        console.warn('تحذيرات:', validation.warnings);
    }
    
    arabicMath.render(`#${targetId}`, equation);
}

// الاستخدام
validateAndRender('\\frac{sin(x)', 'validation-demo'); // معادلة ناقصة
```
```

## 🔧 **7. ملفات الأدوات المساعدة**

### **src/utils/math-utils.js:**
```javascript
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
```

### **src/utils/string-utils.js:**
```javascript
/**
 * أدوات مساعدة للنصوص
 */
class StringUtils {
    /**
     * تحويل النص إلى كتابة من اليمين إلى اليسار
     * @param {string} text - النص
     * @returns {string} النص معكوس
     */
    static reverseText(text) {
        return text.split('').reverse().join('');
    }
    
    /**
     * إدراج علامات الاتجاه للنص المختلط
     * @param {string} text - النص المختلط
     * @returns {string} النص مع علامات الاتجاه
     */
    static addDirectionalMarks(text) {
        // إضافة علامات RTL للنص العربي
        return text.replace(/[\u0600-\u06FF\u0750-\u077F]+/g, '\u202E$&\u202C');
    }
    
    /**
     * تنظيف النص من العلامات الخاصة
     * @param {string} text - النص
     * @returns {string} النص منظف
     */
    static sanitizeText(text) {
        return text
            .replace(/[\u200B-\u200D\uFEFF]/g, '')  // إزالة Zero Width characters
            .replace(/\u202A|\u202B|\u202C|\u202D|\u202E/g, '') // إزالة علامات الاتجاه
            .normalize('NFC');                       // تطبيع Unicode
    }
    
    /**
     * تقسيم النص مع الاحتفاظ بالفواصل
     * @param {string} text - النص
     * @param {RegExp} separator - الفاصل
     * @returns {Array} مصفوفة الأجزاء والفواصل
     */
    static splitKeepSeparator(text, separator) {
        const parts = [];
        let lastIndex = 0;
        let match;
        
        while ((match = separator.exec(text)) !== null) {
            // إضافة النص قبل الفاصل
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            
            // إضافة الفاصل
            parts.push(match[0]);
            
            lastIndex = separator.lastIndex;
        }
        
        // إضافة النص المتبقي
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        
        return parts.filter(part => part.length > 0);
    }
    
    /**
     * البحث والاستبدال مع دعم الـ callbacks
     * @param {string} text - النص
     * @param {RegExp|string} searchValue - القيمة المراد البحث عنها
     * @param {Function|string} replaceValue - القيمة البديلة أو function
     * @returns {string} النص بعد الاستبدال
     */
    static smartReplace(text, searchValue, replaceValue) {
        if (typeof replaceValue === 'function') {
            return text.replace(searchValue, (...args) => {
                return replaceValue(...args);
            });
        }
        
        return text.replace(searchValue, replaceValue);
    }
    
    /**
     * تحديد الكلمات المحيطة بموقع معين
     * @param {string} text - النص
     * @param {number} position - الموقع
     * @param {number} radius - نصف قطر البحث (بالأحرف)
     * @returns {Object} السياق المحيط
     */
    static getContext(text, position, radius = 10) {
        const start = Math.max(0, position - radius);
        const end = Math.min(text.length, position + radius);
        
        return {
            before: text.substring(start, position),
            at: text.charAt(position),
            after: text.substring(position + 1, end),
            full: text.substring(start, end),
            position: position,
            relativePosition: position - start
        };
    }
    
    /**
     * إزالة التكرار من النص مع الاحتفاظ بالترتيب
     * @param {string} text - النص
     * @param {string} separator - الفاصل
     * @returns {string} النص بدون تكرار
     */
    static removeDuplicates(text, separator = ' ') {
        const parts = text.split(separator);
        const unique = [];
        const seen = new Set();
        
        parts.forEach(part => {
            if (!seen.has(part)) {
                unique.push(part);
                seen.add(part);
            }
        });
        
        return unique.join(separator);
    }
    
    /**
     * تحويل النص إلى slug URL-friendly
     * @param {string} text - النص
     * @returns {string} الـ slug
     */
    static toSlug(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[\u0600-\u06FF]/g, (match) => {
                // تحويل الحروف العربية إلى transliteration
                const arabicToLatin = {
                    'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ا': 'a', 'ب': 'b', 'ت': 't',
                    'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
                    'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
                    'ط': 't', 'ظ': 'dh', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
                    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
                    'ي': 'y', 'ة': 'h', 'ى': 'a', 'ء': 'a'
                };
                return arabicToLatin[match] || match;
            })
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
```

## 🎨 **8. ملفات الخطوط والأنماط**

### **src/styles/themes.css:**
```css
/* ثيمات مختلفة للمكتبة */

/* الثيم الكلاسيكي */
.arabic-math.theme-classic {
    font-family: 'Amiri', 'Times New Roman', serif;
    color: #2c3e50;
    background: transparent;
}

.arabic-math.theme-classic .arabic-function {
    color: #e74c3c;
    font-weight: 600;
}

.arabic-math.theme-classic .arabic-variable {
    color: #3498db;
    font-style: italic;
}

.arabic-math.theme-classic .arabic-operator {
    color: #34495e;
    font-weight: 500;
}

/* الثيم الحديث */
.arabic-math.theme-modern {
    font-family: 'Cairo', 'Segoe UI', sans-serif;
    color: #1a202c;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.arabic-math.theme-modern .math-display {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    margin: 15px 0;
}

/* الثيم المظلم */
.arabic-math.theme-dark {
    font-family: 'IBM Plex Sans Arabic', monospace;
    color: #e2e8f0;
    background: #1a202c;
    border-radius: 8px;
    padding: 15px;
}

.arabic-math.theme-dark .arabic-function {
    color: #63b3ed;
}

.arabic-math.theme-dark .arabic-variable {
    color: #68d391;
}

.arabic-math.theme-dark .arabic-operator {
    color: #f6ad55;
}

.arabic-math.theme-dark .math-display {
    background: #2d3748;
    border: 1px solid #4a5568;
}

/* الثيم الأكاديمي */
.arabic-math.theme-academic {
    font-family: 'Scheherazade New', 'Times New Roman', serif;
    font-size: 18px;
    line-height: 1.8;
    color: #2d3748;
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-radius: 4px;
    padding: 25px;
    margin: 20px 0;
}

.arabic-math.theme-academic .math-display {
    background: white;
    border: 1px solid #cbd5e0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 20px;
    margin: 15px 0;
}

/* الثيم الملون */
.arabic-math.theme-colorful {
    font-family: 'Tajawal', sans-serif;
    background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
    border-radius: 15px;
    padding: 20px;
    margin: 15px 0;
}

.arabic-math.theme-colorful .arabic-function {
    color: #e53e3e;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.arabic-math.theme-colorful .arabic-variable {
    color: #3182ce;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.arabic-math.theme-colorful .math-display {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    padding: 15px;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

/* ثيم الطباعة */
.arabic-math.theme-print {
    font-family: 'Amiri', serif;
    color: #000000;
    background: #ffffff;
    font-size: 12pt;
    line-height: 1.5;
}

.arabic-math.theme-print .math-display {
    page-break-inside: avoid;
    margin: 12pt 0;
}

@media print {
    .arabic-math.theme-print {
        color: #000000 !important;
        background: #ffffff !important;
    }
}

/* أنماط متجاوبة */
@media (max-width: 768px) {
    .arabic-math {
        font-size: 14px;
    }
    
    .arabic-math .math-display {
        padding: 15px;
        margin: 10px 0;
    }
    
    .arabic-math.theme-academic {
        padding: 15px;
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .arabic-math {
        font-size: 12px;
    }
    
    .arabic-math .math-display {
        padding: 10px;
        margin: 8px 0;
    }
}

/* أنماط التفاعل */
.arabic-math.interactive {
    cursor: pointer;
    transition: all 0.3s ease;
}

.arabic-math.interactive:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.arabic-math.interactive:active {
    transform: scale(0.98);
}

/* أنماط الرسوم المتحركة */
@keyframes fadeInEquation {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.arabic-math.animated {
    animation: fadeInEquation 0.6s ease-out;
}

.arabic-math.slide-in {
    animation: slideInFromRight 0.8s ease-out;
}

@keyframes slideInFromRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* أنماط حالة التحميل */
.arabic-math.loading {
    position: relative;
    color: transparent;
}

.arabic-math.loading::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* أنماط رسائل الخطأ */
.arabic-math .math-error {
    color: #e53e3e;
    background: #fed7d7;
    border: 1px solid #feb2b2;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
    font-family: monospace;
    direction: ltr;
    text-align: left;
}

.arabic-math .math-warning {
    color: #d69e2e;
    background: #faf089;
    border: 1px solid #f6e05e;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
}

/* تحسينات إمكانية الوصول */
.arabic-math[aria-label]::before {
    content: attr(aria-label);
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.arabic-math:focus {
    outline: 2px solid #4299e1;
    outline-offset: 2px;
}

/* دعم الطباعة المحسن */
@media print {
    .arabic-math {
        page-break-inside: avoid;
        color: #000000 !important;
        background: #ffffff !important;
    }
    
    .arabic-math .math-display {
        page-break-inside: avoid;
        margin: 0.5cm 0;
    }
    
    .arabic-math.no-print {
        display: none;
    }
}
```

هل تريد مني المتابعة مع باقي الملفات (ملفات الخطوط، أمثلة إضافية، TypeScript definitions، إلخ)؟