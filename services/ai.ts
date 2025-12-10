import { GoogleGenAI, GenerationConfig } from "@google/genai";
import { Message, UserProfile, ChatConfig, Session } from "../types";

export class AIService {
    private client: GoogleGenAI;

    constructor(apiKey: string) {
        this.client = new GoogleGenAI({ apiKey: apiKey });
    }

    async generateStream(
        model: string,
        systemInstruction: string,
        history: Message[],
        userMessage: string
    ) {
        const chat = this.client.chats.create({
            model: model,
            config: { systemInstruction: systemInstruction },
            history: history.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
        });

        return await chat.sendMessageStream({ message: userMessage });
    }

    static buildSystemPrompt(session: Session, userProfile: UserProfile): string {
        let systemPrompt = session.systemInstruction || "You are a helpful AI assistant.";

        // Inject User Profile
        if (userProfile.bio) systemPrompt += `\nUser Bio: ${userProfile.bio}`;
        if (userProfile.name) systemPrompt += `\nUser Name: ${userProfile.name}`;
        if (userProfile.tone) systemPrompt += `\nUser Mood: ${userProfile.tone}`;
        if (userProfile.tags?.length) systemPrompt += `\nUser Interests: ${userProfile.tags.join(', ')}`;
        if (userProfile.mainLanguage && !userProfile.tags.includes('Hide my language')) {
            systemPrompt += `\nUser Main Language: ${userProfile.mainLanguage}. If you reply in another language, append the translation or original. Format: [Translated Text] ___ORIGINAL___ [Original Text]`;
        }

        // Classifications (Mapped from Tags)
        if (userProfile.tags.includes('Straight Only')) systemPrompt += `\nUser Preference: Straight Only. Do not engage in same-sex romance.`;
        if (userProfile.tags.includes('Rude Start')) systemPrompt += `\nBe rude and dismissive initially.`;
        if (userProfile.tags.includes('For youngs')) systemPrompt += `\nMention milk occasionally.`;

        // Inject Config Context
        systemPrompt += `\nMode: ${session.config.mode}`;
        if (session.config.mode === 'gangbang') {
            systemPrompt += `\nRoleplay Context: Gangbang/Group scenario. ${session.config.story ? `Context: ${session.config.story}` : ''}`;
        }
        if (session.config.privacy === 'off-record') systemPrompt += `\nThis chat is off-record.`;

        if (session.config.safety.nsfw) {
            systemPrompt += `\nNSFW Content is ALLOWED. Be open to mature themes.`;
            // Inject Sexual Profile if available (checking legacy or new structure)
            if (userProfile.roleplayIdentity) {
                const ri = userProfile.roleplayIdentity;
                systemPrompt += `\nUser Archetypes: ${ri.archetypes.join(', ')}`;
                systemPrompt += `\nVibe: Temp ${ri.vibeMix.temperature}, Heart ${ri.vibeMix.heartLevel}, Spice ${ri.vibeMix.spiceLevel}.`;
                if (ri.limits?.hardLimits?.length) systemPrompt += `\nHard Limits: ${ri.limits.hardLimits.join(', ')}`;
            } else if (userProfile.sexualProfile) {
                // Fallback to legacy
                const sp = userProfile.sexualProfile;
                systemPrompt += `\nUser Archetype: ${sp.archetype}`;
                systemPrompt += `\nDynamics: Intensity ${sp.stats.intensity}/100, Romance ${sp.stats.romance}/100.`;
                if (sp.kinks?.length) systemPrompt += `\nKinks: ${sp.kinks.join(', ')}`;
                if (sp.limits?.length) systemPrompt += `\nHard Limits (Do NOT cross): ${sp.limits.join(', ')}`;
            }
            // Fallback or additional check for SexualProfile if defined differently in types in the future
        } else {
            systemPrompt += `\nKeep content Safe for Work (SFW).`;
        }

        if (session.config.safety.flirtingProtection) systemPrompt += `\nDo not flirt. Maintain boundaries.`;
        if (session.config.safety.noNegativity) systemPrompt += `\nKeep the tone positive and uplifting.`;
        if (session.config.safety.slowMode) systemPrompt += `\n(System: Slow mode active).`;

        return systemPrompt;
    }
}
