import { GoogleGenAI } from "@google/genai";

// Simple in-memory cache to prevent re-fetching same translations
const translationCache = new Map<string, string>();
const detectionCache = new Map<string, string>();

interface TranslationResult {
    translatedText: string;
    detectedLanguage?: string;
    originalLanguage?: string;
    isTranslated: boolean;
}

export class TranslationService {
    private client: GoogleGenAI;

    constructor(apiKey: string) {
        this.client = new GoogleGenAI({ apiKey: apiKey });
    }

    /**
     * Detects the language of the provided text.
     */
    async detectLanguage(text: string): Promise<string> {
        if (!text.trim()) return 'en';
        if (text.length < 5) return 'en'; // Too short to detect reliably

        const cacheKey = `detect:${text}`;
        if (detectionCache.has(cacheKey)) return detectionCache.get(cacheKey)!;

        try {
            const response = await this.client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Detect the language of this text. Return ONLY the 2-letter ISO code (e.g. en, es, fr). Text: "${text}"`,
            });
            const lang = response.text?.trim().toLowerCase().slice(0, 2) || 'en';
            detectionCache.set(cacheKey, lang);
            return lang;
        } catch (e) {
            console.error("Language detection failed", e);
            return 'en'; // Default fallback
        }
    }

    /**
     * Translates text to the target language if different from source.
     */
    async translate(text: string, targetLang: string): Promise<TranslationResult> {
        if (!text.trim()) return { translatedText: text, isTranslated: false };

        const detectedLang = await this.detectLanguage(text);

        if (detectedLang === targetLang) {
            return {
                translatedText: text,
                detectedLanguage: detectedLang,
                originalLanguage: detectedLang,
                isTranslated: false
            };
        }

        const cacheKey = `trans:${detectedLang}:${targetLang}:${text}`;
        if (translationCache.has(cacheKey)) {
            return {
                translatedText: translationCache.get(cacheKey)!,
                detectedLanguage: detectedLang,
                originalLanguage: detectedLang,
                isTranslated: true
            };
        }

        try {
            const response = await this.client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Translate the following text from ${detectedLang} to ${targetLang}. Return ONLY the translation, nothing else. Text: "${text}"`,
            });

            const translated = response.text?.trim();
            if (translated) {
                translationCache.set(cacheKey, translated);
                return {
                    translatedText: translated,
                    detectedLanguage: detectedLang,
                    originalLanguage: detectedLang,
                    isTranslated: true
                };
            }
        } catch (e) {
            console.error("Translation failed", e);
        }

        // Fallback
        return {
            translatedText: text,
            detectedLanguage: detectedLang,
            originalLanguage: detectedLang,
            isTranslated: false
        };
    }
}
