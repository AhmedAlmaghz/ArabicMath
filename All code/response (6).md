

<think>

المستخدم يريد المتابعة، سأكمل باقي الملفات المهمة للمشروع. سأقدم:

1. ملفات المجتمع والمساهمة (CONTRIBUTING.md, CODE_OF_CONDUCT.md)
2. ملفات الموارد والأصول (assets, icons, etc.)
3. ملفات التكوين الإضافية (.eslintrc, .prettierrc, etc.)
4. ملفات الصيانة والإدارة
5. ملفات التحليلات والإحصائيات
6. ملفات الاختبارات المتقدمة
7. ملفات البيانات والقواميس الإضافية
8. ملفات النهاية والخلاصة

سأبدأ بملفات المجتمع والمساهمة ثم أكمل.

</think>

ممتاز! سأكمل باقي الملفات الأساسية لجعل المشروع مجتمعياً ومتكاملاً:

## 👥 **17. ملفات المجتمع والمساهمة**

### **CONTRIBUTING.md:**
```markdown
# 🤝 دليل المساهمة في مكتبة الرياضيات العربية

مرحباً بك في مجتمع مكتبة الرياضيات العربية! نحن نقدر مساهماتك ونريد أن نجعل عملية المساهمة سهلة ومرحبة للجميع.

## 🌟 أنواع المساهمات المرحب بها

### 🐛 الإبلاغ عن الأخطاء
- أخطاء في الترجمة
- مشاكل في العرض
- أخطاء في التوافق مع المتصفحات
- مشاكل في الأداء

### ✨ اقتراح مميزات جديدة
- دوال رياضية جديدة للترجمة
- تحسينات في واجهة برمجة التطبيقات
- دعم محركات عرض جديدة
- تحسينات في دعم RTL

### 📝 تحسين التوثيق
- إضافة أمثلة جديدة
- تصحيح الأخطاء اللغوية
- ترجمة التوثيق
- تحسين شرح المفاهيم

### 🔧 تحسين الكود
- تحسين الأداء
- إضافة اختبارات
- تبسيط الكود
- تحسين إمكانية الوصول

## 🚀 البدء السريع

### 1. تحضير البيئة

```bash
# استنساخ المستودع
git clone https://github.com/username/arabic-math-js.git
cd arabic-math-js

# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# تشغيل الاختبارات
npm test
```

### 2. فهم بنية المشروع

```
src/
├── core/           # الملفات الأساسية
├── dictionaries/   # قواميس الترجمة
├── utils/          # الأدوات المساعدة
└── styles/         # الأنماط والتصاميم

examples/           # أمثلة الاستخدام
tests/             # الاختبارات
docs/              # التوثيق
tools/             # أدوات البناء والتطوير
```

## 📋 عملية المساهمة

### 1. اختيار مهمة

ابحث في [قائمة المشاكل](https://github.com/username/arabic-math-js/issues) عن:
- 🏷️ `good first issue` - للمبتدئين
- 🏷️ `help wanted` - نحتاج مساعدة
- 🏷️ `bug` - أخطاء تحتاج إصلاح
- 🏷️ `enhancement` - مميزات جديدة

### 2. إنشاء فرع جديد

```bash
# فرع لإصلاح خطأ
git checkout -b fix/issue-description

# فرع لمميزة جديدة
git checkout -b feature/feature-name

# فرع للتوثيق
git checkout -b docs/improvement-description
```

### 3. إجراء التغييرات

#### للكود:
- اتبع [دليل الأسلوب](#-دليل-الأسلوب)
- أضف اختبارات للمميزات الجديدة
- تأكد من مرور جميع الاختبارات
- تحديث التوثيق إذا لزم الأمر

#### للتوثيق:
- استخدم لغة واضحة ومبسطة
- أضف أمثلة عملية
- تأكد من صحة الروابط

### 4. اختبار التغييرات

```bash
# تشغيل جميع الاختبارات
npm test

# اختبار الأداء
npm run test:performance

# فحص جودة الكود
npm run lint

# فحص أمني
npm run security:audit
```

### 5. إرسال Pull Request

1. **دفع التغييرات**:
```bash
git add .
git commit -m "نوع: وصف مختصر للتغيير"
git push origin branch-name
```

2. **إنشاء Pull Request**:
   - اختر عنوان وصفي
   - اشرح التغييرات بالتفصيل
   - اربط بالـ issue ذات الصلة
   - أضف لقطات شاشة إذا لزم

## 📝 دليل الأسلوب

### JavaScript

```javascript
// ✅ جيد
class MathTranslator {
    /**
     * ترجمة معادلة رياضية
     * @param {string} equation - المعادلة الأصلية
     * @returns {string} المعادلة المترجمة
     */
    translate(equation) {
        if (!equation || typeof equation !== 'string') {
            throw new Error('المعادلة يجب أن تكون نص صحيح');
        }
        
        return this.processEquation(equation);
    }
    
    processEquation(equation) {
        // معالجة المعادلة
        return equation;
    }
}

// ❌ تجنب
function translate(eq) {
    return eq.replace(/sin/g, 'جا'); // بدون تحقق أو توثيق
}
```

### CSS

```css
/* ✅ جيد - استخدم أسماء واضحة ومنطقية */
.arabic-math {
    direction: rtl;
    font-family: 'Amiri', serif;
    text-align: right;
}

.math-equation {
    display: inline-block;
    margin: 0.5em 0;
}

.math-function {
    color: #e74c3c;
    font-weight: 600;
}

/* ❌ تجنب - أسماء غير واضحة */
.am { direction: rtl; }
.eq { display: block; }
```

### التوثيق

```markdown
<!-- ✅ جيد -->
## translate(equation, options)

ترجم معادلة رياضية من الإنجليزية إلى العربية.

### المعاملات

- `equation` (string): المعادلة الرياضية بالإنجليزية
- `options` (object, اختياري): خيارات الترجمة

### القيمة المرجعة

- `string`: المعادلة مترجمة إلى العربية

### مثال

```javascript
const arabicMath = new ArabicMath();
const result = arabicMath.translate('sin(x) + cos(y)');
console.log(result); // 'جا(س) + جتا(ص)'
```

<!-- ❌ تجنب -->
## translate
ترجم معادلة
```

## 🧪 دليل كتابة الاختبارات

### اختبارات الوحدة

```javascript
describe('MathTranslator', () => {
    let translator;
    
    beforeEach(() => {
        translator = new MathTranslator();
    });
    
    describe('translate()', () => {
        it('يجب أن يترجم الدوال المثلثية', () => {
            const result = translator.translate('sin(x) + cos(y)');
            expect(result).toBe('جا(س) + جتا(ص)');
        });
        
        it('يجب أن يرمي خطأ للمدخلات غير الصحيحة', () => {
            expect(() => translator.translate(null)).toThrow();
            expect(() => translator.translate('')).toThrow();
        });
        
        it('يجب أن يتعامل مع المعادلات المعقدة', () => {
            const complex = '\\lim_{x \\to 0} \\frac{\\sin x}{x}';
            const result = translator.translate(complex);
            expect(result).toContain('نها');
            expect(result).toContain('جا');
        });
    });
});
```

### اختبارات التكامل

```javascript
describe('ArabicMath Integration', () => {
    let arabicMath;
    let container;
    
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        arabicMath = new ArabicMath();
    });
    
    afterEach(() => {
        document.body.removeChild(container);
    });
    
    it('يجب أن يعرض المعادلة بشكل صحيح', async () => {
        await arabicMath.render(container, 'sin(x) + cos(y)');
        
        expect(container.innerHTML).toContain('جا');
        expect(container.innerHTML).toContain('جتا');
        expect(container.dir).toBe('rtl');
    });
});
```

## 🏷️ نظام التصنيف

استخدم هذه التصنيفات في رسائل الـ commit:

- `feat:` - مميزة جديدة
- `fix:` - إصلاح خطأ
- `docs:` - تغييرات في التوثيق
- `style:` - تغييرات في التنسيق (لا تؤثر على الكود)
- `refactor:` - إعادة هيكلة الكود
- `test:` - إضافة أو تعديل اختبارات
- `chore:` - مهام صيانة

### أمثلة:

```bash
git commit -m "feat: إضافة دعم للدوال الهندسية"
git commit -m "fix: إصلاح مشكلة في ترجمة النهايات"
git commit -m "docs: تحديث دليل الاستخدام"
git commit -m "test: إضافة اختبارات للمصفوفات"
```

## 🔍 عملية المراجعة

### ما نبحث عنه:

✅ **الجودة**:
- الكود واضح ومفهوم
- اتباع الأسلوب المتفق عليه
- توثيق مناسب

✅ **الوظائف**:
- التغيير يحل المشكلة المطلوبة
- لا يكسر وظائف موجودة
- يتضمن اختبارات مناسبة

✅ **الأداء**:
- لا يبطئ المكتبة
- استخدام فعال للذاكرة
- متوافق مع المتصفحات المستهدفة

### عملية المراجعة:

1. **مراجعة تلقائية**: CI/CD يتحقق من الاختبارات والجودة
2. **مراجعة بشرية**: مراجع يفحص الكود والوظائف
3. **اختبار إضافي**: فحص يدوي إذا لزم الأمر
4. **الموافقة والدمج**: دمج التغييرات في الفرع الرئيسي

## 🎯 مناطق تحتاج مساعدة

### عالية الأولوية
- [ ] تحسين أداء الترجمة للمعادلات الطويلة
- [ ] دعم أفضل للمصفوفات في RTL
- [ ] إضافة المزيد من الدوال الرياضية
- [ ] تحسين دعم إمكانية الوصول

### متوسطة الأولوية
- [ ] إضافة المزيد من الأمثلة
- [ ] تحسين رسائل الخطأ
- [ ] دعم المزيد من محركات العرض
- [ ] تحسين التوثيق

### منخفضة الأولوية
- [ ] إضافة المزيد من الثيمات
- [ ] تحسين الرسوم المتحركة
- [ ] دعم المزيد من اللغات
- [ ] أدوات إضافية للمطورين

## 💬 التواصل

- **Discord**: [رابط الخادم](https://discord.gg/arabic-math-js)
- **Discussions**: [GitHub Discussions](https://github.com/username/arabic-math-js/discussions)
- **Email**: contribute@arabic-math-js.com
- **Twitter**: [@ArabicMathJS](https://twitter.com/ArabicMathJS)

## 🎉 شكر المساهمين

جميع المساهمين سيتم ذكرهم في:
- ملف CONTRIBUTORS.md
- الموقع الرسمي
- ملاحظات الإصدارات

### مستويات المساهمة:

🥉 **البرونزية**: 1-5 مساهمات
🥈 **الفضية**: 6-20 مساهمة  
🥇 **الذهبية**: 21-50 مساهمة
💎 **الماسية**: 50+ مساهمة

## ❓ الأسئلة الشائعة

### س: هل يمكنني المساهمة بدون خبرة في JavaScript؟
ج: نعم! يمكنك المساهمة في التوثيق، الترجمة، الإبلاغ عن الأخطاء، أو اختبار المكتبة.

### س: كيف أعرف أن مساهمتي ستُقبل؟
ج: ناقش الفكرة في issue قبل البدء في العمل عليها. نحن نرحب بجميع المساهمات البناءة.

### س: كم من الوقت تستغرق مراجعة Pull Request؟
ج: عادة خلال 3-7 أيام. المراجعات الأكبر قد تستغرق وقتاً أطول.

### س: هل يمكنني اقتراح تغييرات كبيرة؟
ج: نعم، لكن ناقشها أولاً في GitHub Discussions أو أنشئ RFC.

---

شكراً لك على اهتمامك بالمساهمة في مكتبة الرياضيات العربية! 🙏

كل مساهمة، مهما كانت صغيرة، تساعد في جعل الرياضيات أكثر إتاحة للمتحدثين بالعربية. 🌟
```

### **CODE_OF_CONDUCT.md:**
```markdown
# 📜 مدونة قواعد السلوك

## تعهدنا

في سبيل تعزيز بيئة مفتوحة ومرحبة، نحن كمساهمين ومشرفين نتعهد بأن نجعل المشاركة في مشروعنا ومجتمعنا تجربة خالية من المضايقات للجميع، بغض النظر عن العمر، حجم الجسم، الإعاقة، العرق، الهوية الجنسية والتعبير عنها، مستوى الخبرة، الجنسية، المظهر الشخصي، العرق، الدين، أو الهوية والتوجه الجنسي.

## معاييرنا

أمثلة على السلوك الذي يساهم في خلق بيئة إيجابية تشمل:

### ✅ السلوكيات المقبولة

- **الاحترام المتبادل**: تقدير وجهات النظر والآراء المختلفة
- **التواصل البناء**: تقديم نقد بناء ومفيد وقبوله بصدر رحب
- **التعاون**: العمل معاً لصالح المجتمع والمشروع
- **التفهم**: إظهار التعاطف تجاه أعضاء المجتمع الآخرين
- **التعلم**: الانفتاح على التعلم من الأخطاء والاعتذار عند اللزوم
- **التنوع**: الاحتفال بالتنوع والشمولية

### ❌ السلوكيات غير المقبولة

- **المضايقة**: أي شكل من أشكال المضايقة أو التنمر
- **التمييز**: التعليقات المهينة أو التمييزية
- **الهجمات الشخصية**: مهاجمة الأشخاص بدلاً من مناقشة الأفكار
- **المضايقة الجنسية**: التعليقات أو الصور ذات الطابع الجنسي غير المرغوب فيها
- **الخصوصية**: نشر معلومات شخصية للآخرين بدون إذن
- **السلوك غير المهني**: سلوك لا يُعتبر مناسباً في بيئة مهنية

## نطاق التطبيق

تطبق مدونة قواعد السلوك هذه في جميع مساحات المشروع، وكذلك عندما يمثل الفرد المشروع أو مجتمعه في المساحات العامة. أمثلة تمثيل المشروع أو المجتمع تشمل:

- استخدام عنوان بريد إلكتروني رسمي للمشروع
- النشر عبر حساب وسائل التواصل الاجتماعي الرسمي
- العمل كممثل معين في حدث عبر الإنترنت أو دون اتصال

## الإبلاغ والتطبيق

### 🚨 الإبلاغ عن المخالفات

يمكن الإبلاغ عن حالات السلوك المؤذي أو المضايقة أو غير المقبول عبر الاتصال بفريق المشروع على:

- **البريد الإلكتروني**: conduct@arabic-math-js.com
- **نموذج سري**: [رابط النموذج](https://forms.gle/secret-form)
- **التواصل المباشر**: مع أي من أعضاء الفريق الأساسي

### 📋 عملية التعامل مع البلاغات

1. **الاستقبال**: سنؤكد استلام البلاغ خلال 24 ساعة
2. **المراجعة**: فريق السلوك سيراجع البلاغ بسرية
3. **التحقيق**: جمع معلومات إضافية إذا لزم الأمر
4. **القرار**: اتخاذ إجراء مناسب بناءً على النتائج
5. **المتابعة**: إعلام المبلغ بالنتيجة والإجراءات المتخذة

### ⚖️ الإجراءات التصحيحية

قد تشمل الاستجابات للسلوك غير المناسب:

#### 1. التحذير الخاص
- **متى**: للمخالفات البسيطة أو غير المقصودة
- **الإجراء**: توضيح خاص للسلوك غير المناسب
- **المدة**: فوري

#### 2. التحذير العلني
- **متى**: للمخالفات المتكررة أو الأكثر جدية
- **الإجراء**: تحذير علني مع توضيح للسلوك
- **المدة**: حسب الحاجة

#### 3. الحظر المؤقت
- **متى**: للمخالفات الجدية أو أنماط السلوك السيء
- **الإجراء**: حظر مؤقت من التفاعل مع المجتمع
- **المدة**: من أسبوع إلى 6 أشهر

#### 4. الحظر الدائم
- **متى**: للمخالفات الجدية جداً أو السلوك المستمر
- **الإجراء**: حظر دائم من جميع مساحات المشروع
- **المدة**: دائم، مع إمكانية الاستئناف بعد سنة واحدة

## المسؤوليات

### مسؤوليات أعضاء المجتمع

- **احترام الآخرين**: التعامل مع جميع الأعضاء باحترام
- **التبليغ**: الإبلاغ عن السلوك غير المناسب
- **التعلم**: الاستفادة من التوجيهات والنقد البناء
- **المشاركة الإيجابية**: المساهمة بشكل إيجابي في المجتمع

### مسؤوليات المشرفين

- **إنفاذ المعايير**: تطبيق معايير السلوك المقبول بعدالة
- **الاستجابة السريعة**: التعامل مع التقارير بسرعة ومهنية
- **الشفافية**: توضيح الإجراءات المتخذة عند المناسبة
- **التحسين المستمر**: تطوير العمليات والمعايير باستمرار

## التوجيهات الخاصة

### 🌍 التنوع الثقافي واللغوي

مجتمعنا متنوع ويضم أشخاصاً من خلفيات ثقافية ولغوية مختلفة:

- **صبر**: كن صبوراً مع من لا يتحدث العربية كلغة أولى
- **وضوح**: استخدم لغة بسيطة وواضحة
- **ترحيب**: اجعل الجميع يشعر بالترحيب بغض النظر عن خلفيتهم

### 🤝 النقاش التقني

- **ركز على المشكلة**: ناقش الأفكار والحلول، ليس الأشخاص
- **كن بناءً**: قدم اقتراحات للتحسين، لا تكتفِ بالنقد
- **تقبل الاختلاف**: احترم وجهات النظر المختلفة في النهج التقني

### 📚 المشاركة في التعلم

- **شارك المعرفة**: ساعد الآخرين على التعلم
- **اسأل بأدب**: لا تتردد في طرح الأسئلة بطريقة مهذبة
- **اعترف بالجهل**: لا بأس بعدم معرفة شيء ما

## الموارد والدعم

### 🆘 الحصول على المساعدة

إذا كنت تواجه مضايقة أو تشعر بعدم الراحة:

1. **تواصل معنا**: استخدم قنوات الإبلاغ أعلاه
2. **ابحث عن الدعم**: تحدث مع صديق موثوق أو مستشار
3. **خذ استراحة**: لا بأس بأخذ استراحة من المجتمع إذا لزم الأمر

### 📞 موارد خارجية للدعم

- **خط المساعدة النفسية**: [رقم الهاتف المحلي]
- **مراكز الدعم**: [روابط لمراكز الدعم المحلية]
- **موارد الصحة النفسية**: [روابط لموارد الصحة النفسية]

## التحديثات والتطوير

### 📝 تطوير مدونة السلوك

هذه الوثيقة حية وقابلة للتطوير:

- **المراجعة الدورية**: نراجع المدونة كل 6 أشهر
- **المشاركة المجتمعية**: نرحب بتعليقاتكم واقتراحاتكم
- **الشفافية**: نعلن عن أي تغييرات مهمة مسبقاً

### 🔄 عملية التغيير

1. **اقتراح التغيير**: عبر issue أو discussion
2. **المناقشة المجتمعية**: فترة للتعليقات والنقاش
3. **مراجعة الفريق**: مراجعة من فريق الإدارة
4. **التطبيق**: تطبيق التغييرات المعتمدة

## الشكر والتقدير

### 🙏 مصادر الإلهام

هذه المدونة مستوحاة من:
- [Contributor Covenant](https://www.contributor-covenant.org/)
- [Django Code of Conduct](https://www.djangoproject.com/conduct/)
- [Rust Code of Conduct](https://www.rust-lang.org/conduct.html)

### 👥 فريق السلوك

- **[الاسم 1]** - المنسق الرئيسي
- **[الاسم 2]** - مراجع السلوك
- **[الاسم 3]** - مستشار المجتمع

## اتصل بنا

لأي أسئلة حول مدونة السلوك هذه:

- **البريد الإلكتروني**: conduct@arabic-math-js.com
- **المناقشات**: [GitHub Discussions](https://github.com/username/arabic-math-js/discussions)

---

**إصدار**: 1.0  
**تاريخ آخر تحديث**: [التاريخ]  
**اللغات المتوفرة**: العربية، الإنجليزية

---

نشكرك على مساعدتك في جعل مجتمعنا مكاناً آمناً ومرحباً للجميع! 🌟
```

## 🎨 **18. ملفات الموارد والأصول - assets/**


### **assets/icons/generate-icons.js:**
```javascript
/**
 * مولد أيقونات المكتبة
 */
const fs = require('fs');
const path = require('path');

class IconGenerator {
    constructor() {
        this.baseIcon = `
            <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea"/>
                        <stop offset="100%" style="stop-color:#764ba2"/>
                    </linearGradient>
                </defs>
                
                <!-- خلفية دائرية -->
                <circle cx="32" cy="32" r="30" fill="url(#gradient)"/>
                
                <!-- رمز الرياضيات -->
                <text x="32" y="42" font-family="Arial, sans-serif" 
                      font-size="28" font-weight="bold" 
                      text-anchor="middle" fill="white">∑</text>
                
                <!-- نص عربي صغير -->
                <text x="32" y="55" font-family="Arial, sans-serif" 
                      font-size="8" text-anchor="middle" fill="white" opacity="0.8">عربي</text>
            </svg>
        `;
    }
    
    async generateAll() {
        console.log('🎨 إنشاء الأيقونات...');
        
        await this.createDirectories();
        await this.generateSVGIcons();
        await this.generatePNGIcons();
        await this.generateFavicons();
        await this.generateLogo();
        await this.createIconManifest();
        
        console.log('✅ تم إنشاء جميع الأيقونات');
    }
    
    async createDirectories() {
        const dirs = [
            'assets/icons',
            'assets/icons/svg',
            'assets/icons/png',
            'assets/icons/favicon',
            'assets/logos'
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    
    async generateSVGIcons() {
        const variations = {
            'icon-main': {
                gradient: ['#667eea', '#764ba2'],
                symbol: '∑',
                text: 'عربي'
            },
            'icon-dark': {
                gradient: ['#2d3748', '#1a202c'],
                symbol: '∫',
                text: 'رياضيات'
            },
            'icon-light': {
                gradient: ['#ffffff', '#f7fafc'],
                symbol: 'π',
                text: 'عربي',
                textColor: '#2d3748'
            }
        };
        
        for (const [name, config] of Object.entries(variations)) {
            const svg = this.createSVG(config);
            fs.writeFileSync(`assets/icons/svg/${name}.svg`, svg);
        }
    }
    
    createSVG(config) {
        const textColor = config.textColor || 'white';
        
        return `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${config.gradient[0]}"/>
            <stop offset="100%" style="stop-color:${config.gradient[1]}"/>
        </linearGradient>
        <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
    </defs>
    
    <circle cx="32" cy="32" r="30" fill="url(#gradient)" filter="url(#shadow)"/>
    
    <text x="32" y="42" font-family="Arial, sans-serif" 
          font-size="28" font-weight="bold" 
          text-anchor="middle" fill="${textColor}">${config.symbol}</text>
    
    <text x="32" y="55" font-family="Arial, sans-serif" 
          font-size="8" text-anchor="middle" fill="${textColor}" opacity="0.8">${config.text}</text>
</svg>`.trim();
    }
    
    async generatePNGIcons() {
        // هذا يتطلب مكتبة تحويل SVG إلى PNG مثل sharp أو puppeteer
        console.log('ملاحظة: تحويل PNG يتطلب مكتبة إضافية مثل sharp');
        
        const sizes = [16, 32, 48, 64, 128, 256, 512];
        const placeholder = 'ملفات PNG ستُنشأ هنا عند تثبيت sharp';
        
        sizes.forEach(size => {
            const dir = `assets/icons/png/${size}x${size}`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(`${dir}/icon.placeholder`, placeholder);
        });
    }
    
    async generateFavicons() {
        // إنشاء ملف favicon.ico placeholder
        const faviconSizes = [16, 32, 48];
        
        faviconSizes.forEach(size => {
            const svg = this.createSVG({
                gradient: ['#667eea', '#764ba2'],
                symbol: '∑',
                text: 'ع'
            });
            
            fs.writeFileSync(`assets/icons/favicon/favicon-${size}x${size}.svg`, svg);
        });
        
        // ملف manifest للـ web app
        const webManifest = {
            name: 'Arabic Math JS',
            short_name: 'ArabicMath',
            description: 'مكتبة الرياضيات العربية',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#667eea',
            icons: faviconSizes.map(size => ({
                src: `assets/icons/favicon/favicon-${size}x${size}.svg`,
                sizes: `${size}x${size}`,
                type: 'image/svg+xml'
            }))
        };
        
        fs.writeFileSync('assets/icons/favicon/manifest.json', JSON.stringify(webManifest, null, 2));
    }
    
    async generateLogo() {
        const logoSVG = `
<svg width="300" height="100" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
        </linearGradient>
    </defs>
    
    <!-- الأيقونة -->
    <circle cx="50" cy="50" r="35" fill="url(#logoGradient)"/>
    <text x="50" y="65" font-family="Arial, sans-serif" 
          font-size="32" font-weight="bold" 
          text-anchor="middle" fill="white">∑</text>
    
    <!-- النص الإنجليزي -->
    <text x="110" y="40" font-family="Arial, sans-serif" 
          font-size="24" font-weight="bold" fill="#2d3748">Arabic Math JS</text>
    
    <!-- النص العربي -->
    <text x="110" y="70" font-family="Arial, sans-serif" 
          font-size="16" fill="#718096">مكتبة الرياضيات العربية</text>
</svg>`.trim();
        
        fs.writeFileSync('assets/logos/logo.svg', logoSVG);
        
        // شعار مبسط
        const logoSimple = `
<svg width="200" height="50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="35" font-family="Arial, sans-serif" 
          font-size="20" font-weight="bold" fill="#667eea">Arabic Math JS</text>
</svg>`.trim();
        
        fs.writeFileSync('assets/logos/logo-simple.svg', logoSimple);
    }
    
    async createIconManifest() {
        const manifest = {
            name: 'Arabic Math JS Icons',
            version: '1.0.0',
            description: 'مجموعة أيقونات مكتبة الرياضيات العربية',
            icons: {
                svg: {
                    main: 'assets/icons/svg/icon-main.svg',
                    dark: 'assets/icons/svg/icon-dark.svg',
                    light: 'assets/icons/svg/icon-light.svg'
                },
                png: {
                    sizes: [16, 32, 48, 64, 128, 256, 512],
                    path: 'assets/icons/png/{size}x{size}/icon.png'
                },
                favicon: {
                    ico: 'assets/icons/favicon/favicon.ico',
                    svg: 'assets/icons/favicon/favicon.svg',
                    manifest: 'assets/icons/favicon/manifest.json'
                },
                logos: {
                    main: 'assets/logos/logo.svg',
                    simple: 'assets/logos/logo-simple.svg'
                }
            },
            usage: {
                web: 'استخدم favicon.svg للمواقع الإلكترونية',
                app: 'استخدم manifest.json للتطبيقات التقدمية',
                print: 'استخدم logo.svg للمواد المطبوعة',
                social: 'استخدم icon-main.svg لوسائل التواصل'
            }
        };
        
        fs.writeFileSync('assets/icons/manifest.json', JSON.stringify(manifest, null, 2));
    }
}

// تشغيل المولد
if (require.main === module) {
    const generator = new IconGenerator();
    generator.generateAll().catch(console.error);
}

module.exports = IconGenerator;
```

### **assets/fonts/font-loader.css:**
```css
/**
 * محمل الخطوط العربية للرياضيات
 */

/* خط أميري للرياضيات */
@font-face {
    font-family: 'Amiri Math';
    src: url('amiri-quran.woff2') format('woff2'),
         url('amiri-quran.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}

/* خط القاهرة للعناوين */
@font-face {
    font-family: 'Cairo Math';
    src: url('cairo-regular.woff2') format('woff2'),
         url('cairo-regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0600-06FF, U+0750-077F;
}

@font-face {
    font-family: 'Cairo Math';
    src: url('cairo-bold.woff2') format('woff2'),
         url('cairo-bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0600-06FF, U+0750-077F;
}

/* خط شهرزاد الجديد للنصوص الطويلة */
@font-face {
    font-family: 'Scheherazade Math';
    src: url('scheherazade-new-regular.woff2') format('woff2'),
         url('scheherazade-new-regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}

/* خط ناسك للواجهات الحديثة */
@font-face {
    font-family: 'Nask Math';
    src: url('noto-sans-arabic.woff2') format('woff2'),
         url('noto-sans-arabic.woff') format('woff');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0600-06FF, U+0750-077F;
}

/* متغيرات CSS للخطوط */
:root {
    --font-arabic-serif: 'Amiri Math', 'Times New Roman', serif;
    --font-arabic-sans: 'Cairo Math', 'Arial', sans-serif;
    --font-arabic-display: 'Scheherazade Math', 'Georgia', serif;
    --font-arabic-ui: 'Nask Math', 'Segoe UI', sans-serif;
    
    /* أحجام الخطوط */
    --font-size-small: 0.875rem;    /* 14px */
    --font-size-base: 1rem;         /* 16px */
    --font-size-large: 1.125rem;    /* 18px */
    --font-size-xl: 1.25rem;        /* 20px */
    --font-size-2xl: 1.5rem;        /* 24px */
    --font-size-3xl: 2rem;          /* 32px */
    
    /* أوزان الخطوط */
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
}

/* فئات مساعدة للخطوط */
.font-arabic-serif {
    font-family: var(--font-arabic-serif);
}

.font-arabic-sans {
    font-family: var(--font-arabic-sans);
}

.font-arabic-display {
    font-family: var(--font-arabic-display);
}

.font-arabic-ui {
    font-family: var(--font-arabic-ui);
}

/* تحسينات للخطوط العربية */
.arabic-text {
    font-feature-settings: 'liga' 1, 'calt' 1, 'ccmp' 1, 'curs' 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    direction: rtl;
    text-align: right;
}

/* تحسينات خاصة بالرياضيات */
.math-arabic-text {
    font-variant-numeric: oldstyle-nums;
    font-feature-settings: 'kern' 1, 'liga' 1, 'clig' 1, 'calt' 1;
}

/* دعم الخطوط المتغيرة */
@supports (font-variation-settings: normal) {
    .font-variable {
        font-variation-settings: 'wght' 400, 'slnt' 0;
        transition: font-variation-settings 0.2s ease;
    }
    
    .font-variable:hover {
        font-variation-settings: 'wght' 500, 'slnt' 0;
    }
}

/* تحسين عرض الخطوط على الشاشات عالية الدقة */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .arabic-text {
        -webkit-font-smoothing: subpixel-antialiased;
    }
}

/* تحسينات للطباعة */
@media print {
    .arabic-text {
        font-family: 'Amiri Math', serif;
        font-size: 12pt;
        line-height: 1.6;
        color: black;
        text-shadow: none;
    }
}

/* تحميل تفاعلي للخطوط */
.font-loading {
    font-family: 'Arial', sans-serif;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.font-loaded {
    opacity: 1;
}

/* رسالة عدم دعم الخطوط */
.font-fallback-warning {
    display: none;
    background: #fff3cd;
    border: 1px solid #ffeeba;
    color: #856404;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;
    text-align: center;
}

@supports not (font-feature-settings: 'liga') {
    .font-fallback-warning {
        display: block;
    }
}
```

### **assets/data/arabic-unicode-ranges.json:**
```json
{
  "name": "Arabic Unicode Ranges for Math",
  "description": "نطاقات يونيكود للأحرف العربية والرموز الرياضية",
  "version": "1.0.0",
  "ranges": {
    "arabic_basic": {
      "name": "الأحرف العربية الأساسية",
      "range": "U+0600-06FF",
      "description": "الأحرف العربية والفارسية الأساسية",
      "characters_count": 255,
      "includes": [
        "الحروف العربية (ا-ي)",
        "علامات التشكيل",
        "علامات الترقيم العربية",
        "الأرقام العربية الهندية"
      ]
    },
    "arabic_supplement": {
      "name": "الملحق العربي",
      "range": "U+0750-077F",
      "description": "أحرف عربية إضافية",
      "characters_count": 48,
      "includes": [
        "أحرف عربية نادرة",
        "أحرف للغات أفريقية"
      ]
    },
    "arabic_extended_a": {
      "name": "العربية الموسعة أ",
      "range": "U+08A0-08FF",
      "description": "أحرف عربية موسعة",
      "characters_count": 96,
      "includes": [
        "أحرف للهجات المحلية",
        "رموز إضافية"
      ]
    },
    "arabic_presentation_forms_a": {
      "name": "أشكال العرض العربية أ",
      "range": "U+FB50-FDFF",
      "description": "الأشكال المتصلة للحروف العربية",
      "characters_count": 688,
      "includes": [
        "الحروف المتصلة",
        "الحروف المنفصلة",
        "التراكيب الخاصة"
      ]
    },
    "arabic_presentation_forms_b": {
      "name": "أشكال العرض العربية ب",
      "range": "U+FE70-FEFF",
      "description": "أشكال إضافية للحروف العربية",
      "characters_count": 144,
      "includes": [
        "أشكال الحروف في المواضع المختلفة",
        "علامات التشكيل المتصلة"
      ]
    },
    "mathematical_symbols": {
      "name": "الرموز الرياضية",
      "range": "U+2200-22FF",
      "description": "الرموز الرياضية الأساسية",
      "characters_count": 256,
      "includes": [
        "عوامل التشغيل (∀, ∃, ∈, ∉)",
        "العلاقات (≤, ≥, ≠, ≈)",
        "العمليات (∪, ∩, ⊂, ⊃)",
        "التكامل والمجاميع (∫, ∑, ∏)"
      ]
    },
    "mathematical_operators": {
      "name": "عوامل التشغيل الرياضية",
      "range": "U+2190-21FF",
      "description": "الأسهم والعوامل",
      "characters_count": 112,
      "includes": [
        "الأسهم (←, →, ↔, ⇒)",
        "الأسهم المركبة",
        "رموز الاتجاه"
      ]
    }
  },
  "math_specific": {
    "common_symbols": {
      "π": {
        "unicode": "U+03C0",
        "name": "pi",
        "arabic": "π"
      },
      "∞": {
        "unicode": "U+221E",
        "name": "infinity", 
        "arabic": "∞"
      },
      "∫": {
        "unicode": "U+222B",
        "name": "integral",
        "arabic": "∫"
      },
      "∑": {
        "unicode": "U+2211",
        "name": "summation",
        "arabic": "∑"
      },
      "∏": {
        "unicode": "U+220F", 
        "name": "product",
        "arabic": "∏"
      },
      "√": {
        "unicode": "U+221A",
        "name": "square root",
        "arabic": "√"
      },
      "∂": {
        "unicode": "U+2202",
        "name": "partial derivative",
        "arabic": "∂"
      },
      "∇": {
        "unicode": "U+2207",
        "name": "nabla",
        "arabic": "∇"
      }
    },
    "arrows": {
      "→": {
        "unicode": "U+2192",
        "name": "rightwards arrow",
        "arabic_equivalent": "←",
        "rtl_flip": true
      },
      "←": {
        "unicode": "U+2190", 
        "name": "leftwards arrow",
        "arabic_equivalent": "→",
        "rtl_flip": true
      },
      "↔": {
        "unicode": "U+2194",
        "name": "left right arrow",
        "arabic_equivalent": "↔",
        "rtl_flip": false
      },
      "⇒": {
        "unicode": "U+21D2",
        "name": "rightwards double arrow",
        "arabic_equivalent": "⇐",
        "rtl_flip": true
      },
      "⇐": {
        "unicode": "U+21D0",
        "name": "leftwards double arrow", 
        "arabic_equivalent": "⇒",
        "rtl_flip": true
      }
    },
    "relations": {
      "=": {
        "unicode": "U+003D",
        "name": "equals",
        "arabic": "="
      },
      "≠": {
        "unicode": "U+2260",
        "name": "not equal",
        "arabic": "≠"
      },
      "≈": {
        "unicode": "U+2248",
        "name": "approximately equal",
        "arabic": "≈"
      },
      "≡": {
        "unicode": "U+2261",
        "name": "equivalent",
        "arabic": "≡"
      },
      "≤": {
        "unicode": "U+2264",
        "name": "less than or equal",
        "arabic": "≤"
      },
      "≥": {
        "unicode": "U+2265",
        "name": "greater than or equal",
        "arabic": "≥"
      }
    }
  },
  "fonts_support": {
    "recommended_fonts": [
      {
        "name": "Amiri",
        "type": "serif",
        "math_support": "excellent",
        "unicode_coverage": ["arabic_basic", "arabic_presentation_forms_a", "arabic_presentation_forms_b"],
        "best_for": "traditional mathematical texts"
      },
      {
        "name": "Cairo",
        "type": "sans-serif", 
        "math_support": "good",
        "unicode_coverage": ["arabic_basic"],
        "best_for": "modern interfaces"
      },
      {
        "name": "Scheherazade New",
        "type": "serif",
        "math_support": "excellent", 
        "unicode_coverage": ["arabic_basic", "arabic_supplement", "arabic_extended_a"],
        "best_for": "comprehensive Arabic text"
      },
      {
        "name": "Noto Sans Arabic",
        "type": "sans-serif",
        "math_support": "fair",
        "unicode_coverage": ["arabic_basic"],
        "best_for": "web interfaces"
      }
    ],
    "fallback_sequence": [
      "'Amiri'",
      "'Times New Roman'", 
      "'Arial Unicode MS'",
      "serif"
    ]
  },
  "validation": {
    "required_characters": [
      "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
    ],
    "required_numbers": [
      "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"
    ],
    "required_math_symbols": [
      "π", "∞", "∫", "∑", "∏", "√", "∂", "∇", "≤", "≥", "≠", "≈", "≡"
    ]
  }
}
```

## 🔧 **19. ملفات التكوين المتقدمة**

### **.eslintrc.js:**
```javascript
/**
 * تكوين ESLint لمكتبة الرياضيات العربية
 */
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:jsdoc/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
    },
    plugins: [
        'jsdoc',
        'security'
    ],
    rules: {
        // قواعد الجودة العامة
        'indent': ['error', 4, { 
            SwitchCase: 1,
            ignoredNodes: ['ConditionalExpression']
        }],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single', { 
            avoidEscape: true,
            allowTemplateLiterals: true 
        }],
        'semi': ['error', 'always'],
        'no-unused-vars': ['error', { 
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_' 
        }],
        'no-console': ['warn', { 
            allow: ['warn', 'error'] 
        }],
        
        // قواعد التسمية
        'camelcase': ['error', { 
            properties: 'always',
            ignoreGlobals: true 
        }],
        'prefer-const': 'error',
        'no-var': 'error',
        
        // قواعد الدوال
        'function-call-argument-newline': ['error', 'consistent'],
        'function-paren-newline': ['error', 'consistent'],
        'prefer-arrow-callback': 'error',
        'arrow-spacing': 'error',
        
        // قواعد الكائنات والمصفوفات
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'comma-dangle': ['error', 'never'],
        'comma-spacing': ['error', { before: false, after: true }],
        
        // قواعد الشروط والحلقات
        'curly': ['error', 'all'],
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'keyword-spacing': 'error',
        'space-before-blocks': 'error',
        
        // قواعد الأمان
        'security/detect-eval-with-expression': 'error',
        'security/detect-non-literal-regexp': 'warn',
        'security/detect-unsafe-regex': 'error',
        'security/detect-buffer-noassert': 'error',
        
        // قواعد التوثيق
        'jsdoc/require-description': 'error',
        'jsdoc/require-description-complete-sentence': 'error',
        'jsdoc/require-example': 'warn',
        'jsdoc/require-param': 'error',
        'jsdoc/require-param-description': 'error',
        'jsdoc/require-param-type': 'error',
        'jsdoc/require-returns': 'error',
        'jsdoc/require-returns-description': 'error',
        'jsdoc/require-returns-type': 'error',
        
        // قواعد خاصة بالمشروع
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',
        
        // تحسين الأداء
        'no-loop-func': 'error',
        'no-await-in-loop': 'warn',
        'prefer-template': 'error',
        
        // إمكانية الوصول
        'no-alert': 'error'
    },
    overrides: [
        // قواعد خاصة بملفات الاختبار
        {
            files: ['**/*.test.js', '**/*.spec.js', '**/tests/**/*.js'],
            env: {
                jest: true
            },
            rules: {
                'no-console': 'off',
                'jsdoc/require-example': 'off'
            }
        },
        
        // قواعد خاصة بأدوات البناء
        {
            files: ['tools/**/*.js', 'scripts/**/*.js'],
            rules: {
                'no-console': 'off',
                'security/detect-non-literal-fs-filename': 'off'
            }
        },
        
        // قواعد خاصة بالأمثلة
        {
            files: ['examples/**/*.js'],
            rules: {
                'no-console': 'off',
                'no-unused-vars': 'warn',
                'jsdoc/require-jsdoc': 'off'
            }
        }
    ],
    settings: {
        jsdoc: {
            mode: 'jsdoc',
            preferredTypes: {
                'object': 'Object',
                'array': 'Array',
                'function': 'Function'
            },
            tagNamePreference: {
                'returns': 'return',
                'arg': 'param',
                'argument': 'param'
            }
        }
    },
    ignorePatterns: [
        'dist/',
        'node_modules/',
        'coverage/',
        '*.min.js',
        'docs-dist/'
    ]
};
```

### **.prettierrc.js:**
```javascript
/**
 * تكوين Prettier لتنسيق الكود
 */
module.exports = {
    // الإعدادات الأساسية
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    trailingComma: 'none',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid',
    
    // إعدادات النهاية
    endOfLine: 'lf',
    insertPragma: false,
    requirePragma: false,
    
    // إعدادات HTML
    htmlWhitespaceSensitivity: 'css',
    vueIndentScriptAndStyle: false,
    
    // إعدادات خاصة بنوع الملف
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2,
                parser: 'json'
            }
        },
        {
            files: '*.md',
            options: {
                tabWidth: 2,
                proseWrap: 'always',
                parser: 'markdown'
            }
        },
        {
            files: '*.css',
            options: {
                tabWidth: 2,
                parser: 'css'
            }
        },
        {
            files: '*.html',
            options: {
                tabWidth: 2,
                parser: 'html'
            }
        },
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
                parser: 'yaml'
            }
        }
    ]
};
```

### **jest.config.js:**
```javascript
/**
 * تكوين Jest للاختبارات
 */
module.exports = {
    // بيئة الاختبار
    testEnvironment: 'jsdom',
    
    // مجلدات الجذر
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    
    // أنماط البحث عن ملفات الاختبار
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    
    // تحويل الملفات
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    
    // ملفات الإعداد
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    
    // تغطية الكود
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: [
        'text',
        'lcov', 
        'html',
        'json'
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/**/*.spec.js',
        '!src/**/index.js'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
        './src/core/': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        }
    },
    
    // إعداد البيئة
    globals: {
        'MathJax': {
            tex: {
                inlineMath: [['\\(', '\\)']],
                displayMath: [['\\[', '\\]']]
            }
        }
    },
    
    // محاكاة الوحدات
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1'
    },
    
    // تجاهل أنماط معينة
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/coverage/'
    ],
    
    // timeout للاختبارات
    testTimeout: 10000,
    
    // إعداد إضافي
    verbose: true,
    clearMocks: true,
    restoreMocks: true,
    
    // تقارير مخصصة
    reporters: [
        'default',
        ['jest-html-reporters', {
            publicPath: './coverage/html-report',
            filename: 'report.html',
            expand: true,
            pageTitle: 'Arabic Math JS - Test Report',
            logoImgPath: './assets/icons/svg/icon-main.svg'
        }]
    ],
    
    // إعدادات خاصة بالمتصفح
    testEnvironmentOptions: {
        url: 'http://localhost'
    }
};
```

### **babel.config.js:**
```javascript
/**
 * تكوين Babel للتحويل
 */
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: [
                        '> 1%',
                        'last 2 versions',
                        'not ie <= 8'
                    ],
                    node: '14'
                },
                useBuiltIns: 'usage',
                corejs: 3,
                modules: false // للحفاظ على ES modules في البناء
            }
        ]
    ],
    
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        
        // تحسين الأداء
        '@babel/plugin-transform-runtime'
    ],
    
    env: {
        // إعدادات للاختبار
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: 'current'
                        },
                        modules: 'commonjs'
                    }
                ]
            ]
        },
        
        // إعدادات للتطوير
        development: {
            plugins: [
                // إضافة معلومات debug
                '@babel/plugin-transform-react-jsx-source',
                '@babel/plugin-transform-react-jsx-self'
            ]
        },
        
        // إعدادات للإنتاج
        production: {
            plugins: [
                // تحسين الأداء
                'babel-plugin-transform-remove-console',
                '@babel/plugin-transform-remove-debugger'
            ]
        }
    },
    
    // تجاهل ملفات معينة
    ignore: [
        'node_modules/',
        'dist/',
        '**/*.test.js',
        '**/*.spec.js'
    ],
    
    // تعليقات
    comments: false,
    minified: false,
    compact: 'auto'
};
```

هل تريد مني المتابعة مع المزيد من الملفات النهائية مثل ملفات الصيانة، CHANGELOG.md، أو خلاصة المشروع الكامل؟