ممتاز! سأساعدك في بناء مكتبة ويب مثالية ومتكاملة للرياضيات العربية. إليك مشروع شامل وعملي:

## 🏗️ **هيكل المشروع**

```
ArabicMathJS/
├── src/
│   ├── core/
│   │   ├── translator.js
│   │   ├── parser.js
│   │   └── renderer.js
│   ├── dictionaries/
│   │   ├── symbols.js
│   │   ├── functions.js
│   │   └── operations.js
│   ├── utils/
│   │   ├── rtl-handler.js
│   │   └── validator.js
│   └── styles/
│       ├── arabic-math.css
│       └── fonts/
├── dist/
├── examples/
├── tests/
└── docs/
```

## 📝 **1. الملف الأساسي: ArabicMath.js**

```javascript
/**
 * مكتبة الرياضيات العربية للويب
 * ArabicMath.js - v1.0.0
 * المؤلف: [اسمك]
 * الترخيص: MIT
 */

class ArabicMath {
    constructor(options = {}) {
        this.options = {
            rtl: true,
            translateNumbers: false,
            font: 'Amiri Math',
            mathRenderer: 'mathjax', // أو 'katex'
            autoTranslate: true,
            ...options
        };
        
        this.translator = new MathTranslator(this.options);
        this.parser = new MathParser();
        this.renderer = new MathRenderer(this.options);
        
        // تحميل MathJax أو KaTeX
        this.loadMathEngine();
        
        // تطبيق الأنماط
        this.loadStyles();
        
        console.log('🔢 مكتبة الرياضيات العربية جاهزة للاستخدام');
    }
    
    /**
     * ترجمة معادلة من الإنجليزية إلى العربية
     * @param {string} equation - المعادلة بالإنجليزية
     * @param {object} options - خيارات إضافية
     * @returns {string} المعادلة بالعربية
     */
    translate(equation, options = {}) {
        try {
            // تحليل المعادلة
            const parsed = this.parser.parse(equation);
            
            // ترجمة العناصر
            const translated = this.translator.translate(parsed, options);
            
            // معالجة الاتجاه (RTL)
            const rtlProcessed = this.handleRTL(translated);
            
            return rtlProcessed;
        } catch (error) {
            console.error('خطأ في الترجمة:', error);
            return equation; // إرجاع النص الأصلي في حالة الخطأ
        }
    }
    
    /**
     * عرض المعادلة في عنصر HTML
     * @param {string|HTMLElement} target - العنصر المستهدف
     * @param {string} equation - المعادلة
     * @param {object} options - خيارات العرض
     */
    render(target, equation, options = {}) {
        const element = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;
            
        if (!element) {
            console.error('العنصر المستهدف غير موجود');
            return;
        }
        
        // ترجمة المعادلة إذا لزم الأمر
        const finalEquation = options.autoTranslate !== false 
            ? this.translate(equation, options)
            : equation;
        
        // عرض المعادلة
        this.renderer.render(element, finalEquation, options);
    }
    
    /**
     * إعداد الترجمة التلقائية لجميع عناصر الصفحة
     * @param {string} selector - محدد CSS للعناصر
     */
    autoTranslate(selector = '.math-equation') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const originalText = element.textContent || element.innerHTML;
            this.render(element, originalText);
        });
    }
    
    // الطرق المساعدة
    loadMathEngine() {
        if (this.options.mathRenderer === 'mathjax') {
            this.loadMathJax();
        } else if (this.options.mathRenderer === 'katex') {
            this.loadKaTeX();
        }
    }
    
    loadMathJax() {
        if (typeof MathJax === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            script.onload = () => this.configureMathJax();
            document.head.appendChild(script);
        } else {
            this.configureMathJax();
        }
    }
    
    configureMathJax() {
        window.MathJax = {
            tex: {
                inlineMath: [['\\(', '\\)'], ['$', '$']],
                displayMath: [['\\[', '\\]'], ['$$', '$$']],
                macros: this.getMathJaxMacros()
            },
            chtml: {
                fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2',
                displayAlign: this.options.rtl ? 'right' : 'left'
            }
        };
    }
    
    getMathJaxMacros() {
        return {
            'جا': '{\\sin}',
            'جتا': '{\\cos}',
            'ظا': '{\\tan}',
            'نها': '{\\lim}',
            'مج': '{\\sum}',
            'جد': '{\\prod}',
            'تك': '{\\int}',
            'لو': '{\\log}',
            'قاجا': '{\\arcsin}',
            'قاجتا': '{\\arccos}',
            'قاظا': '{\\arctan}'
        };
    }
    
    handleRTL(equation) {
        if (!this.options.rtl) return equation;
        
        // معالجة الأسهم والاتجاهات
        return equation
            .replace(/→/g, '←')
            .replace(/⟹/g, '⟸')
            .replace(/\\_\{([^}]*)\}\^\{([^}]*)\}/g, '^{$2}_{$1}'); // تبديل المؤشرات
    }
    
    loadStyles() {
        if (!document.getElementById('arabic-math-styles')) {
            const link = document.createElement('link');
            link.id = 'arabic-math-styles';
            link.rel = 'stylesheet';
            link.href = 'path/to/arabic-math.css'; // مسار ملف CSS
            document.head.appendChild(link);
        }
    }
}
```

## 🔄 **2. محرك الترجمة: translator.js**

```javascript
class MathTranslator {
    constructor(options = {}) {
        this.options = options;
        this.loadDictionaries();
    }
    
    loadDictionaries() {
        // تحميل القواميس من ملفات منفصلة
        this.symbols = MathSymbols;
        this.functions = MathFunctions;
        this.operations = MathOperations;
        this.compounds = CompoundPatterns;
    }
    
    translate(parsedEquation, options = {}) {
        let result = parsedEquation;
        
        // 1. ترجمة الدوال المركبة أولاً
        result = this.translateCompounds(result);
        
        // 2. ترجمة الدوال الرياضية
        result = this.translateFunctions(result);
        
        // 3. ترجمة المتغيرات والرموز
        result = this.translateSymbols(result);
        
        // 4. ترجمة العمليات
        result = this.translateOperations(result);
        
        // 5. ترجمة الأرقام (اختياري)
        if (this.options.translateNumbers) {
            result = this.translateNumbers(result);
        }
        
        return result;
    }
    
    translateCompounds(equation) {
        // معالجة الأنماط المركبة مثل lim_{x→0}
        const patterns = [
            {
                regex: /\\lim_\{([a-z])\s*\\to\s*([^}]*)\}/gi,
                replacement: (match, variable, limit) => 
                    `\\نها_{${this.symbols[variable] || variable} \\leftarrow ${limit}}`
            },
            {
                regex: /\\frac\{d([a-z])\}\{d([a-z])\}/gi,
                replacement: (match, var1, var2) =>
                    `\\frac{د${this.symbols[var1] || var1}}{د${this.symbols[var2] || var2}}`
            },
            {
                regex: /\\int_\{([^}]*)\}\^\{([^}]*)\}/gi,
                replacement: (match, lower, upper) =>
                    `\\int^{${upper}}_{${lower}}` // تبديل الحدود للعربية
            }
        ];
        
        let result = equation;
        patterns.forEach(pattern => {
            result = result.replace(pattern.regex, pattern.replacement);
        });
        
        return result;
    }
    
    translateFunctions(equation) {
        // ترجمة الدوال الرياضية
        Object.entries(this.functions).forEach(([eng, ar]) => {
            const regex = new RegExp(`\\b${eng}\\b`, 'gi');
            equation = equation.replace(regex, ar);
        });
        return equation;
    }
    
    translateSymbols(equation) {
        // ترجمة المتغيرات والرموز - يجب أن تكون منتبهة للسياق
        Object.entries(this.symbols).forEach(([eng, ar]) => {
            // تجنب ترجمة الحروف داخل الكلمات
            const regex = new RegExp(`(?<!\\w)${eng}(?!\\w)`, 'gi');
            equation = equation.replace(regex, ar);
        });
        return equation;
    }
    
    translateOperations(equation) {
        Object.entries(this.operations).forEach(([eng, ar]) => {
            equation = equation.replace(new RegExp(eng, 'g'), ar);
        });
        return equation;
    }
    
    translateNumbers(equation) {
        const arabicNumbers = {
            '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
            '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
        };
        
        return equation.replace(/\d/g, digit => arabicNumbers[digit] || digit);
    }
}
```

## 📊 **3. قواميس منفصلة: dictionaries/symbols.js**

```javascript
// رموز ومتغيرات أساسية
const MathSymbols = {
    // المتغيرات
    'x': 'س', 'y': 'ص', 'z': 'ع', 'w': 'و',
    'a': 'أ', 'b': 'ب', 'c': 'جـ', 'd': 'د',
    'f': 'ق', 'g': 'جـ', 'h': 'ح', 'n': 'ن',
    't': 'ت', 'u': 'هـ', 'v': 'خ', 'r': 'ر',
    
    // الثوابت
    'pi': 'π', 'e': 'هـ', 'infinity': '∞',
    
    // الحروف اليونانية الشائعة
    'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ',
    'epsilon': 'ε', 'theta': 'θ', 'lambda': 'λ', 'mu': 'μ',
    'sigma': 'σ', 'phi': 'φ', 'omega': 'ω'
};

// الدوال الرياضية
const MathFunctions = {
    // الدوال المثلثية
    'sin': 'جا', 'cos': 'جتا', 'tan': 'ظا',
    'cot': 'ظتا', 'sec': 'قا', 'csc': 'قتا',
    'arcsin': 'قاجا', 'arccos': 'قاجتا', 'arctan': 'قاظا',
    'sinh': 'جازا', 'cosh': 'جتازا', 'tanh': 'ظازا',
    
    // الدوال اللوغاريتمية
    'ln': 'لو', 'log': 'لو', 'exp': 'هـ^',
    
    // دوال أخرى
    'sqrt': 'جذر', 'abs': 'مطلق', 'max': 'غا', 'min': 'صغ',
    'lim': 'نها', 'sum': 'مج', 'prod': 'جد', 'int': 'تك'
};

// العمليات والرموز الخاصة
const MathOperations = {
    // الأسهم
    '→': '←', '←': '→', '⟹': '⟸', '⟸': '⟹',
    '↔': '↔', '⟺': '⟺',
    
    // علامات التكامل والمجاميع
    '∫': '∫', '∬': '∬', '∭': '∭', '∮': '∮',
    '∑': '∑', '∏': '∏',
    
    // المقارنات
    '≤': '≤', '≥': '≥', '≠': '≠', '≈': '≈', '≡': '≡',
    
    // المجموعات
    '∈': '∈', '∉': '∉', '⊂': '⊂', '⊃': '⊃',
    '∪': '∪', '∩': '∩', '∅': '∅',
    
    // المنطق
    '∧': '∧', '∨': '∨', '¬': '¬', '∀': '∀', '∃': '∃'
};

// الأنماط المركبة
const CompoundPatterns = [
    {
        name: 'limit',
        regex: /lim_\{([^}]+)\}/g,
        replacement: 'نها_{$1}'
    },
    {
        name: 'integral_bounds',
        regex: /\\int_([^\\s]+)\^([^\\s]+)/g,
        replacement: '\\int^{$2}_{$1}'
    },
    {
        name: 'sum_bounds', 
        regex: /\\sum_([^\\s]+)\^([^\\s]+)/g,
        replacement: '\\sum^{$2}_{$1}'
    }
];
```

## 🎨 **4. ملف الأنماط: arabic-math.css**

```css
/* أنماط الرياضيات العربية */
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

.arabic-math {
    direction: rtl;
    font-family: 'Amiri', 'Times New Roman', serif;
    font-size: 16px;
    text-align: right;
    unicode-bidi: embed;
}

.arabic-math .math-equation {
    display: inline-block;
    direction: rtl;
    text-align: center;
    margin: 0.5em 0;
}

.arabic-math .math-display {
    display: block;
    text-align: center;
    margin: 1em auto;
    direction: rtl;
}

/* تخصيص الرموز الرياضية */
.arabic-math .math-symbol {
    font-weight: normal;
    font-style: normal;
}

.arabic-math .math-function {
    font-family: 'Amiri', serif;
    font-weight: 600;
}

.arabic-math .math-variable {
    font-style: italic;
    font-family: 'Amiri', serif;
}

/* تحسين عرض الكسور */
.arabic-math .math-fraction {
    direction: rtl;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
}

.arabic-math .math-fraction .numerator {
    display: block;
    border-bottom: 1px solid currentColor;
    padding-bottom: 2px;
    margin-bottom: 2px;
}

.arabic-math .math-fraction .denominator {
    display: block;
    padding-top: 2px;
}

/* تحسين عرض الجذور */
.arabic-math .math-root {
    direction: rtl;
    position: relative;
}

/* تحسين عرض المؤشرات العلوية والسفلية */
.arabic-math .math-subsup {
    direction: ltr; /* المؤشرات تبقى من اليسار لليمين */
    display: inline-block;
}

/* تحسين عرض المصفوفات */
.arabic-math .math-matrix {
    direction: ltr; /* المصفوفات من اليسار لليمين */
    display: inline-block;
    vertical-align: middle;
}

/* دعم الطباعة */
@media print {
    .arabic-math {
        color: black;
        background: white;
    }
}

/* دعم الشاشات الصغيرة */
@media (max-width: 768px) {
    .arabic-math {
        font-size: 14px;
    }
    
    .arabic-math .math-display {
        font-size: 16px;
        margin: 0.8em auto;
    }
}

/* دعم الوضع المظلم */
@media (prefers-color-scheme: dark) {
    .arabic-math {
        color: #e0e0e0;
    }
}

/* تحسينات إضافية للقراءة */
.arabic-math .math-limit {
    direction: rtl;
    text-align: center;
}

.arabic-math .math-integral {
    direction: rtl;
    font-size: 1.2em;
}

.arabic-math .math-sum {
    direction: rtl;
    font-size: 1.3em;
}

/* رموز خاصة بالعربية */
.arabic-math .arabic-function {
    font-family: 'Amiri', serif;
    font-weight: 600;
    color: #2E86AB;
}

.arabic-math .arabic-variable {
    font-family: 'Amiri', serif;
    font-style: italic;
    color: #A23B72;
}

/* تحسين التباعد */
.arabic-math .math-operator {
    margin: 0 0.2em;
}

.arabic-math .math-function {
    margin-left: 0.1em;
}
```

## 🚀 **5. مثال للاستخدام: example.html**

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مكتبة الرياضيات العربية - مثال</title>
    <link rel="stylesheet" href="dist/arabic-math.css">
</head>
<body>
    <div class="container">
        <h1>مكتبة الرياضيات العربية</h1>
        
        <!-- أمثلة تفاعلية -->
        <div class="demo-section">
            <h2>أمثلة حية</h2>
            
            <div class="math-example">
                <h3>المعادلة الأصلية:</h3>
                <div class="original-equation">
                    \lim_{x \to 0} \frac{\sin x}{x} = 1
                </div>
                
                <h3>بعد الترجمة:</h3>
                <div class="arabic-math" id="example1"></div>
            </div>
            
            <div class="math-example">
                <h3>تكامل معقد:</h3>
                <div class="arabic-math" id="example2"></div>
            </div>
            
            <div class="math-example">
                <h3>معادلة تفاضلية:</h3>
                <div class="arabic-math" id="example3"></div>
            </div>
        </div>
        
        <!-- مربع تجريب تفاعلي -->
        <div class="interactive-section">
            <h2>جرب بنفسك</h2>
            <div class="input-group">
                <label for="equation-input">اكتب معادلة بالإنجليزية:</label>
                <textarea id="equation-input" placeholder="مثال: sin(x) + cos(y) = z"></textarea>
                <button onclick="translateAndDisplay()">ترجم إلى العربية</button>
            </div>
            <div class="output-group">
                <h3>النتيجة:</h3>
                <div class="arabic-math" id="output"></div>
            </div>
        </div>
    </div>
    
    <!-- تحميل المكتبات -->
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <script src="dist/arabic-math.min.js"></script>
    
    <script>
        // تهيئة المكتبة
        const arabicMath = new ArabicMath({
            rtl: true,
            translateNumbers: false,
            mathRenderer: 'mathjax',
            autoTranslate: true
        });
        
        // تحميل الأمثلة
        document.addEventListener('DOMContentLoaded', function() {
            // مثال 1: نهاية
            arabicMath.render('#example1', 
                '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1'
            );
            
            // مثال 2: تكامل
            arabicMath.render('#example2', 
                '\\int_0^\\pi \\sin(x) dx = 2'
            );
            
            // مثال 3: معادلة تفاضلية
            arabicMath.render('#example3', 
                '\\frac{dy}{dx} + y = e^x'
            );
        });
        
        // دالة الترجمة التفاعلية
        function translateAndDisplay() {
            const input = document.getElementById('equation-input').value;
            if (input.trim()) {
                arabicMath.render('#output', input);
            }
        }
        
        // ربط الإدخال بالترجمة الفورية
        document.getElementById('equation-input').addEventListener('input', 
            function(e) {
                if (e.target.value.trim()) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        translateAndDisplay();
                    }, 500);
                }
            }
        );
    </script>
</body>
</html>
```

## 🛠️ **6. ملف البناء: build.js**

```javascript
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

async function buildLibrary() {
    console.log('🏗️ بدء عملية البناء...');
    
    // قراءة الملفات المصدرية
    const coreFiles = [
        'src/core/translator.js',
        'src/core/parser.js', 
        'src/core/renderer.js',
        'src/ArabicMath.js'
    ];
    
    const dictFiles = [
        'src/dictionaries/symbols.js',
        'src/dictionaries/functions.js',
        'src/dictionaries/operations.js'
    ];
    
    // دمج الملفات
    let combinedJS = '';
    
    // إضافة القواميس أولاً
    dictFiles.forEach(file => {
        if (fs.existsSync(file)) {
            combinedJS += fs.readFileSync(file, 'utf8') + '\n';
        }
    });
    
    // إضافة الملفات الأساسية
    coreFiles.forEach(file => {
        if (fs.existsSync(file)) {
            combinedJS += fs.readFileSync(file, 'utf8') + '\n';
        }
    });
    
    // تصغير JavaScript
    const minifiedJS = await minify(combinedJS, {
        compress: {
            dead_code: true,
            drop_console: false,
            drop_debugger: true,
            keep_fargs: false,
            unsafe: true,
            unsafe_comps: true,
            unsafe_math: true
        },
        mangle: {
            toplevel: true
        },
        output: {
            comments: false,
            beautify: false
        }
    });
    
    // إنشاء مجلد dist
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    
    // كتابة الملف المصغر
    fs.writeFileSync('dist/arabic-math.min.js', minifiedJS.code);
    fs.writeFileSync('dist/arabic-math.js', combinedJS);
    
    // معالجة CSS
    const cssContent = fs.readFileSync('src/styles/arabic-math.css', 'utf8');
    const minifiedCSS = new CleanCSS({
        level: 2,
        format: 'beautify'
    }).minify(cssContent);
    
    fs.writeFileSync('dist/arabic-math.css', cssContent);
    fs.writeFileSync('dist/arabic-math.min.css', minifiedCSS.styles);
    
    // إنشاء ملف package.json
    const packageJson = {
        name: 'arabic-math-js',
        version: '1.0.0',
        description: 'مكتبة جافا سكريبت لعرض وترجمة المعادلات الرياضية إلى العربية',
        main: 'dist/arabic-math.js',
        files: ['dist/'],
        keywords: ['math', 'arabic', 'mathematics', 'equations', 'rtl'],
        author: 'Your Name',
        license: 'MIT',
        repository: {
            type: 'git',
            url: 'https://github.com/username/arabic-math-js.git'
        },
        bugs: {
            url: 'https://github.com/username/arabic-math-js/issues'
        },
        homepage: 'https://github.com/username/arabic-math-js#readme'
    };
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    
    console.log('✅ تم بناء المكتبة بنجاح!');
    console.log(`📦 حجم JS: ${(fs.statSync('dist/arabic-math.min.js').size / 1024).toFixed(1)} KB`);
    console.log(`🎨 حجم CSS: ${(fs.statSync('dist/arabic-math.min.css').size / 1024).toFixed(1)} KB`);
}

buildLibrary().catch(console.error);
```

## 📋 **7. ملف التوثيق: README.md**

```markdown
# 🔢 مكتبة الرياضيات العربية

مكتبة جافا سكريبت متقدمة لعرض وترجمة المعادلات الرياضية إلى اللغة العربية مع دعم كامل للكتابة من اليمين إلى اليسار.

## ✨ المميزات

- 🔄 ترجمة تلقائية من الإنجليزية إلى العربية
- ↔️ دعم كامل للكتابة من اليمين إلى اليسار (RTL)
- 🎨 تصميم عربي أصيل للمعادلات
- 📱 متجاوب مع جميع الأجهزة
- ⚡ أداء سريع وخفيف
- 🔧 سهل التخصيص والتوسيع

## 🚀 التثبيت

### عبر CDN
```html
<script src="https://cdn.jsdelivr.net/npm/arabic-math-js@1.0.0/dist/arabic-math.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/arabic-math-js@1.0.0/dist/arabic-math.min.css">
```

### عبر npm
```bash
npm install arabic-math-js
```

## 📖 الاستخدام

### الاستخدام الأساسي
```javascript
const arabicMath = new ArabicMath();

// ترجمة معادلة
const arabic = arabicMath.translate('sin(x) + cos(y) = 1');
console.log(arabic); // جا(س) + جتا(ص) = ١