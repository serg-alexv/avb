import React, { useEffect } from 'react';
import { p2pService } from '../services/p2p';
import { Message, Session } from '../types';

export const useP2P = (
    sessions: Session[],
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>,
    t: (key: string) => string
) => {
    useEffect(() => {
        p2pService.onMessageReceived = (msg) => {
            setSessions(prev => prev.map(s => {
                if (s.isP2P && s.id === p2pService.channelId) {
                    return {
                        ...s,
                        messages: [...s.messages, {
                            id: crypto.randomUUID(),
                            role: 'model', // Appear as "model" (left side)
                            content: msg,
                            timestamp: Date.now(),
                            status: 'sent'
                        }],
                        updatedAt: Date.now()
                    };
                }
                return s;
            }));
        };

        p2pService.onConnectionStateChange = (state) => {
            if (state === 'connected') {
                setSessions(prev => prev.map(s => {
                    if (s.isP2P && s.id === p2pService.channelId) {
                        return {
                            ...s,
                            messages: [...s.messages, {
                                id: crypto.randomUUID(),
                                role: 'model',
                                content: t('p2p.connected'),
                                timestamp: Date.now(),
                                status: 'sent'
                            }]
                        };
                    }
                    return s;
                }));
            }
        };

        return () => { p2pService.disconnect(); };
    }, [setSessions, t]);

    return p2pService;
};
