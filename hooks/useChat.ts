import { useState } from 'react';
import { AIService } from '../services/ai';
import { Message, Session, UserProfile } from '../types';

export const useChat = (apiKey: string) => {
    const [error, setError] = useState<string | null>(null);

    const sendMessageStream = async (
        session: Session,
        userMessage: string,
        userProfile: UserProfile,
        onChunk: (text: string) => void
    ): Promise<{ content: string, original?: string, status: 'sent' | 'error' }> => {

        try {
            const ai = new AIService(apiKey || process.env.API_KEY || '');
            const systemPrompt = AIService.buildSystemPrompt(session, userProfile);

            const stream = await ai.generateStream(
                session.model,
                systemPrompt,
                // Ensure we don't duplicate the last message if it's already in the session state
                session.messages.slice(0, -1),
                userMessage
            );

            let fullText = '';
            for await (const chunk of stream) {
                const text = chunk.text || '';
                fullText += text;
                onChunk(text);
            }

            // Translation parsing
            let finalContent = fullText;
            let originalContent = undefined;
            if (fullText.includes('___ORIGINAL___')) {
                const parts = fullText.split('___ORIGINAL___');
                finalContent = parts[0].trim();
                originalContent = parts[1].trim();
            }

            return { content: finalContent, original: originalContent, status: 'sent' };

        } catch (e: any) {
            console.error(e);
            return { content: '', status: 'error' };
        }
    };

    return { sendMessageStream, error };
};
