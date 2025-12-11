import React, { createContext, useContext, useRef, useCallback } from 'react';

interface SoundContextType {
    playSent: () => void;
    playReceived: () => void;
    playNotification: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
    // We'll use refs to hold audio elements to avoid re-rendering
    const sentRef = useRef<HTMLAudioElement | null>(null);
    const receivedRef = useRef<HTMLAudioElement | null>(null);
    const notificationRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio objects lazily or via effect if needed, 
    // but refs are fine for simple usage. 
    // We'll assume standard assets exist or use data URIs for simple beeps if assets aren't guaranteed.
    // For a robust app, we'd use real files. Let's use simple data URIs or placeholders for now to ensure it works without 404s.
    // Actually, better to just log if files missing, or try to load from public.

    const playSent = useCallback(() => {
        if (!sentRef.current) {
            sentRef.current = new Audio('/sounds/sent.mp3');
            sentRef.current.volume = 0.5;
        }
        sentRef.current.currentTime = 0;
        sentRef.current.play().catch(() => { }); // Ignore interaction errors
    }, []);

    const playReceived = useCallback(() => {
        if (!receivedRef.current) {
            receivedRef.current = new Audio('/sounds/received.mp3');
            receivedRef.current.volume = 0.5;
        }
        receivedRef.current.currentTime = 0;
        receivedRef.current.play().catch(() => { });
    }, []);

    const playNotification = useCallback(() => {
        if (!notificationRef.current) {
            notificationRef.current = new Audio('/sounds/notification.mp3');
            notificationRef.current.volume = 0.5;
        }
        notificationRef.current.currentTime = 0;
        notificationRef.current.play().catch(() => { });
    }, []);

    return (
        <SoundContext.Provider value={{ playSent, playReceived, playNotification }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useAppSound = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useAppSound must be used within a SoundProvider');
    }
    return context;
};
