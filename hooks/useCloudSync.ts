import { useState, useEffect } from 'react';
import { firestoreService } from '../services/firestore';
import { Message } from '../types';

export const useCloudSync = (
    activeSessionId: string | null,
    isFirebaseRoom: boolean | undefined,
    firebaseRoomId: string | undefined,
    onMessagesUpdate: (msgs: Message[]) => void
) => {
    useEffect(() => {
        if (activeSessionId && isFirebaseRoom && firebaseRoomId) {
            // Subscribe
            firestoreService.subscribeToMessages(firebaseRoomId, (msgs) => {
                onMessagesUpdate(msgs);
            });

            return () => {
                firestoreService.unsubscribe(firebaseRoomId);
            };
        }
    }, [activeSessionId, isFirebaseRoom, firebaseRoomId]);
};
