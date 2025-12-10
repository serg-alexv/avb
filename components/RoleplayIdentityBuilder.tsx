import React from 'react';
import {
    Zap, Heart, Skull, Crown, Ghost, Sparkles, Activity, Shield,
    MessageCircle, Anchor, AlertTriangle, ThermometerSun, Brain
} from 'lucide-react';
import { RoleplayIdentity } from '../types';
import { motion } from 'framer-motion';

const LobeCard = ({ children, className = '', onClick, selected }: { children: React.ReactNode, className?: string, onClick?: () => void, selected?: boolean }) => (
    <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl border transition-all duration-200 cursor-pointer ${selected
            ? 'bg-blue-50 border-blue-500 shadow-md transform scale-[1.02]'
            : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
            } ${className}`}
    >
        {selected && (
            <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500 rounded-bl-2xl flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
            </div>
        )}
        {children}
    </div>
);

const LobeSlider = ({
    label, value, onChange, minLabel, maxLabel, icon: Icon
}: {
    label: string, value: number, onChange: (v: number) => void,
    minLabel: string, maxLabel: string, icon: any
}) => (
    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <Icon size={16} className="text-blue-500" />
            {label}
            <span className="ml-auto font-mono text-xs opacity-50">{value}%</span>
        </div>
        <input
            type="range" min="0" max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none accent-blue-600 dark:bg-slate-800"
        />
        <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
        </div>
    </div>
);

const RoleplayIdentityBuilder = ({ data, onChange }: { data: RoleplayIdentity, onChange: (d: RoleplayIdentity) => void }) => {

    const toggle = (arr: string[], val: string) =>
        arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

    const update = (patch: Partial<RoleplayIdentity>) => onChange({ ...data, ...patch });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg shadow-purple-500/20 mb-2">
                    <Sparkles className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Roleplay Identity</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">Define your psychological profile and roleplay dynamics to find compatible partners.</p>
            </div>

            {/* 1. Core Archetypes */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Crown size={14} /> Core Archetypes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { id: 'lead', l: 'Lead', d: 'Takes control', i: '🦁' },
                        { id: 'switch', l: 'Switch', d: 'Adapts flow', i: '🔄' },
                        { id: 'muse', l: 'Muse', d: 'Inspires play', i: '✨' },
                        { id: 'observer', l: 'Observer', d: 'Watches all', i: '👁️' },
                    ].map(item => (
                        <LobeCard
                            key={item.id}
                            selected={data.archetypes.includes(item.id)}
                            onClick={() => update({ archetypes: toggle(data.archetypes, item.id) })}
                            className="p-4 flex flex-col items-center gap-2 text-center"
                        >
                            <span className="text-3xl">{item.i}</span>
                            <div>
                                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.l}</div>
                                <div className="text-[10px] text-slate-500">{item.d}</div>
                            </div>
                        </LobeCard>
                    ))}
                </div>
            </section>

            {/* 2. Vibe Mix */}
            <section className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Activity size={14} /> Vibe Calibration
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <LobeSlider
                        label="Heat"
                        value={data.vibeMix.temperature}
                        onChange={(v) => update({ vibeMix: { ...data.vibeMix, temperature: v } })}
                        minLabel="Cool" maxLabel="Spicy" icon={ThermometerSun}
                    />
                    <LobeSlider
                        label="Heart"
                        value={data.vibeMix.heartLevel}
                        onChange={(v) => update({ vibeMix: { ...data.vibeMix, heartLevel: v } })}
                        minLabel="Casual" maxLabel="Deep" icon={Heart}
                    />
                    <LobeSlider
                        label="Chaos"
                        value={data.vibeMix.spiceLevel}
                        onChange={(v) => update({ vibeMix: { ...data.vibeMix, spiceLevel: v } })}
                        minLabel="Safe" maxLabel="Wild" icon={Zap}
                    />
                </div>
            </section>

            {/* 3. Consent & Safety (Critical) */}
            <section className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield size={14} /> Safety First
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Stop Protocol</label>
                        <select
                            value={data.consent.safetyResponse}
                            onChange={(e) => update({ consent: { ...data.consent, safetyResponse: e.target.value } })}
                            className="w-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ask">Ask gently</option>
                            <option value="pause">Pause immediately</option>
                            <option value="stop">Stop fully without discussion</option>
                        </select>
                        <p className="text-[10px] text-blue-500/80 leading-tight pt-1">Determine how partners should react if you signal discomfort.</p>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageCircle size={14} /> Communication
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {["Pre-negotiate", "Check-ins", "Aftercare", "Debrief"].map(s => (
                            <button
                                key={s}
                                onClick={() => update({ consent: { ...data.consent, communicationStyles: toggle(data.consent.communicationStyles, s) } })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${data.consent.communicationStyles.includes(s)
                                    ? 'bg-slate-800 text-white border-slate-800'
                                    : 'bg-white border-gray-200 text-slate-500 hover:border-slate-300 dark:bg-transparent dark:border-slate-700'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Limits Visibility Toggle */}
            <section className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg"><AlertTriangle size={16} /></div>
                    <div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Available to be shared</div>
                        <div className="text-[10px] text-slate-500">Make partner ask for sharing your full profile in chat</div>
                    </div>
                </div>
                <button
                    onClick={() => update({ limits: { ...data.limits, showLimitsPublicly: !data.limits.showLimitsPublicly } })}
                    className={`w-12 h-6 rounded-full relative transition-colors ${data.limits.showLimitsPublicly ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-700'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${data.limits.showLimitsPublicly ? 'left-7' : 'left-1'}`} />
                </button>
            </section>

        </div>
    );
};

export default RoleplayIdentityBuilder;
