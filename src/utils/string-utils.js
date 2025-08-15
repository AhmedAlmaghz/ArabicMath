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
