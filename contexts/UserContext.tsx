import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { DEFAULT_USER_PROFILE } from '../constants';
import { Storage } from '../services/storage';

interface UserContextType {
    userProfile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => void;
    isWizardOpen: boolean;
    setWizardOpen: (open: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<UserProfile>(() => {
        const p = Storage.get('user_profile', DEFAULT_USER_PROFILE);
        if (!p.userId) p.userId = crypto.randomUUID();
        return p;
    });

    const [isWizardOpen, setWizardOpen] = useState(false);

    const updateProfile = (updates: Partial<UserProfile>) => {
        const newProfile = { ...userProfile, ...updates };
        setUserProfile(newProfile);
        Storage.set('user_profile', newProfile);
    };

    return (
        <UserContext.Provider value={{ userProfile, updateProfile, isWizardOpen, setWizardOpen }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
