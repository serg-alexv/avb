import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from "@google/genai";
import { useSettings } from './SettingsContext';
import { useSession } from './SessionContext';
import { ChatConfig } from '../types';

// Dynamic Imports
const RulePopup = React.lazy(() => import('../components/RulePopup'));
const RoomModal = React.lazy(() => import('../components/RoomModal'));
const LegalModal = React.lazy(() => import('../components/LegalModal'));

type LegalType = 'privacy' | 'terms' | 'rules';

interface ModalContextType {
    openRulePopup: () => void;
    openRoomModal: () => void;
    openLegalModal: (type: LegalType) => void;
    closeAll: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();
    const { appSettings } = useSettings();
    const { joinCloudRoom, createPublicRoom } = useSession();

    // State
    const [rulePopup, setRulePopup] = useState<{ show: boolean, text: string, loading: boolean }>({ show: false, text: '', loading: false });
    const [roomModal, setRoomModal] = useState<{ show: boolean, loading: boolean, error: string | null }>({ show: false, loading: false, error: null });
    const [legalModal, setLegalModal] = useState<{ show: boolean, type: LegalType | null }>({ show: false, type: null });

    // --- Actions ---

    const openRulePopup = async () => {
        setRulePopup({ show: true, text: '', loading: true });
        try {
            const ai = new GoogleGenAI({ apiKey: appSettings.apiKey || process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'Generate a short, funny, witty, and slightly scandalous "rule" for an anonymous NSFW chat app user. Max 15 words. Paradoxical style.',
            });
            setRulePopup({ show: true, text: response.text || t('rules.rule_404'), loading: false });
        } catch {
            setRulePopup({ show: true, text: t('rules.rule_1'), loading: false });
        }
    };

    const activeRoomModalActions = async (action: 'join' | 'create', payload: { roomId?: string, topic?: string, mode?: ChatConfig['mode'] }) => {
        setRoomModal(p => ({ ...p, loading: true, error: null }));
        try {
            if (action === 'join') {
                const id = payload.roomId?.trim() || crypto.randomUUID().slice(0, 8);
                await joinCloudRoom(id, payload.mode || '1:1', payload.topic);
            } else {
                if (!payload.topic) throw new Error("Topic required");
                const id = await createPublicRoom(payload.topic);
                await joinCloudRoom(id, payload.mode || '1:1', payload.topic);
            }
            setRoomModal(p => ({ ...p, show: false, loading: false }));
        } catch (e: any) {
            console.error(e);
            let errorMsg = t('errors.failed_connect_generic');
            if (e.message?.includes("permission-denied") || e.code === 'permission-denied') {
                errorMsg = t('errors.permission_denied');
            }
            setRoomModal(p => ({ ...p, loading: false, error: errorMsg }));
        }
    };

    const openRoomModal = () => setRoomModal({ show: true, loading: false, error: null });
    const openLegalModal = (type: LegalType) => setLegalModal({ show: true, type });
    const closeAll = () => {
        setRulePopup(p => ({ ...p, show: false }));
        setRoomModal(p => ({ ...p, show: false }));
        setLegalModal({ show: false, type: null });
    };

    return (
        <ModalContext.Provider value={{ openRulePopup, openRoomModal, openLegalModal, closeAll }}>
            {children}

            {/* Mounted Modals */}
            {rulePopup.show && (
                <React.Suspense fallback={null}>
                    <RulePopup
                        show={rulePopup.show}
                        text={rulePopup.text}
                        loading={rulePopup.loading}
                        onClose={() => setRulePopup(p => ({ ...p, show: false }))}
                    />
                </React.Suspense>
            )}

            {roomModal.show && (
                <React.Suspense fallback={null}>
                    <RoomModal
                        show={roomModal.show}
                        loading={roomModal.loading}
                        error={roomModal.error}
                        onJoinPrivate={(id, mode) => activeRoomModalActions('join', { roomId: id, mode })}
                        onCreatePublic={(topic, mode) => activeRoomModalActions('create', { topic, mode })}
                        onCancel={() => setRoomModal(p => ({ ...p, show: false }))}
                    />
                </React.Suspense>
            )}

            {legalModal.show && (
                <React.Suspense fallback={null}>
                    <LegalModal
                        show={legalModal.show}
                        type={legalModal.type}
                        onClose={() => setLegalModal({ show: false, type: null })}
                    />
                </React.Suspense>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
