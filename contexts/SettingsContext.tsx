import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { DEFAULT_MODEL, FIREBASE_CONFIG } from '../constants';
import { Storage } from '../services/storage';

interface SettingsContextType {
    appSettings: AppSettings;
    updateSettings: (start: AppSettings) => void;
    toggleTheme: () => void;
    isDark: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appSettings, setAppSettings] = useState<AppSettings>(() => {
        const stored = Storage.get('app_settings', { apiKey: '', firebaseConfig: '', theme: 'system', defaultModel: DEFAULT_MODEL });
        if (!stored.firebaseConfig) {
            stored.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
        }
        return stored;
    });

    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const updateSettings = (s: AppSettings) => {
        setAppSettings(s);
        Storage.set('app_settings', s);
    };

    const toggleTheme = () => {
        setAppSettings(p => {
            const next: AppSettings['theme'] = p.theme === 'light' ? 'dark' : p.theme === 'dark' ? 'system' : 'light';
            const newSettings = { ...p, theme: next };
            Storage.set('app_settings', newSettings);
            return newSettings;
        });
    };

    const isDark = appSettings.theme === 'system' ? systemTheme === 'dark' : appSettings.theme === 'dark';

    return (
        <SettingsContext.Provider value={{ appSettings, updateSettings, toggleTheme, isDark }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
