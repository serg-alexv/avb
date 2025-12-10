import React from 'react';
import { MessageSquare, Globe, Compass, Search, Archive, Trash2, ArchiveRestore, Sun, Moon, Settings, Check, User as UserIcon, Users, Laptop } from 'lucide-react';
import { Session, UserProfile } from '../types';
import { LANGUAGES_WITH_FLAGS, MOOD_SUGGESTIONS, DISCOVERY_AGENTS } from '../constants';
import { CountdownTimer } from './ChatInterface';
import { getSessionPalette } from '../lib/utils';

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
}

const formatTime = (t: number) => {
    const h = Math.floor(t / 3600).toString().padStart(2, '0');
    const m = Math.floor((t % 3600) / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const Sidebar = ({
    userProfile, activeSessionsList, archivedSessionsList, activeSessionId, currentView, funnySlogan, sessionTimer, isDark, currentTheme, isWizardOpen,
    handleUpdateProfile, setCurrentView, setActiveSessionId, setIsWizardOpen, handleArchiveSession, handleDeleteSession, toggleTheme, fetchFunnyRule
}: SidebarProps) => {

    React.useEffect(() => {
        if (!userProfile.name) {
            const randomNames = ["VibeSeeker", "Ghost", "Echo", "Shadow", "Neon", "Pixel", "Glitch", "Cipher", "Nova", "Flux"];
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
            handleUpdateProfile({ name: randomName });
        }
    }, []);

    const handleNameBlur = () => {
        if (!userProfile.name.trim()) {
            const randomNames = ["VibeSeeker", "Ghost", "Echo", "Shadow", "Neon", "Pixel", "Glitch", "Cipher", "Nova", "Flux"];
            handleUpdateProfile({ name: randomNames[Math.floor(Math.random() * randomNames.length)] });
        }
    };

    return (
        <div className={`w-80 h-full border-r flex flex-col shrink-0 transition-all duration-300 z-20 ${isDark ? 'bg-slate-950 border-white/5' : 'bg-white border-gray-100'}`}>
            {/* Header: Brand & Profile Actions */}
            <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <MessageSquare className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className={`font-bold text-lg tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Anonvibe</h1>
                        <p className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{funnySlogan}</p>
                    </div>

                    {/* Language (Compact) */}
                    <div className="ml-auto relative group">
                        <select
                            className={`text-[10px] font-bold bg-transparent appearance-none cursor-pointer outline-none text-right ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-slate-600'}`}
                            value={userProfile.mainLanguage}
                            onChange={(e) => handleUpdateProfile({ mainLanguage: e.target.value })}
                        >
                            {LANGUAGES_WITH_FLAGS.map(l => (
                                <option key={l.code} value={l.label}>{l.flag} {l.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Profile Card (Mini) */}
                <div className={`p-3 rounded-2xl flex items-center gap-3 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-white border border-gray-200 text-slate-700'}`}>
                        {userProfile.name?.[0]?.toUpperCase() || <UserIcon size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <input
                            value={userProfile.name}
                            onChange={(e) => handleUpdateProfile({ name: e.target.value })}
                            onBlur={handleNameBlur}
                            placeholder="Your Name"
                            className={`w-full bg-transparent text-sm font-bold outline-none placeholder-opacity-50 ${isDark ? 'text-white placeholder-gray-600' : 'text-slate-900 placeholder-gray-400'}`}
                        />
                        <input
                            list="moods"
                            value={userProfile.tone}
                            onChange={(e) => handleUpdateProfile({ tone: e.target.value })}
                            placeholder="Current Mood..."
                            className={`w-full bg-transparent text-[10px] font-medium outline-none mt-0.5 ${isDark ? 'text-gray-400 placeholder-gray-600' : 'text-gray-500 placeholder-gray-400'}`}
                        />
                    </div>
                </div>
                <datalist id="moods">
                    {MOOD_SUGGESTIONS.map(m => <option key={m} value={m} />)}
                </datalist>

                {/* Main Actions */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => { setCurrentView('discovery'); setActiveSessionId(null); }}
                        disabled={!userProfile.isAdult}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all text-sm font-bold ${currentView === 'discovery'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                            : `${isDark ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'}`
                            }`}
                    >
                        <Compass size={16} /> Discovery
                        <div className={`w-2 h-2 rounded-full ${userProfile.isAdult ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    </button>
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        disabled={!userProfile.isAdult}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all text-sm font-bold ${isWizardOpen
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
                            : `${isDark ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'}`
                            }`}
                    >
                        <Search size={16} /> New Chat
                    </button>
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 min-h-0">
                {activeSessionsList.length > 0 && <h3 className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider opacity-40">Active sessions</h3>}

                {activeSessionsList.map(s => {
                    const palette = getSessionPalette(s.id);
                    const isActive = activeSessionId === s.id;
                    const agent = DISCOVERY_AGENTS.find(a => a.id === s.agentId);

                    return (
                        <div
                            key={s.id}
                            onClick={() => { setActiveSessionId(s.id); setCurrentView('chat'); }}
                            className={`group relative p-3 rounded-xl cursor-pointer transition-all border border-transparent ${isActive
                                ? `bg-white dark:bg-white/10 shadow-sm ${isDark ? 'border-white/10' : 'border-gray-200/50'}`
                                : 'hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            {/* Active Indicator Bar */}
                            {isActive && <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${palette.bg.replace('bg-', 'bg-').replace('-50', '-500')}`} />}

                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm ${isActive ? palette.bg : (isDark ? 'bg-white/5' : 'bg-gray-100')
                                    }`}>
                                    {s.config.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className={`font-bold text-sm truncate ${isActive ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-gray-300' : 'text-slate-700')}`}>
                                            {s.title}
                                        </h4>
                                        {['59m', '24h'].includes(s.config.privacy) && (
                                            <span className="text-[10px] opacity-50 font-mono">
                                                <CountdownTimer targetDate={s.updatedAt + (s.config.privacy === '59m' ? 3540000 : 86400000)} />
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5 opacity-60 text-[10px] font-medium">
                                        <div className={`w-1.5 h-1.5 rounded-full ${s.config.safety.nsfw ? 'bg-red-400' : 'bg-emerald-400'}`} />
                                        <span className="truncate mr-1">{s.config.mode === 'group_3' ? 'Group' : 'Direct'}</span>
                                        {/* Show Config Tags */}
                                        <span className={`px-1 rounded-md text-[9px] border ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                                            {s.config.safety.nsfw ? 'NSFW' : 'Safe'}
                                        </span>
                                        {/* Show Agent Tags */}
                                        {agent?.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className={`px-1 rounded-md text-[9px] border ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 p-1 pr-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-lg">
                                <button onClick={(e) => handleArchiveSession(s.id, e)} className="p-1.5 hover:bg-black/5 rounded-md"><Archive size={14} className="opacity-60" /></button>
                                <button onClick={(e) => handleDeleteSession(s.id, e)} className="p-1.5 hover:bg-black/5 rounded-md"><Trash2 size={14} className="text-red-500 opacity-80" /></button>
                            </div>
                        </div>
                    );
                })}

                {activeSessionsList.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 opacity-40">
                        <MessageSquare size={32} strokeWidth={1.5} className="mb-2" />
                        <p className="text-xs font-medium">No chats yet</p>
                    </div>
                )}

                {/* Archived Chats */}
                {archivedSessionsList.length > 0 && (
                    <div className="mt-6">
                        <h3 className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider opacity-40 flex items-center gap-2">
                            <Archive size={10} /> Archived
                        </h3>
                        <div className="space-y-1">
                            {archivedSessionsList.map(s => (
                                <div key={s.id} className="p-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity flex items-center gap-3">
                                    <span className="text-base grayscale">{s.config.emoji}</span>
                                    <span className="text-xs flex-1 truncate">{s.title}</span>
                                    <button onClick={(e) => handleArchiveSession(s.id, e)} className="p-1 hover:bg-black/5 rounded"><ArchiveRestore size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${isDark ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50/50'}`}>
                {/* Settings & Theme */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentView('profile')}
                        className={`flex-1 flex items-center gap-3 p-2.5 rounded-xl transition-all border ${currentView === 'profile'
                            ? 'bg-slate-800 text-white border-slate-700/50 shadow-lg'
                            : `${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50 text-slate-700'}`
                            }`}
                    >
                        <Settings size={18} className="opacity-80" />
                        <div className="text-left">
                            <div className="text-xs font-bold">Settings</div>
                            <div className="text-[10px] opacity-60 leading-none">Global Config</div>
                        </div>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 text-yellow-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-slate-400'}`}
                        title={`Theme: ${currentTheme}`}
                    >
                        {currentTheme === 'light' && <Sun size={18} />}
                        {currentTheme === 'dark' && <Moon size={18} />}
                        {currentTheme === 'system' && <Laptop size={18} className="opacity-70" />}
                    </button>
                </div>

                {/* 18+ Label */}
                {/* 18+ Label and Rules */}
                <div className="flex items-center justify-between mt-3 px-1">
                    <div className="flex gap-3">
                        {['Privacy', 'Terms', 'Rules'].map(item => (
                            <button
                                key={item}
                                onClick={() => alert(`${item}: soon`)}
                                className="text-[10px] font-bold opacity-40 uppercase tracking-widest hover:opacity-100 hover:text-blue-500 transition-colors"
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div
                        className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => handleUpdateProfile({ isAdult: !userProfile.isAdult })}
                    >
                        <span className="text-[10px] font-medium">18+ Mode</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${userProfile.isAdult ? 'bg-blue-600' : 'bg-gray-300 dark:bg-white/20'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm`} style={{ left: userProfile.isAdult ? '18px' : '2px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
