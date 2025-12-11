import { GoogleGenAI } from "@google/genai";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Session, ChatConfig, Agent, Message } from '../types';
import { DEFAULT_CONFIG, FUNNY_DESCRIPTORS } from '../constants';
import { Storage } from '../services/storage';
import { firestoreService } from '../services/firestore';
import { useUser } from './UserContext';
import { useSettings } from './SettingsContext';
import { useChat } from '../hooks/useChat';
import { useCloudSync } from '../hooks/useCloudSync';
import { useP2P } from '../hooks/useP2P';

interface SessionContextType {
    sessions: Session[];
    activeSessionId: string | null;
    currentView: 'chat' | 'discovery' | 'profile';
    setCurrentView: (view: 'chat' | 'discovery' | 'profile') => void;
    setActiveSessionId: (id: string | null) => void;
    sessionTimer: number;
    handleCreateSession: (config: ChatConfig, title: string) => void;
    handleJoinAgent: (agent: Agent) => void;
    handleSend: (text: string) => Promise<void>;
    handleDeleteSession: (id: string, e: React.MouseEvent) => void;
    handleArchiveSession: (id: string, e: React.MouseEvent) => void;
    funnySlogan: string;
    // Expose for P2P/Cloud Logic if needed, or wrap them
    joinP2P: () => Promise<void>;
    joinCloudRoom: (roomId: string, mode: ChatConfig['mode'], topic?: string) => Promise<void>;
    createPublicRoom: (topic: string, mode?: ChatConfig['mode']) => Promise<string>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t } = useTranslation();
    const { userProfile } = useUser();
    const { appSettings } = useSettings();

    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'chat' | 'discovery' | 'profile'>('discovery');
    const [sessionTimer, setSessionTimer] = useState(0);

    // Funny slogan memoized effectively by being state init or just constant for the session
    const [funnySlogan] = useState(() => FUNNY_DESCRIPTORS[Math.floor(Math.random() * FUNNY_DESCRIPTORS.length)]);

    const { sendMessageStream } = useChat(appSettings.apiKey);

    // Initialize P2P hook
    const p2p = useP2P(sessions, setSessions, t);

    // Load Sessions
    useEffect(() => {
        const saved = Storage.get<Session[]>('sessions', []);
        setSessions(saved);
        firestoreService.init(appSettings.firebaseConfig);
    }, []); // eslint-disable-line

    // Save Sessions
    useEffect(() => {
        Storage.set('sessions', sessions);
    }, [sessions]);

    // Timer
    useEffect(() => {
        const i = setInterval(() => setSessionTimer(p => p + 1), 1000);
        return () => clearInterval(i);
    }, []);

    // Cleanup 59m/24h sessions
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setSessions(prev => prev.filter(s => {
                if (s.config.privacy === '59m' && now - s.updatedAt > 3540000) return false;
                if (s.config.privacy === '24h' && now - s.updatedAt > 86400000) return false;
                return true;
            }));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const activeSession = sessions.find(s => s.id === activeSessionId);

    // Cloud Sync Hook
    useCloudSync(
        activeSessionId,
        activeSession?.isFirebaseRoom,
        activeSession?.firebaseRoomId,
        (msgs) => {
            setSessions(prev => prev.map(s => {
                if (s.id === activeSessionId) {
                    return { ...s, messages: msgs };
                }
                return s;
            }));
        }
    );

    const handleCreateSession = (config: ChatConfig, title: string) => {
        const newSession: Session = {
            id: crypto.randomUUID(),
            title: title || t('titles.chat_default', { number: sessions.length + 1 }),
            messages: [],
            updatedAt: Date.now(),
            model: appSettings.defaultModel,
            config: config
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newSession.id);
        setCurrentView('chat');
    };

    const handleJoinAgent = (agent: Agent) => {
        const config: ChatConfig = {
            ...DEFAULT_CONFIG,
            aiRole: 'co-host',
            emoji: agent.icon,
            safety: { ...DEFAULT_CONFIG.safety, nsfw: agent.isNsfw || false }
        };

        const newSession: Session = {
            id: crypto.randomUUID(),
            title: t('titles.chat_with', { name: agent.name }),
            messages: [],
            updatedAt: Date.now(),
            model: appSettings.defaultModel,
            systemInstruction: agent.systemInstruction,
            agentId: agent.id,
            agentIcon: agent.icon,
            fluentAvatar: agent.fluentIcon,
            config: config
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newSession.id);
        setCurrentView('chat');
    };

    const joinP2P = async () => {
        // Logic from App.tsx handleP2PJoin
        const { role, roomId } = await p2p.findRandomMatch();
        const newSession: Session = {
            id: roomId,
            title: t('titles.human_p2p', { role: role === 'host' ? t('titles.guest') : t('titles.host') }),
            messages: [{
                id: crypto.randomUUID(),
                role: 'model',
                content: t('p2p.waiting_partner'),
                timestamp: Date.now(),
                status: 'sent'
            }],
            updatedAt: Date.now(),
            model: 'human',
            config: { ...DEFAULT_CONFIG, mode: '1:1', privacy: 'off-record', emoji: '⚡️' },
            isP2P: true,
            p2pChannelId: roomId
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newSession.id);
        setCurrentView('chat');
    };

    const createPublicRoom = async (topic: string, mode?: ChatConfig['mode']) => {
        return await firestoreService.createPublicRoom(topic, mode || '1:1');
    }

    const joinCloudRoom = async (roomId: string, mode: ChatConfig['mode'], topic?: string) => {
        await firestoreService.joinRoom(roomId);
        const newSession: Session = {
            id: crypto.randomUUID(), // Local session ID
            title: topic ? `${topic}` : t('titles.cloud_room', { id: roomId }),
            messages: [],
            updatedAt: Date.now(),
            model: 'human',
            config: { ...DEFAULT_CONFIG, mode: mode, privacy: 'off-record', emoji: '🔥' },
            isFirebaseRoom: true,
            firebaseRoomId: roomId
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setCurrentView('chat');
    }

    const handleSend = async (text: string) => {
        if (!activeSessionId) return;

        // 1. Prepare User Message (Optimistic)
        const userMsgId = crypto.randomUUID();
        const userMsg: Message = {
            id: userMsgId,
            role: 'user',
            content: '...', // Optimistic placeholder or show loading state
            originalContent: text,
            timestamp: Date.now(),
            status: 'sending' // Special status for "being rewritten"
        };

        // Add to state immediately
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                return { ...s, messages: [...s.messages, userMsg], updatedAt: Date.now() };
            }
            return s;
        }));

        // 2. Rewrite Message via Gemini (Translation/Persona)
        let finalContent = text;
        try {
            // Construct context from user profile
            const profile = userProfile;
            const context = `
            Sender Character Profile:
            - Name: ${profile.name}
            - Bio: ${profile.bio}
            - Tone: ${profile.tone}
            - Tags: ${profile.tags.join(', ')}
            - Roleplay Identity: ${profile.roleplayIdentity ? JSON.stringify(profile.roleplayIdentity.archetypes) : 'None'}
            
            Task: Rewrite the user's raw message to match this character's voice, tone, and language. 
            If the profile suggests a specific language (e.g. if name/bio is foreign), translate it. 
            Keep the original meaning but enhance the style. 
            RETURN ONLY THE REWRITTEN MESSAGE. NO QUOTES.
            
            Raw Message: "${text}"
            `;

            const ai = new GoogleGenAI({ apiKey: appSettings.apiKey || process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: context
            });

            const rewritten = result.text;
            if (rewritten) {
                finalContent = rewritten.trim();
            }
        } catch (e) {
            console.error("Failed to rewrite message", e);
            // Fallback to original text if AI fails
            finalContent = text;
        }

        // 3. Update Message with Final Content
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                const msgs = [...s.messages];
                const target = msgs.find(m => m.id === userMsgId);
                if (target) {
                    target.content = finalContent;
                    target.status = 'sent';
                    target.originalContent = text; // Ensure we keep original
                }
                return { ...s, messages: msgs };
            }
            return s;
        }));

        // 4. Proceed with AI Response (Standard Flow)
        // Find latest state of session
        let session = sessions.find(s => s.id === activeSessionId);
        // We need to make sure we have the updated message in the session object we pass to AI
        // Since state update is async, we manually construct the updated session for the AI call
        if (session) {
            const updatedMessages = [...session.messages];
            // The optimistically added message might not be in 'session' variable yet if we just setSessions
            // actually 'session' variable is from closure, so it's stale. 
            // We need to append our new finalized message.
            // But wait, we already added it to state. 
            // Let's just create a temporary session object with the new message for the AI stream function.
            const confirmedMsg = { ...userMsg, content: finalContent, status: 'sent' as const };
            session = { ...session, messages: [...session.messages, confirmedMsg] };
        } else {
            return;
        }

        // Check P2P
        if (session?.isP2P) {
            p2p.sendMessage(finalContent); // Send the rewritten one? Or original? Usually key is "speaking in character"
            return;
        }

        // Check Cloud Room
        if (session?.isFirebaseRoom && session.firebaseRoomId) {
            firestoreService.sendMessage(session.firebaseRoomId, finalContent).catch(e => {
                // handle error
            });
            return;
        }

        // AI Logic
        const aiMsgId = crypto.randomUUID();

        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                return { ...s, messages: [...s.messages, { id: aiMsgId, role: 'model', content: '', timestamp: Date.now(), status: 'streaming' }] };
            }
            return s;
        }));

        const result = await sendMessageStream(
            session, // Use the session with the rewritten user message
            finalContent, // Pass the rewritten content as the last user message prompt
            userProfile,
            (chunk) => {
                setSessions(prev => prev.map(s => {
                    if (s.id === activeSessionId) {
                        const msgs = [...s.messages];
                        const lastMsg = msgs[msgs.length - 1];
                        if (lastMsg.id === aiMsgId) {
                            lastMsg.content = (lastMsg.content || '') + chunk;
                        }
                        return { ...s, messages: msgs };
                    }
                    return s;
                }));
            }
        );

        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                const msgs = [...s.messages];
                const lastMsg = msgs[msgs.length - 1];
                lastMsg.status = result.status;
                lastMsg.content = result.content;
                lastMsg.originalContent = result.original;
                return { ...s, messages: msgs };
            }
            return s;
        }));
    };

    const handleDeleteSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSessions(sessions.filter(s => s.id !== id));
        if (activeSessionId === id) setActiveSessionId(null);
    };

    const handleArchiveSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSessions(sessions.map(s => s.id === id ? { ...s, archived: !s.archived } : s));
        if (activeSessionId === id && !sessions.find(s => s.id === id)?.archived) setActiveSessionId(null);
    };

    return (
        <SessionContext.Provider value={{
            sessions,
            activeSessionId,
            currentView,
            setCurrentView,
            setActiveSessionId,
            sessionTimer,
            handleCreateSession,
            handleJoinAgent,
            handleSend,
            handleDeleteSession,
            handleArchiveSession,
            funnySlogan,
            joinP2P,
            joinCloudRoom,
            createPublicRoom
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
