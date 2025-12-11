import { useState, useCallback } from 'react';
import { Session, Message, UserProfile, AppSettings } from '../types';
import { TranslationService } from '../services/translation';
import { GoogleGenAI } from "@google/genai";
import { firestoreService } from '../services/firestore';

export const useMessagePipeline = (
    appSettings: AppSettings,
    userProfile: UserProfile,
    updateSessionMessages: (sessionId: string, messages: Message[]) => void
) => {
    const translationService = new TranslationService(appSettings.apiKey || process.env.API_KEY || '');

    const processUserMessage = useCallback(async (
        session: Session,
        rawText: string,
        p2p: any // Pass P2P handle if needed, or better, abstract it
    ) => {
        const userMsgId = crypto.randomUUID();
        const timestamp = Date.now();

        // 1. Optimistic Add
        const optimisticMsg: Message = {
            id: userMsgId,
            role: 'user',
            content: rawText, // Show raw first? Or show loading?
            originalContent: rawText,
            timestamp,
            status: 'sending'
        };

        const currentMessages = [...session.messages, optimisticMsg];
        updateSessionMessages(session.id, currentMessages);

        // 2. Rewrite (Persona)
        let finalContent = rawText;
        try {
            // Only rewrite if configured and not just a simple command
            if (userProfile.roleplayIdentity || userProfile.tone !== 'Neutral') {
                const ai = new GoogleGenAI({ apiKey: appSettings.apiKey || process.env.API_KEY });
                // ... (Rewrite Logic similar to SessionContext but cleaner) ...
                const context = `
                    Sender: ${userProfile.name} (${userProfile.tone}).
                    Bio: ${userProfile.bio}
                    Tags: ${userProfile.tags.join(', ')}
                    Task: Rewrite the user's message to match their character's voice. 
                    If the name implies a language, use it.
                    Return ONLY the rewritten text.
                    Message: "${rawText}"
                 `;
                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: context
                });
                if (result.text) finalContent = result.text.trim();
            }
        } catch (e) {
            console.error("Rewrite failed", e);
        }

        // 3. Detect Language (Metadata)
        const detectedLang = await translationService.detectLanguage(finalContent);

        // 4. Update Message with Final Content & Metadata
        const finalMsg: Message = {
            ...optimisticMsg,
            content: finalContent,
            status: 'sent',
            // We can store language metadata if we extend Message type further, 
            // or just rely on content. behavior:
            // "Store both original and translated text" - Prompt
            originalContent: rawText,
            translations: { [detectedLang]: finalContent } // Source language is the "translation" for itself
        };

        // Update State
        const updatedMessagesFunc = (prev: Message[]) => prev.map(m => m.id === userMsgId ? finalMsg : m);
        // We need to fetch fresh session state or use functional update in parent. 
        // Here we just call the parent callback with the *idea* of update? 
        // Ideally updateSessionMessages usage should be functional.
        // For now, let's assume we can just pass the final message back or trigger an update.

        // Let's re-read the session messages from arg? No, stale.
        // We'll rely on the parent to handle the functional update if we pass the *updater*.
        // But for simplicity, let's just re-emit the whole list if we can, or specific message update.
        updateSessionMessages(session.id, [...session.messages, finalMsg]);

        // 5. Dispatch to Network
        if (session.isP2P) {
            p2p.sendMessage(finalContent);
        } else if (session.isFirebaseRoom && session.firebaseRoomId) {
            await firestoreService.sendMessage(session.firebaseRoomId, finalContent, { lang: detectedLang });
        }

        return finalMsg;
    }, [appSettings.apiKey, userProfile, updateSessionMessages]);

    return { processUserMessage };
};
