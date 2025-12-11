import React from 'react';
import { MessageSquare, Globe, Compass, Search, Archive, Trash2, ArchiveRestore, Sun, Moon, Settings, Check, User as UserIcon, Users, Laptop, Zap } from 'lucide-react';
import { Session, UserProfile } from '../types';
import { LANGUAGES_WITH_FLAGS, MOOD_SUGGESTIONS, DISCOVERY_AGENTS } from '../constants';
import { CountdownTimer } from './CountdownTimer';
import { getSessionPalette } from '../lib/utils';
import { motion } from 'framer-motion';
import MoodSelector from './MoodSelector';

import { useTranslation } from 'react-i18next';

interface SidebarProps {
    userProfile: UserProfile;
    activeSessionsList: Session[];
    archivedSessionsList: Session[];
    activeSessionId: string | null;
    currentView: 'chat' | 'discovery' | 'profile';
    funnySlogan: string;
    sessionTimer: number;
    isDark: boolean;
    currentTheme: 'light' | 'dark' | 'system';
    isWizardOpen: boolean;
    handleUpdateProfile: (u: Partial<UserProfile>) => void;
    setCurrentView: (v: 'chat' | 'discovery' | 'profile') => void;
    setActiveSessionId: (id: string | null) => void;
    setIsWizardOpen: (o: boolean) => void;
    handleArchiveSession: (id: string, e: React.MouseEvent) => void;
    handleDeleteSession: (id: string, e: React.MouseEvent) => void;
    toggleTheme: () => void;
    fetchFunnyRule: (e: React.MouseEvent) => void;
    onOpenLegal: (type: 'privacy' | 'terms' | 'rules') => void;
}

const Sidebar = ({
    userProfile, activeSessionsList, archivedSessionsList, activeSessionId, currentView, funnySlogan, sessionTimer, isDark, currentTheme, isWizardOpen,
    handleUpdateProfile, setCurrentView, setActiveSessionId, setIsWizardOpen, handleArchiveSession, handleDeleteSession, toggleTheme, fetchFunnyRule, onOpenLegal
}: SidebarProps) => {
    const { i18n } = useTranslation();

    React.useEffect(() => {
        if (!userProfile.name) {
            const randomNames = ["VibeSeeker", "Ghost", "Echo", "Shadow", "Neon", "Pixel", "Glitch", "Cipher", "Nova", "Flux"];
            handleUpdateProfile({ name: randomNames[Math.floor(Math.random() * randomNames.length)] });
        }
    }, []);

    const handleNameBlur = () => {
        if (!userProfile.name.trim()) {
            const randomNames = ["VibeSeeker", "Ghost", "Echo", "Shadow", "Neon", "Pixel", "Glitch", "Cipher", "Nova", "Flux"];
            handleUpdateProfile({ name: randomNames[Math.floor(Math.random() * randomNames.length)] });
        }
    };

    return (
        <div className={`w-80 h-full border-r flex flex-col shrink-0 transition-all duration-300 z-20 backdrop-blur-md ${isDark ? 'bg-slate-950/70 border-white/5' : 'bg-white/70 border-slate-100'}`}>
            {/* Header: Brand & Profile Actions */}
            <div className={`p-4 flex flex-col gap-4 sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-slate-950/80' : 'bg-white/80'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10 relative overflow-hidden group cursor-pointer" onClick={fetchFunnyRule}>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <MessageSquare className="text-white relative z-10 fill-current" size={20} />
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white/20 blur-lg rounded-full" />
                    </div>
                    <div onClick={fetchFunnyRule} className="cursor-pointer group">
                        <h1 className={`font-black text-lg tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500 ${isDark ? 'to-white' : 'to-slate-700'}`}>Anonvibe</h1>
                        <p className={`text-[10px] font-bold mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{funnySlogan}</p>
                    </div>

                    {/* Language (Compact) */}
                    <div className="ml-auto relative group">
                        <select
                            className={`text-[10px] font-bold bg-transparent appearance-none cursor-pointer outline-none text-right transition-colors ${isDark ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                            value={i18n.language}
                            onChange={(e) => {
                                const newLang = e.target.value; // Expecting code like 'en', 'es'
                                i18n.changeLanguage(newLang);
                                handleUpdateProfile({ mainLanguage: newLang });
                            }}
                        >
                            {LANGUAGES_WITH_FLAGS.map(l => (
                                <option key={l.code} value={l.code.toLowerCase().slice(0, 2) === 'ch' ? 'zh' : l.code.toLowerCase().slice(0, 2)}>{l.flag} {l.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Profile Card (Mini) */}
                <div className={`p-3 rounded-2xl flex items-center gap-3 border shadow-sm transition-all duration-300 ${isDark
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-offset-2 ${isDark ? 'ring-offset-slate-950 ring-slate-800 bg-slate-800 text-white' : 'ring-offset-white ring-white bg-white shadow-sm text-slate-700'}`}>
                        {userProfile.name?.[0]?.toUpperCase() || <UserIcon size={14} />}
                    </div>
                    <div className="flex-1 min-w-0 group">
                        <input
                            value={userProfile.name}
                            onChange={(e) => handleUpdateProfile({ name: e.target.value })}
                            onBlur={handleNameBlur}
                            placeholder="Your Name"
                            className={`w-full bg-transparent text-sm font-bold outline-none placeholder-opacity-50 transition-colors ${isDark ? 'text-white placeholder-slate-600 group-hover:text-blue-300' : 'text-slate-900 placeholder-slate-400 group-hover:text-blue-600'}`}
                        />
                        <MoodSelector
                            value={userProfile.tone}
                            onChange={(val) => handleUpdateProfile({ tone: val })}
                            suggestions={MOOD_SUGGESTIONS}
                            isDark={isDark}
                        />
                    </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => { setCurrentView('discovery'); setActiveSessionId(null); }}
                        disabled={!userProfile.isAdult}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-300 text-xs font-bold shadow-sm ${currentView === 'discovery'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 scale-[1.02]'
                            : `${isDark ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                            }`}
                    >
                        <Compass size={14} className={currentView === 'discovery' ? 'animate-spin-slow' : ''} /> Discovery
                    </button>
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        disabled={!userProfile.isAdult}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-300 text-xs font-bold shadow-sm ${isWizardOpen
                            ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/25 scale-[1.02]'
                            : `${isDark ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                            }`}
                    >
                        <Search size={14} /> New Chat
                    </button>
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 min-h-0 custom-scrollbar">
                {activeSessionsList.length > 0 && <h3 className="px-2 mb-2 text-[9px] font-bold uppercase tracking-widest opacity-40">Active sessions</h3>}

                {activeSessionsList.map(s => {
                    const palette = getSessionPalette(s.id);
                    const isActive = activeSessionId === s.id;
                    const agent = DISCOVERY_AGENTS.find(a => a.id === s.agentId);

                    return (
                        <div
                            key={s.id}
                            onClick={() => { setActiveSessionId(s.id); setCurrentView('chat'); }}
                            className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${isActive
                                ? `bg-white dark:bg-white/5 shadow-md ${isDark ? 'border-white/10' : 'border-slate-100'} scale-[1.02]`
                                : 'hover:bg-slate-50 dark:hover:bg-white/5 hover:scale-[1.01]'
                                }`}
                        >
                            {/* Active Indicator Bar */}
                            {isActive && <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${palette.bg.replace('bg-', 'bg-').replace('-50', '-500')}`} />}

                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110 ${isActive ? palette.bg : (isDark ? 'bg-white/5' : 'bg-white border border-slate-100')
                                    }`}>
                                    {s.fluentAvatar ? (
                                        <img src={s.fluentAvatar} alt="icon" className="w-8 h-8 object-contain drop-shadow-sm" />
                                    ) : (
                                        s.config.emoji
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className={`font-bold text-sm truncate ${isActive ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-400' : 'text-slate-700')}`}>
                                            {s.title}
                                        </h4>
                                        {['59m', '24h'].includes(s.config.privacy) && (
                                            <span className="text-[9px] opacity-60 font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">
                                                <CountdownTimer targetDate={s.updatedAt + (s.config.privacy === '59m' ? 3540000 : 86400000)} />
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1 opacity-60 text-[9px] font-bold uppercase tracking-wide">
                                        {/* Status Dot */}
                                        <div className={`w-1.5 h-1.5 rounded-full ${s.config.safety.nsfw ? 'bg-red-500' : 'bg-emerald-500'} shadow-[0_0_5px_rgba(0,0,0,0.2)]`} />

                                        <span className={`${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {s.isP2P ? 'Direct' : (s.isFirebaseRoom ? (s.firebaseRoomId ? 'Live' : 'Connecting...') : 'Bot')}
                                        </span>

                                        {/* Show Agent Tags */}
                                        {agent?.tags?.slice(0, 1).map(tag => (
                                            <span key={tag} className={`px-1 py-0.5 rounded text-[8px] border ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 p-1 pr-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-sm rounded-lg border border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-right-2 duration-200">
                                <button onClick={(e) => handleArchiveSession(s.id, e)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition-colors"><Archive size={14} className="opacity-60" /></button>
                                <button onClick={(e) => handleDeleteSession(s.id, e)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors group/trash"><Trash2 size={14} className="text-slate-400 group-hover/trash:text-red-500 transition-colors" /></button>
                            </div>
                        </div>
                    );
                })}

                {activeSessionsList.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 opacity-30 select-none">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                            <MessageSquare size={24} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs font-bold">No active chats</p>
                    </div>
                )}

                {/* Archived Chats */}
                {archivedSessionsList.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-dashed border-slate-200 dark:border-white/5">
                        <h3 className="px-2 mb-2 text-[9px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                            <Archive size={10} /> Archived ({archivedSessionsList.length})
                        </h3>
                        <div className="space-y-1">
                            {archivedSessionsList.map(s => (
                                <div key={s.id} className="p-2 rounded-lg opacity-50 hover:opacity-100 transition-all hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 group cursor-pointer">
                                    <span className="text-sm grayscale">{s.config.emoji}</span>
                                    <span className="text-xs font-medium flex-1 truncate">{s.title}</span>
                                    <button onClick={(e) => handleArchiveSession(s.id, e)} className="p-1 hover:bg-slate-200 dark:hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"><ArchiveRestore size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${isDark ? 'border-white/5 bg-slate-950' : 'border-slate-100 bg-slate-50/50'}`}>
                {/* Settings & Theme */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentView('profile')}
                        className={`flex-1 flex items-center gap-3 p-2.5 rounded-xl transition-all border group ${currentView === 'profile'
                            ? 'bg-slate-800 text-white border-slate-700/50 shadow-lg'
                            : `${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' : 'bg-white border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700'} shadow-sm`
                            }`}
                    >
                        <div className={`p-1.5 rounded-lg bg-inherit group-hover:scale-110 transition-transform`}>
                            <Settings size={16} className={currentView === 'profile' ? 'text-white' : 'opacity-60'} />
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold">Settings</div>
                            <div className="text-[9px] opacity-60 leading-none mt-0.5 font-medium">Global Config</div>
                        </div>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-xl border transition-all ${isDark
                            ? 'bg-white/5 border-white/5 hover:bg-white/10 text-yellow-300 shadow-inner'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 shadow-sm'}`}
                        title={`Theme: ${currentTheme}`}
                    >
                        {currentTheme === 'light' && <Sun size={18} className="fill-current" />}
                        {currentTheme === 'dark' && <Moon size={18} className="fill-current" />}
                        {currentTheme === 'system' && <Laptop size={18} className="opacity-70" />}
                    </button>
                </div>

                {/* 18+ Label and Rules */}
                <div className="flex items-center justify-between mt-4 px-1">
                    <div className="flex gap-4">
                        {[
                            { id: 'privacy', label: 'rivacy Policy', short: 'P' },
                            { id: 'terms', label: 'erms of Service', short: 'T' },
                            { id: 'rules', label: 'ules', short: 'R' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onOpenLegal(item.id as any)}
                                className="group flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-all relative"
                            >
                                <span className="relative z-10 drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-slate-300 group-hover:text-blue-500 transition-colors">
                                    {item.short}
                                </span>
                                <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] whitespace-nowrap opacity-0 group-hover:opacity-100 flex items-center">
                                    <span className="ml-[1px]">{item.label}</span>
                                </span>
                            </button>
                        ))}
                    </div>

                    <div
                        className="flex items-center gap-2 group cursor-pointer"
                        onClick={() => handleUpdateProfile({ isAdult: !userProfile.isAdult })}
                    >
                        <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${userProfile.isAdult ? 'text-blue-500' : 'text-slate-400'}`}>18+ Mode</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${userProfile.isAdult ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${userProfile.isAdult ? 'left-[18px]' : 'left-[2px]'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
