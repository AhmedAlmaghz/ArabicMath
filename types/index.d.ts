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
