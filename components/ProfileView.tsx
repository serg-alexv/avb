
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Settings, Sparkles, User, Check, Crown, Sword, HeartHandshake, RefreshCcw, Eye, HandMetal, Feather, Tags, AlertCircle, Cpu, CloudLightning, AlertTriangle, Fingerprint, Ghost, Anchor, Heart, MessageCircle } from 'lucide-react';
import { UserProfile, AppSettings } from '../types';
import { MODELS, INTENSITY_LABELS, ROMANCE_LABELS, EXPERIMENTAL_LABELS } from '../constants';
import RoleplayIdentityBuilder from './RoleplayIdentityBuilder';

const ProfileView = ({ onClose, profile, onUpdate, appSettings, onSaveSettings }: { onClose: () => void, profile: UserProfile, onUpdate: (p: UserProfile) => void, appSettings: AppSettings, onSaveSettings: (s: AppSettings) => void }) => {
    const [aiInput, setAiInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingKinks, setIsGeneratingKinks] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Settings State
    const [localSettings, setLocalSettings] = useState(appSettings);

    const isDark = appSettings.theme === 'dark';
    const textColor = isDark ? 'text-white' : 'text-slate-800';
    const subText = isDark ? 'text-gray-400' : 'text-gray-500';
    const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200';
    const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-purple-100';

    const handleSave = () => {
        setIsSaved(true);
        onSaveSettings(localSettings);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleResetIdentity = () => {
        if (!confirm("Are you sure? This will wipe your current persona details and generate a new anonymous User ID. Your chats will remain.")) return;
        const newProfile: UserProfile = {
            userId: crypto.randomUUID(),
            name: '', bio: '', tone: 'Neutral', tags: [], isAdult: false, mainLanguage: 'English',
            roleplayIdentity: {
                archetypes: [],
                vibeMix: { temperature: 50, heartLevel: 50, spiceLevel: 50 },
                motivations: { tags: [], statement: '' },
                consent: { communicationStyles: [], safetyResponse: 'ask' },
                limits: { softSpots: [], hardLimits: [], showLimitsPublicly: false },
                aftercare: { needs: [], scale: 50 },
                headspace: []
            },
            sexualProfile: { archetype: 'Switch', stats: { intensity: 50, romance: 50, experimental: 50 }, kinks: [], limits: [] }
        };
        onUpdate(newProfile);
    };

    const handleAiGenerate = async () => {
        if (!aiInput.trim()) return;
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a JSON profile based on this user description: "${aiInput}". 
        Schema: { "name": string, "bio": string, "tone": string, "tags": string[] }. 
        Keep bio under 150 chars. Tone should be one word (e.g. Professional, Witty). Tags should be 3-5 keywords.`,
                config: { responseMimeType: 'application/json' }
            });

            const text = response.text;
            if (text) {
                const data = JSON.parse(text);
                onUpdate({
                    ...profile,
                    name: data.name || profile.name,
                    bio: data.bio || profile.bio,
                    tone: data.tone || profile.tone,
                    tags: data.tags || profile.tags
                });
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate profile. Try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateKinks = async (mode: 'dirty' | 'romantic') => {
        if (!profile.sexualProfile) return;
        setIsGeneratingKinks(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const sp = profile.sexualProfile;
            const prompt = `Generate a JSON array of 10 relevant ${mode} tags/keywords for this user profile:
        Bio: "${profile.bio}".
        Archetype: "${sp.archetype}".
        Dynamics: Intensity ${sp.stats.intensity}/100, Romance ${sp.stats.romance}/100, Experimental ${sp.stats.experimental}/100.
        Limits: ${sp.limits.join(', ')}.
        Existing Kinks: ${sp.kinks.join(', ')}.
        Do not include extreme illegal content.
        Schema: { "kinks": string[] }`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const text = response.text;
            if (text) {
                const data = JSON.parse(text);
                if (data.kinks && Array.isArray(data.kinks)) {
                    const newKinks = data.kinks.filter((k: string) => !profile.sexualProfile?.kinks.includes(k));
                    onUpdate({
                        ...profile,
                        sexualProfile: {
                            ...sp,
                            kinks: [...sp.kinks, ...newKinks]
                        }
                    });
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingKinks(false);
        }
    };

    const ArchetypeCard = ({ type, icon, label }: { type: string, icon: any, label: string }) => (
        <button
            onClick={() => onUpdate({ ...profile, sexualProfile: { ...profile.sexualProfile!, archetype: type } })}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all h-24 ${profile.sexualProfile?.archetype === type
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105 ring-2 ring-purple-300'
                : `${isDark ? 'bg-slate-800 border-slate-700 text-purple-300 hover:bg-slate-700' : 'bg-white border-purple-100 text-purple-900 hover:bg-purple-50'}`
                }`}
        >
            <div className="text-2xl mb-1">{icon}</div>
            <span className="text-[10px] font-bold leading-tight text-center">{label}</span>
        </button>
    );

    const getDynamicLabel = (key: string, val: number) => {
        const index = Math.min(Math.floor(val / 10), 9);
        if (key === 'intensity') return INTENSITY_LABELS[index];
        if (key === 'romance') return ROMANCE_LABELS[index];
        if (key === 'experimental') return EXPERIMENTAL_LABELS[index];
        return '';
    };

    return (
        <div className={`flex-1 h-full flex flex-col ${isDark ? 'bg-slate-950' : 'bg-white'} overflow-y-auto relative`}>
            {/* Header / Nav */}
            <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/10 dark:bg-black/10 backdrop-blur-lg border-b border-black/5 dark:border-white/5">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    &larr; Back
                </button>
                <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                    Character & Settings
                </h2>
                <div className="w-20" /> {/* Spacer for centering */}
            </div>

            {!profile.isAdult && (
                <div className="bg-red-50 border-b border-red-200 p-4 text-center text-red-700 text-sm font-medium animate-pulse">
                    <AlertTriangle className="inline mr-2 h-4 w-4" />
                    Application locked. Please confirm age in the sidebar.
                </div>
            )}

            <div className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-12 pb-32">

                {/* AI Builder */}
                <div className={`p-6 rounded-3xl border shadow-sm transition-opacity ${!profile.isAdult ? 'opacity-50 pointer-events-none' : ''} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100'}`}>
                    <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold">
                        <Sparkles size={18} />
                        <span>Magic Auto-Fill</span>
                    </div>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-blue-600/80'}`}>
                        Type a casual description and we'll construct your base profile.
                    </p>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            placeholder="e.g. I'm a sarcastic developer who loves sci-fi..."
                            className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 focus:outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white/80 border-blue-200'}`}
                            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                        />
                        <button
                            onClick={handleAiGenerate}
                            disabled={isGenerating || !aiInput.trim()}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isGenerating ? 'Building...' : 'Generate'}
                        </button>
                    </div>
                </div>

                <div className={`transition-opacity space-y-12 ${!profile.isAdult ? 'opacity-50 pointer-events-none' : ''}`}>

                    {/* --- About Me Block --- */}
                    <div className={`p-8 rounded-3xl border ${cardBg}`}>
                        <h3 className={`font-bold text-xl flex items-center gap-2 mb-6 ${textColor}`}><User size={20} /> About Me - visible to others</h3>

                        <div className="space-y-6">
                            {/* Bio */}
                            <div>
                                <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${subText}`}>BIO</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => onUpdate({ ...profile, bio: e.target.value })}
                                    className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none ${inputBg}`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${subText}`}>Interest Cloud</label>
                                <div className={`p-4 rounded-xl border flex flex-wrap gap-2 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
                                    {profile.tags.map((tag, i) => (
                                        <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${isDark ? 'bg-blue-900/30 text-blue-200 border border-blue-800' : 'bg-white border border-gray-200 shadow-sm text-gray-700'}`}>
                                            <Tags size={12} className="opacity-50" />
                                            {tag}
                                            <button onClick={() => onUpdate({ ...profile, tags: profile.tags.filter((_, idx) => idx !== i) })} className="ml-1 text-gray-400 hover:text-gray-600">×</button>
                                        </span>
                                    ))}
                                    <input
                                        placeholder="+ Add tag..."
                                        className={`px-3 py-1.5 rounded-lg text-sm bg-transparent border border-dashed border-gray-400 outline-none focus:border-blue-500 focus:text-blue-500 w-32 ${subText}`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim();
                                                if (val && !profile.tags.includes(val)) {
                                                    onUpdate({ ...profile, tags: [...profile.tags, val] });
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Kink Cloud */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className={`block text-xs font-bold uppercase tracking-wide ${subText}`}>Kink Cloud</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleGenerateKinks('dirty')} disabled={isGeneratingKinks} className="text-red-500 text-[10px] font-bold hover:underline disabled:opacity-50">
                                            {isGeneratingKinks ? '...' : '+ Random Dirty (10)'}
                                        </button>
                                        <button onClick={() => handleGenerateKinks('romantic')} disabled={isGeneratingKinks} className="text-pink-500 text-[10px] font-bold hover:underline disabled:opacity-50">
                                            {isGeneratingKinks ? '...' : '+ Random Romantic (10)'}
                                        </button>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl border flex flex-wrap gap-2 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
                                    {profile.sexualProfile?.kinks.map((k, i) => (
                                        <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${isDark ? 'bg-purple-900/40 text-purple-200 border border-purple-800' : 'bg-white border border-gray-200 shadow-sm text-gray-700'}`}>
                                            <Feather size={12} className="opacity-50" />
                                            {k}
                                            <button onClick={() => onUpdate({ ...profile, sexualProfile: { ...profile.sexualProfile!, kinks: profile.sexualProfile!.kinks.filter(x => x !== k) } })} className="text-gray-400 hover:text-red-500">×</button>
                                        </span>
                                    ))}
                                    <input
                                        placeholder="+ Add..."
                                        maxLength={20}
                                        className={`px-3 py-1.5 rounded-lg text-sm bg-transparent border border-dashed border-gray-400 outline-none focus:border-blue-500 focus:text-blue-500 w-24 ${subText}`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim();
                                                if (val && !profile.sexualProfile?.kinks.includes(val)) {
                                                    onUpdate({ ...profile, sexualProfile: { ...profile.sexualProfile!, kinks: [...profile.sexualProfile!.kinks, val] } });
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Hard Limits */}
                            <div>
                                <label className={`block text-xs font-bold mb-2 uppercase tracking-wide text-red-500`}>Hard Limits</label>
                                <div className={`p-4 rounded-xl border flex flex-wrap gap-2 ${isDark ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-100'}`}>
                                    {profile.sexualProfile?.limits.map((l, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-bold bg-red-200 text-red-800 flex items-center gap-2">
                                            <AlertTriangle size={12} />
                                            {l}
                                            <button onClick={() => onUpdate({ ...profile, sexualProfile: { ...profile.sexualProfile!, limits: profile.sexualProfile!.limits.filter(x => x !== l) } })} className="hover:text-red-950">×</button>
                                        </span>
                                    ))}
                                    <input
                                        placeholder="+ Add limit..."
                                        className="px-3 py-1.5 rounded-lg text-sm bg-transparent border border-dashed border-red-300 outline-none focus:border-red-500 text-red-500 placeholder-red-300 w-32"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim();
                                                if (val && !profile.sexualProfile?.limits.includes(val)) {
                                                    onUpdate({ ...profile, sexualProfile: { ...profile.sexualProfile!, limits: [...profile.sexualProfile!.limits, val] } });
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>



                        </div>
                    </div>

                    {/* --- Roleplay Identity --- */}
                    {/* Ensure data structure exists before rendering */}
                    {profile.roleplayIdentity ? (
                        <RoleplayIdentityBuilder
                            data={profile.roleplayIdentity}
                            onChange={(newData) => onUpdate({ ...profile, roleplayIdentity: newData })}
                        />
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            <p>Initializing Roleplay Identity system...</p>
                            <button
                                onClick={() => onUpdate({
                                    ...profile,
                                    roleplayIdentity: {
                                        archetypes: [],
                                        vibeMix: { temperature: 50, heartLevel: 50, spiceLevel: 50 },
                                        motivations: { tags: [], statement: '' },
                                        consent: { communicationStyles: [], safetyResponse: 'ask' },
                                        limits: { softSpots: [], hardLimits: [], showLimitsPublicly: false },
                                        aftercare: { needs: [], scale: 50 },
                                        headspace: []
                                    }
                                })}
                                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Enable Roleplay Identity
                            </button>
                        </div>
                    )}

                    {/* System Settings */}
                    <div className="pt-8 border-t border-gray-200">
                        <h3 className={`font-bold text-xl mb-6 flex items-center gap-2 ${textColor}`}><Cpu size={20} /> System & Config</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* API Key */}
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wide ${subText}`}>Google AI API Key</label>
                                <input
                                    type="password"
                                    value={localSettings.apiKey}
                                    onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                                    className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${inputBg}`}
                                    placeholder="Enter your Gemini API Key"
                                />
                            </div>
                            {/* Model Selection */}
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wide ${subText}`}>Default AI Model</label>
                                <select
                                    value={localSettings.defaultModel}
                                    onChange={(e) => setLocalSettings({ ...localSettings, defaultModel: e.target.value })}
                                    className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${inputBg}`}
                                >
                                    {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>
                            {/* Firebase Config */}
                            <div className="space-y-2 md:col-span-2">
                                <label className={`text-xs font-bold uppercase tracking-wide ${subText}`}>Firebase Config (JSON)</label>
                                <textarea
                                    value={localSettings.firebaseConfig}
                                    onChange={(e) => setLocalSettings({ ...localSettings, firebaseConfig: e.target.value })}
                                    className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs h-24 ${inputBg}`}
                                    placeholder='{"apiKey": "...", "authDomain": "...", "projectId": "..."}'
                                />
                                <p className="text-[10px] text-gray-500">Required for cloud sync. Leave empty for local-only.</p>
                            </div>

                            {/* Identity Management */}
                            <div className="md:col-span-2 p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-200 rounded-lg text-gray-500"><Fingerprint size={20} /></div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase">Your Anonymous User ID</div>
                                        <div className="font-mono text-sm text-gray-700 select-all">{profile.userId}</div>
                                    </div>
                                </div>
                                <button onClick={handleResetIdentity} className="px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
                                    Reset Identity
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 ${isSaved ? 'bg-green-500' : 'bg-slate-900 hover:bg-slate-800'}`}
                            >
                                {isSaved ? <Check size={18} /> : <CloudLightning size={18} />}
                                {isSaved ? 'Saved!' : 'Save System Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
