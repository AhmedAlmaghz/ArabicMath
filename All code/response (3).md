

<think>

المستخدم يريد المتابعة مع باقي الملفات. سأقدم:

1. ملفات الخطوط والموارد
2. أمثلة إضافية للاستخدام
3. TypeScript definitions 
4. ملفات التكوين الإضافية
5. ملفات التوثيق المتقدم
6. أدوات التطوير
7. ملفات النشر والتوزيع
8. اختبارات الأداء

سأبدأ بالملفات المهمة المتبقية.

</think>

ممتاز! سأكمل باقي الملفات لجعل المشروع احترافياً ومتكاملاً:

## 📁 **9. ملفات الخطوط والموارد - src/styles/fonts/**

### **font-loader.js:**
```javascript
/**
 * محمل الخطوط العربية للرياضيات
 */
class FontLoader {
    constructor() {
        this.loadedFonts = new Set();
        this.fontPromises = new Map();
    }
    
    /**
     * تحميل خط عربي للرياضيات
     * @param {string} fontName - اسم الخط
     * @param {string} fontUrl - رابط الخط
     * @returns {Promise} وعد بتحميل الخط
     */
    async loadFont(fontName, fontUrl) {
        if (this.loadedFonts.has(fontName)) {
            return Promise.resolve();
        }
        
        if (this.fontPromises.has(fontName)) {
            return this.fontPromises.get(fontName);
        }
        
        const promise = this._loadFontFile(fontName, fontUrl);
        this.fontPromises.set(fontName, promise);
        
        try {
            await promise;
            this.loadedFonts.add(fontName);
            console.log(`✅ تم تحميل الخط: ${fontName}`);
        } catch (error) {
            console.error(`❌ فشل تحميل الخط ${fontName}:`, error);
            this.fontPromises.delete(fontName);
            throw error;
        }
        
        return promise;
    }
    
    async _loadFontFile(fontName, fontUrl) {
        // استخدام Font Loading API إذا متوفر
        if ('FontFace' in window) {
            const font = new FontFace(fontName, `url(${fontUrl})`);
            await font.load();
            document.fonts.add(font);
            return;
        }
        
        // طريقة بديلة باستخدام CSS
        return this._loadFontWithCSS(fontName, fontUrl);
    }
    
    _loadFontWithCSS(fontName, fontUrl) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = fontUrl;
            
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`فشل في تحميل ${fontUrl}`));
            
            document.head.appendChild(link);
            
            // timeout للحماية من التعليق
            setTimeout(() => {
                reject(new Error(`انتهت مهلة تحميل الخط ${fontName}`));
            }, 10000);
        });
    }
    
    /**
     * تحميل الخطوط الافتراضية للمكتبة
     */
    async loadDefaultFonts() {
        const defaultFonts = [
            {
                name: 'Amiri',
                url: 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap'
            },
            {
                name: 'Cairo',
                url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;700;900&display=swap'
            },
            {
                name: 'Scheherazade New',
                url: 'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap'
            }
        ];
        
        const loadPromises = defaultFonts.map(font => 
            this.loadFont(font.name, font.url).catch(error => {
                console.warn(`تحذير: لم يتم تحميل الخط ${font.name}`, error);
            })
        );
        
        await Promise.allSettled(loadPromises);
    }
    
    /**
     * التحقق من توفر خط معين
     * @param {string} fontName - اسم الخط
     * @returns {boolean} هل الخط متوفر
     */
    isFontAvailable(fontName) {
        return this.loadedFonts.has(fontName) || this._checkSystemFont(fontName);
    }
    
    _checkSystemFont(fontName) {
        const testString = 'mmmmmmmmmllli';
        const testSize = '72px';
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        context.font = `${testSize} monospace`;
        const baselineWidth = context.measureText(testString).width;
        
        context.font = `${testSize} ${fontName}, monospace`;
        const testWidth = context.measureText(testString).width;
        
        return testWidth !== baselineWidth;
    }
}

// تصدير مثيل عام
window.ArabicMathFontLoader = new FontLoader();
```

## 🧩 **10. أمثلة متقدمة - examples/**

### **examples/interactive-demo.html:**
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>العرض التفاعلي - مكتبة الرياضيات العربية</title>
    <link rel="stylesheet" href="../dist/arabic-math.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Amiri', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            color: #2c3e50;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .demo-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border: 1px solid rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        
        .demo-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        
        .demo-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        
        .input-group {
            margin-bottom: 20px;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #34495e;
        }
        
        .equation-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            font-family: 'Courier New', monospace;
            direction: ltr;
            text-align: left;
            transition: border-color 0.3s ease;
        }
        
        .equation-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .output-box {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            min-height: 80px;
            margin: 15px 0;
        }
        
        .controls {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5a67d8;
            transform: translateY(-1px);
        }
        
        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }
        
        .btn-secondary:hover {
            background: #cbd5e0;
        }
        
        .example-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .example-item {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            direction: ltr;
            text-align: left;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        
        .example-item:hover {
            background: #edf2f7;
            border-color: #cbd5e0;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            display: block;
        }
        
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        @media (max-width: 768px) {
            .demo-grid {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔢 العرض التفاعلي</h1>
            <p>اختبر مكتبة الرياضيات العربية مباشرة في متصفحك</p>
        </div>
        
        <div class="demo-grid">
            <!-- مترجم فوري -->
            <div class="demo-card">
                <h3>🚀 المترجم الفوري</h3>
                <div class="input-group">
                    <label for="live-input">اكتب معادلة بالإنجليزية:</label>
                    <textarea id="live-input" class="equation-input" rows="3" 
                        placeholder="مثال: sin(x) + cos(y) = 1"></textarea>
                </div>
                <div class="output-box arabic-math" id="live-output">
                    اكتب معادلة أعلاه لتراها مترجمة هنا...
                </div>
                <div class="controls">
                    <button class="btn btn-primary" onclick="translateLive()">ترجم الآن</button>
                    <button class="btn btn-secondary" onclick="clearLive()">مسح</button>
                </div>
            </div>
            
            <!-- مكتبة الأمثلة -->
            <div class="demo-card">
                <h3>📚 مكتبة الأمثلة</h3>
                <p>اختر مثالاً لترجمته:</p>
                <div class="example-list" id="example-list">
                    <!-- ستملأ بواسطة JavaScript -->
                </div>
            </div>
            
            <!-- مقارن جنباً إلى جنب -->
            <div class="demo-card">
                <h3>⚖️ المقارن</h3>
                <div class="input-group">
                    <label for="compare-input">معادلة للمقارنة:</label>
                    <input type="text" id="compare-input" class="equation-input" 
                        placeholder="\lim_{x \to 0} \frac{\sin x}{x}">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <strong>الأصل:</strong>
                        <div class="output-box" id="original-output" style="direction: ltr; text-align: left;"></div>
                    </div>
                    <div>
                        <strong>المترجم:</strong>
                        <div class="output-box arabic-math" id="translated-output"></div>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="compareEquations()">قارن</button>
            </div>
            
            <!-- أدوات التحليل -->
            <div class="demo-card">
                <h3>🔍 محلل المعادلات</h3>
                <div class="input-group">
                    <label for="analyze-input">معادلة للتحليل:</label>
                    <input type="text" id="analyze-input" class="equation-input" 
                        placeholder="f(x) = sin(x) + cos(y)">
                </div>
                <div class="output-box" id="analysis-output">
                    نتائج التحليل ستظهر هنا...
                </div>
                <button class="btn btn-primary" onclick="analyzeEquation()">حلل</button>
            </div>
        </div>
        
        <!-- إحصائيات الاستخدام -->
        <div class="stats" id="usage-stats">
            <div class="stat-card">
                <span class="stat-number" id="translations-count">0</span>
                <span class="stat-label">ترجمة</span>
            </div>
            <div class="stat-card">
                <span class="stat-number" id="functions-count">0</span>
                <span class="stat-label">دالة مترجمة</span>
            </div>
            <div class="stat-card">
                <span class="stat-number" id="variables-count">0</span>
                <span class="stat-label">متغير</span>
            </div>
            <div class="stat-card">
                <span class="stat-number" id="performance-time">0</span>
                <span class="stat-label">مللي ثانية</span>
            </div>
        </div>
    </div>
    
    <!-- تحميل المكتبات -->
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <script src="../dist/arabic-math.js"></script>
    
    <script>
        // تهيئة المكتبة
        let arabicMath;
        let stats = {
            translations: 0,
            functions: 0,
            variables: 0,
            totalTime: 0
        };
        
        document.addEventListener('DOMContentLoaded', async function() {
            // انتظار تحميل MathJax
            while (typeof MathJax === 'undefined') {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            arabicMath = new ArabicMath({
                rtl: true,
                mathRenderer: 'mathjax',
                autoTranslate: true
            });
            
            setupEventListeners();
            loadExamples();
            updateStats();
        });
        
        function setupEventListeners() {
            // ترجمة فورية أثناء الكتابة
            const liveInput = document.getElementById('live-input');
            let timeoutId;
            
            liveInput.addEventListener('input', function() {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (this.value.trim()) {
                        translateLive();
                    }
                }, 500);
            });
            
            // مقارن فوري
            const compareInput = document.getElementById('compare-input');
            compareInput.addEventListener('input', function() {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (this.value.trim()) {
                        compareEquations();
                    }
                }, 500);
            });
        }
        
        function loadExamples() {
            const examples = [
                { name: 'دالة مثلثية', eq: 'sin(x) + cos(y) = 1' },
                { name: 'نهاية', eq: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },
                { name: 'تكامل', eq: '\\int_0^1 x^2 dx = \\frac{1}{3}' },
                { name: 'مشتقة', eq: '\\frac{d}{dx}[x^2] = 2x' },
                { name: 'مجموع', eq: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}' },
                { name: 'لوغاريتم', eq: 'ln(e^x) = x' },
                { name: 'معادلة معقدة', eq: 'e^{i\\pi} + 1 = 0' },
                { name: 'مصفوفة', eq: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' }
            ];
            
            const exampleList = document.getElementById('example-list');
            examples.forEach(example => {
                const item = document.createElement('div');
                item.className = 'example-item';
                item.innerHTML = `<strong>${example.name}:</strong> ${example.eq}`;
                item.onclick = () => loadExample(example.eq);
                exampleList.appendChild(item);
            });
        }
        
        function loadExample(equation) {
            document.getElementById('live-input').value = equation;
            translateLive();
        }
        
        async function translateLive() {
            const input = document.getElementById('live-input').value;
            const output = document.getElementById('live-output');
            
            if (!input.trim()) {
                output.innerHTML = 'اكتب معادلة أعلاه لتراها مترجمة هنا...';
                return;
            }
            
            const startTime = performance.now();
            
            try {
                output.innerHTML = '<div class="loading">جاري الترجمة...</div>';
                await arabicMath.render(output, input);
                
                const endTime = performance.now();
                updateStatsAfterTranslation(input, endTime - startTime);
                
            } catch (error) {
                output.innerHTML = `<div class="math-error">خطأ: ${error.message}</div>`;
            }
        }
        
        function clearLive() {
            document.getElementById('live-input').value = '';
            document.getElementById('live-output').innerHTML = 'اكتب معادلة أعلاه لتراها مترجمة هنا...';
        }
        
        async function compareEquations() {
            const input = document.getElementById('compare-input').value;
            const originalOutput = document.getElementById('original-output');
            const translatedOutput = document.getElementById('translated-output');
            
            if (!input.trim()) return;
            
            // عرض الأصل
            originalOutput.innerHTML = `\\(${input}\\)`;
            if (typeof MathJax !== 'undefined') {
                MathJax.typesetPromise([originalOutput]);
            }
            
            // عرض الترجمة
            await arabicMath.render(translatedOutput, input);
        }
        
        function analyzeEquation() {
            const input = document.getElementById('analyze-input').value;
            const output = document.getElementById('analysis-output');
            
            if (!input.trim()) {
                output.innerHTML = 'أدخل معادلة للتحليل';
                return;
            }
            
            try {
                // تحليل المعادلة باستخدام أدوات المكتبة
                const variables = MathUtils.extractVariables(input);
                const type = MathUtils.detectExpressionType(input);
                const language = MathUtils.detectLanguage(input);
                const balance = MathUtils.checkBracketBalance(input);
                
                output.innerHTML = `
                    <div style="direction: rtl; text-align: right;">
                        <p><strong>نوع العبارة:</strong> ${translateType(type)}</p>
                        <p><strong>اللغة:</strong> ${translateLanguage(language)}</p>
                        <p><strong>المتغيرات:</strong> ${variables.join(', ') || 'لا توجد'}</p>
                        <p><strong>توازن الأقواس:</strong> ${balance.balanced ? '✅ متوازن' : '❌ غير متوازن'}</p>
                        ${!balance.balanced ? `<p><strong>الأخطاء:</strong> ${balance.errors.length} خطأ</p>` : ''}
                    </div>
                `;
            } catch (error) {
                output.innerHTML = `<div class="math-error">خطأ في التحليل: ${error.message}</div>`;
            }
        }
        
        function translateType(type) {
            const types = {
                'limit': 'نهاية',
                'integral': 'تكامل',
                'derivative': 'مشتقة',
                'summation': 'مجموع',
                'product': 'جداء',
                'matrix': 'مصفوفة',
                'equation': 'معادلة',
                'inequality': 'متباينة',
                'function': 'دالة',
                'expression': 'عبارة رياضية'
            };
            return types[type] || type;
        }
        
        function translateLanguage(lang) {
            const languages = {
                'arabic': 'عربي',
                'english': 'إنجليزي',
                'mixed': 'مختلط'
            };
            return languages[lang] || lang;
        }
        
        function updateStatsAfterTranslation(equation, time) {
            stats.translations++;
            stats.totalTime += time;
            
            // عد الدوال والمتغيرات
            const functions = (equation.match(/\b(sin|cos|tan|log|ln|lim|int|sum)\b/g) || []).length;
            const variables = MathUtils.extractVariables(equation).length;
            
            stats.functions += functions;
            stats.variables += variables;
            
            updateStats();
        }
        
        function updateStats() {
            document.getElementById('translations-count').textContent = stats.translations;
            document.getElementById('functions-count').textContent = stats.functions;
            document.getElementById('variables-count').textContent = stats.variables;
            document.getElementById('performance-time').textContent = 
                Math.round(stats.totalTime / Math.max(stats.translations, 1));
        }
        
        // إضافة تأثيرات بصرية
        function addVisualEffects() {
            // تأثير الكتابة
            const equations = document.querySelectorAll('.arabic-math');
            equations.forEach(eq => {
                eq.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                eq.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });
        }
        
        // تهيئة التأثيرات عند تحميل الصفحة
        setTimeout(addVisualEffects, 1000);
    </script>
</body>
</html>
```

### **examples/integration-examples.js:**
```javascript
/**
 * أمثلة تكامل المكتبة مع إطارات العمل المختلفة
 */

// ================ React Example ================
const ReactExample = `
import React, { useEffect, useRef, useState } from 'react';
import ArabicMath from 'arabic-math-js';

function MathComponent({ equation, options = {} }) {
    const mathRef = useRef(null);
    const [arabicMath] = useState(() => new ArabicMath(options));
    
    useEffect(() => {
        if (mathRef.current && equation) {
            arabicMath.render(mathRef.current, equation);
        }
    }, [equation, arabicMath]);
    
    return (
        <div 
            ref={mathRef} 
            className="arabic-math"
            aria-label={\`معادلة رياضية: \${equation}\`}
        />
    );
}

// الاستخدام
function App() {
    const [equation, setEquation] = useState('sin(x) + cos(y) = 1');
    
    return (
        <div>
            <input 
                value={equation} 
                onChange={(e) => setEquation(e.target.value)}
                placeholder="اكتب معادلة..."
            />
            <MathComponent equation={equation} />
        </div>
    );
}

export default App;
`;

// ================ Vue Example ================
const VueExample = `
<template>
  <div>
    <input 
      v-model="equation" 
      placeholder="اكتب معادلة..."
      @input="debouncedRender"
    />
    <div 
      ref="mathContainer" 
      class="arabic-math"
      :aria-label="\`معادلة رياضية: \${equation}\`"
    ></div>
  </div>
</template>

<script>
import ArabicMath from 'arabic-math-js';
import { debounce } from 'lodash';

export default {
  name: 'MathComponent',
  
  props: {
    initialEquation: {
      type: String,
      default: 'sin(x) + cos(y) = 1'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  
  data() {
    return {
      equation: this.initialEquation,
      arabicMath: null
    };
  },
  
  mounted() {
    this.arabicMath = new ArabicMath(this.options);
    this.renderEquation();
  },
  
  methods: {
    renderEquation() {
      if (this.$refs.mathContainer && this.equation) {
        this.arabicMath.render(this.$refs.mathContainer, this.equation);
      }
    },
    
    debouncedRender: debounce(function() {
      this.renderEquation();
    }, 300)
  },
  
  watch: {
    equation() {
      this.renderEquation();
    }
  }
};
</script>
`;

// ================ Angular Example ================
const AngularExample = `
// math.component.ts
import { Component, ElementRef, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import ArabicMath from 'arabic-math-js';

@Component({
  selector: 'app-math',
  template: \`
    <div #mathContainer 
         class="arabic-math"
         [attr.aria-label]="'معادلة رياضية: ' + equation">
    </div>
  \`
})
export class MathComponent implements OnChanges, AfterViewInit {
  @Input() equation: string = '';
  @Input() options: any = {};
  @ViewChild('mathContainer', { static: true }) mathContainer!: ElementRef;
  
  private arabicMath: any;
  
  ngAfterViewInit() {
    this.arabicMath = new ArabicMath(this.options);
    this.renderEquation();
  }
  
  ngOnChanges() {
    if (this.arabicMath) {
      this.renderEquation();
    }
  }
  
  private renderEquation() {
    if (this.mathContainer && this.equation) {
      this.arabicMath.render(this.mathContainer.nativeElement, this.equation);
    }
  }
}

// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MathComponent } from './math.component';

@NgModule({
  declarations: [MathComponent],
  imports: [BrowserModule, FormsModule],
  exports: [MathComponent]
})
export class MathModule { }
`;

// ================ Svelte Example ================
const SvelteExample = `
<script>
  import { onMount, afterUpdate } from 'svelte';
  import ArabicMath from 'arabic-math-js';
  
  export let equation = 'sin(x) + cos(y) = 1';
  export let options = {};
  
  let mathContainer;
  let arabicMath;
  
  onMount(() => {
    arabicMath = new ArabicMath(options);
    renderEquation();
  });
  
  afterUpdate(() => {
    renderEquation();
  });
  
  function renderEquation() {
    if (mathContainer && equation && arabicMath) {
      arabicMath.render(mathContainer, equation);
    }
  }
</script>

<div 
  bind:this={mathContainer} 
  class="arabic-math"
  aria-label="معادلة رياضية: {equation}"
></div>
`;

// ================ Node.js Server Example ================
const NodeJSExample = `
const express = require('express');
const { JSDOM } = require('jsdom');

// إعداد بيئة DOM للخادم
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = window.document;

// تحميل المكتبة
const ArabicMath = require('arabic-math-js');

const app = express();
app.use(express.json());

// نقطة نهاية لترجمة المعادلات
app.post('/translate', async (req, res) => {
  try {
    const { equation, options = {} } = req.body;
    
    const arabicMath = new ArabicMath(options);
    const translated = arabicMath.translate(equation);
    
    res.json({
      success: true,
      original: equation,
      translated: translated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// نقطة نهاية لتوليد HTML مترجم
app.post('/render-html', async (req, res) => {
  try {
    const { equations, options = {} } = req.body;
    
    const arabicMath = new ArabicMath(options);
    const results = [];
    
    for (const equation of equations) {
      const container = document.createElement('div');
      await arabicMath.render(container, equation);
      
      results.push({
        original: equation,
        html: container.innerHTML
      });
    }
    
    res.json({
      success: true,
      results: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('خادم ترجمة المعادلات يعمل على المنفذ 3000');
});
`;

// ================ Electron Example ================
const ElectronExample = `
// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// renderer.js (في نافذة Electron)
const ArabicMath = require('arabic-math-js');

document.addEventListener('DOMContentLoaded', function() {
  const arabicMath = new ArabicMath({
    rtl: true,
    mathRenderer: 'mathjax'
  });
  
  // تطبيق سطح المكتب للترجمة
  const equationInput = document.getElementById('equation');
  const outputDiv = document.getElementById('output');
  const translateBtn = document.getElementById('translate');
  
  translateBtn.addEventListener('click', async () => {
    const equation = equationInput.value;
    if (equation.trim()) {
      await arabicMath.render(outputDiv, equation);
    }
  });
});
`;

// ================ WordPress Plugin Example ================
const WordPressExample = `
<?php
/**
 * Plugin Name: Arabic Math Equations
 * Description: ترجمة وعرض المعادلات الرياضية بالعربية
 */

// منع الوصول المباشر
if (!defined('ABSPATH')) {
    exit;
}

class ArabicMathPlugin {
    
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('arabic_math', array($this, 'math_shortcode'));
        add_action('wp_footer', array($this, 'init_script'));
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script(
            'mathjax',
            'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
            array(),
            '3.0.0',
            true
        );
        
        wp_enqueue_script(
            'arabic-math',
            plugin_dir_url(__FILE__) . 'js/arabic-math.min.js',
            array('mathjax'),
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'arabic-math-style',
            plugin_dir_url(__FILE__) . 'css/arabic-math.min.css',
            array(),
            '1.0.0'
        );
    }
    
    public function math_shortcode($atts, $content = '') {
        $atts = shortcode_atts(array(
            'rtl' => 'true',
            'display' => 'inline'
        ), $atts);
        
        $class = 'arabic-math-equation';
        if ($atts['display'] === 'block') {
            $class .= ' math-display';
        }
        
        return sprintf(
            '<div class="%s" data-equation="%s">%s</div>',
            esc_attr($class),
            esc_attr($content),
            esc_html($content)
        );
    }
    
    public function init_script() {
        ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof ArabicMath !== 'undefined') {
                const arabicMath = new ArabicMath({
                    rtl: true,
                    mathRenderer: 'mathjax'
                });
                
                // ترجمة جميع المعادلات
                const equations = document.querySelectorAll('.arabic-math-equation');
                equations.forEach(eq => {
                    const equation = eq.getAttribute('data-equation');
                    if (equation) {
                        arabicMath.render(eq, equation);
                    }
                });
            }
        });
        </script>
        <?php
    }
}

new ArabicMathPlugin();
`;

// تصدير الأمثلة
window.IntegrationExamples = {
    React: ReactExample,
    Vue: VueExample,
    Angular: AngularExample,
    Svelte: SvelteExample,
    NodeJS: NodeJSExample,
    Electron: ElectronExample,
    WordPress: WordPressExample
};
```

## 📘 **11. TypeScript Definitions - index.d.ts:**

```typescript
/**
 * Type definitions for Arabic Math JS
 * مكتبة الرياضيات العربية - تعريفات TypeScript
 */

declare module 'arabic-math-js' {
    
    export interface ArabicMathOptions {
        /** تفعيل الكتابة من اليمين إلى اليسار */
        rtl?: boolean;
        
        /** ترجمة الأرقام إلى العربية */
        translateNumbers?: boolean;
        
        /** خط المعادلات */
        font?: string;
        
        /** محرك العرض */
        mathRenderer?: 'mathjax' | 'katex';
        
        /** الترجمة التلقائية */
        autoTranslate?: boolean;
        
        /** قاموس مخصص للترجمة */
        customDictionary?: Record<string, string>;
        
        /** أنماط CSS إضافية */
        cssClass?: string;
        
        /** خيارات RTL متقدمة */
        rtlOptions?: RTLOptions;
    }
    
    export interface RTLOptions {
        /** قلب الأسهم */
        flipArrows?: boolean;
        
        /** تبديل حدود التكامل والمجاميع */
        swapBounds?: boolean;
        
        /** معالجة المصفوفات */
        handleMatrices?: boolean;
        
        /** معالجة الكسور */
        handleFractions?: boolean;
    }
    
    export interface TranslationOptions {
        /** قاموس مخصص إضافي */
        customDictionary?: Record<string, string>;
        
        /** أنماط تجاهل الترجمة */
        ignorePatterns?: RegExp[];
        
        /** خيارات RTL */
        rtlOptions?: RTLOptions;
        
        /** ترجمة الأرقام */
        translateNumbers?: boolean;
    }
    
    export interface RenderOptions {
        /** نمط العرض */
        displayMode?: 'auto' | 'block' | 'inline';
        
        /** حجم الخط */
        fontSize?: string;
        
        /** لون النص */
        color?: string;
        
        /** تحريك العرض */
        animated?: boolean;
        
        /** معالج الأخطاء */
        errorHandler?: (error: Error) => void;
        
        /** الترجمة التلقائية */
        autoTranslate?: boolean;
    }
    
    export interface ValidationResult {
        /** هل المعادلة صحيحة */
        valid: boolean;
        
        /** قائمة الأخطاء */
        errors: string[];
        
        /** قائمة التحذيرات */
        warnings: string[];
    }
    
    export interface ParsedEquation {
        /** نوع العبارة */
        type: 'expression';
        
        /** الرموز المحللة */
        tokens: Token[];
        
        /** بنية المعادلة */
        structure: EquationStructure;
    }
    
    export interface Token {
        /** نوع الرمز */
        type: 'function' | 'variable' | 'number' | 'operator' | 'symbol' | 'bracket' | 'latex_command';
        
        /** قيمة الرمز */
        value: string;
        
        /** موقع الرمز */
        position: number;
    }
    
    export interface EquationStructure {
        /** الدوال المستخدمة */
        functions: Token[];
        
        /** المتغيرات */
        variables: Token[];
        
        /** العمليات */
        operators: Token[];
        
        /** أوامر LaTeX */
        commands: Token[];
    }
    
    export interface ContextInfo {
        /** النص قبل الموقع */
        before: string;
        
        /** النص في الموقع */
        at: string;
        
        /** النص بعد الموقع */
        after: string;
        
        /** النص الكامل للسياق */
        full: string;
        
        /** الموقع المطلق */
        position: number;
        
        /** الموقع النسبي */
        relativePosition: number;
    }
    
    export interface BracketBalance {
        /** هل الأقواس متوازنة */
        balanced: boolean;
        
        /** قائمة أخطاء الأقواس */
        errors: BracketError[];
    }
    
    export interface BracketError {
        /** نوع الخطأ */
        type: 'mismatch' | 'unclosed';
        
        /** موقع الخطأ */
        position?: number;
        
        /** القوس المتوقع */
        expected?: string;
        
        /** القوس الموجود */
        found?: string;
        
        /** القوس غير المغلق */
        bracket?: string;
    }
    
    export interface EventCallback<T = any> {
        (data: T): void;
    }
    
    /**
     * الفئة الرئيسية لمكتبة الرياضيات العربية
     */
    export class ArabicMath {
        /**
         * إنشاء مثيل جديد من المكتبة
         */
        constructor(options?: ArabicMathOptions);
        
        /**
         * ترجمة معادلة من الإنجليزية إلى العربية
         */
        translate(equation: string, options?: TranslationOptions): string;
        
        /**
         * عرض معادلة في عنصر HTML
         */
        render(
            target: string | HTMLElement, 
            equation: string, 
            options?: RenderOptions
        ): Promise<void>;
        
        /**
         * ترجمة تلقائية لجميع العناصر المطابقة
         */
        autoTranslate(selector?: string): void;
        
        /**
         * ربط معالج حدث
         */
        on<T>(event: string, callback: EventCallback<T>): void;
        
        /**
         * إزالة معالج حدث
         */
        off<T>(event: string, callback?: EventCallback<T>): void;
        
        /**
         * التحقق من كون النص معادلة عربية
         */
        static isArabicEquation(text: string): boolean;
        
        /**
         * اكتشاف لغة المعادلة
         */
        static detectLanguage(equation: string): 'arabic' | 'english' | 'mixed';
        
        /**
         * التحقق من صحة المعادلة
         */
        static validateEquation(equation: string): ValidationResult;
    }
    
    /**
     * محرك الترجمة
     */
    export class MathTranslator {
        constructor(options?: ArabicMathOptions);
        
        translate(parsedEquation: string, options?: TranslationOptions): string;
        translateCompounds(equation: string): string;
        translateFunctions(equation: string): string;
        translateSymbols(equation: string): string;
        translateOperations(equation: string): string;
        translateNumbers(equation: string): string;
    }
    
    /**
     * محلل المعادلات
     */
    export class MathParser {
        constructor();
        
        parse(input: string): ParsedEquation;
        tokenize(input: string): Token[];
        preprocess(input: string): string;
        buildAST(tokens: Token[]): ParsedEquation;
        analyzeStructure(tokens: Token[]): EquationStructure;
    }
    
    /**
     * محرك العرض
     */
    export class MathRenderer {
        constructor(options?: ArabicMathOptions);
        
        render(
            element: HTMLElement, 
            equation: string, 
            options?: RenderOptions
        ): Promise<void>;
        
        renderWithMathJax(
            element: HTMLElement, 
            equation: string, 
            options: RenderOptions
        ): Promise<void>;
        
        renderWithKaTeX(
            element: HTMLElement, 
            equation: string, 
            options: RenderOptions
        ): Promise<void>;
    }
    
    /**
     * معالج RTL
     */
    export class RTLHandler {
        constructor();
        
        processRTL(equation: string, options?: RTLOptions): string;
        flipArrows(equation: string): string;
        swapIntegralBounds(equation: string): string;
        swapSumBounds(equation: string): string;
        processFractions(equation: string): string;
        processMatrices(equation: string): string;
        postProcessElement(element: HTMLElement): void;
    }
    
    /**
     * أدوات رياضية مساعدة
     */
    export class MathUtils {
        static detectExpressionType(expression: string): string;
        static extractVariables(equation: string): string[];
        static checkBracketBalance(expression: string): BracketBalance;
        static convertNumbersToArabic(text: string): string;
        static convertNumbersToEnglish(text: string): string;
        static cleanEquation(equation: string): string;
        static detectLanguage(equation: string): 'arabic' | 'english' | 'mixed';
        static analyzeLaTeXStructure(latex: string): any;
    }
    
    /**
     * أدوات النصوص المساعدة
     */
    export class StringUtils {
        static reverseText(text: string): string;
        static addDirectionalMarks(text: string): string;
        static sanitizeText(text: string): string;
        static splitKeepSeparator(text: string, separator: RegExp): string[];
        static smartReplace(
            text: string, 
            searchValue: RegExp | string, 
            replaceValue: string | (((...args: any[]) => string))
        ): string;
        static getContext(text: string, position: number, radius?: number): ContextInfo;
        static removeDuplicates(text: string, separator?: string): string;
        static toSlug(text: string): string;
    }
    
    /**
     * محمل الخطوط
     */
    export class FontLoader {
        constructor();
        
        loadFont(fontName: string, fontUrl: string): Promise<void>;
        loadDefaultFonts(): Promise<void>;
        isFontAvailable(fontName: string): boolean;
    }
    
    // القواميس والبيانات
    export const MathSymbols: Record<string, string>;
    export const MathFunctions: Record<string, string>;
    export const MathOperations: Record<string, string>;
    export const CompoundPatterns: any[];
    
    export default ArabicMath;
}
```

هل تريد مني المتابعة مع ملفات أخرى مثل أدوات التطوير، ملفات النشر، أو اختبارات الأداء؟