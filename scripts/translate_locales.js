
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env.local manually since we are in a simple script
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        if (fs.existsSync(envPath)) {
            const data = fs.readFileSync(envPath, 'utf8');
            data.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
        }
    } catch (e) {
        console.log("Could not load .env.local", e);
    }
}

loadEnv();

const API_KEY = process.env.VITE_GOOGLE_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY;

if (!API_KEY) {
    console.error("Error: API_KEY not found in environment or .env.local");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const modelId = 'gemini-2.5-flash';

const LANGUAGES = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ru', name: 'Russian' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
];

async function translate() {
    const enPath = path.resolve(__dirname, '../locales/en.json');
    const enContent = fs.readFileSync(enPath, 'utf8');
    const enJson = JSON.parse(enContent);

    console.log(`Loaded English source. Translating to ${LANGUAGES.length} languages...`);

    for (const lang of LANGUAGES) {
        console.log(`Translating to ${lang.name} (${lang.code})...`);

        try {
            const prompt = `
            You are a professional translator for a software application.
            Translate the values of the following JSON object into ${lang.name}.
            Do NOT translate the keys.
            Do NOT change the structure.
            Keep variables like {{name}} intact.
            Return ONLY the valid JSON string. No markdown block markers.
            
            JSON:
            ${JSON.stringify(enJson, null, 2)}
            `;

            const result = await ai.models.generateContent({
                model: modelId,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json'
                }
            });

            const translatedText = result.text(); // SDK method
            // Clean up if markdown is present (though responseMimeType should handle it)
            const cleanJson = translatedText.replace(/```json/g, '').replace(/```/g, '').trim();

            // Validate JSON
            JSON.parse(cleanJson);

            const targetPath = path.resolve(__dirname, `../locales/${lang.code}.json`);
            fs.writeFileSync(targetPath, cleanJson, 'utf8');
            console.log(`✅ Saved ${lang.code}.json`);
        } catch (error) {
            console.error(`❌ Failed to translate ${lang.code}:`, error);
        }
    }
}

translate();
