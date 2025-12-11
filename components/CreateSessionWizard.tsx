
import React, { useState } from 'react';
import { User, Users, Flame, Cloud, EyeOff, Clock, Hourglass, Shield, Lock, X, HandMetal, Eye, Ghost, Anchor, Crown, Heart, Sword, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { ChatConfig, UserProfile } from '../types';
import { DEFAULT_CONFIG, THEMES, EMOJI_TO_FLUENT_MAP } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const CreateSessionWizard = ({
  isOpen,
  onClose,
  onCreate,
  userProfile,
  onUpdateProfile
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (config: ChatConfig, title: string) => void;
  userProfile: UserProfile;
  onUpdateProfile: (u: Partial<UserProfile>) => void;
}) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ChatConfig>(DEFAULT_CONFIG);
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const setEmojiAndTheme = (e: string) => {
    setConfig({
      ...config,
      emoji: e,
      theme: 'default'
    });
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-800 block flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" /> Communication Mode
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: '1:1', label: '1:1 Chat', icon: <User size={24} /> },
            { id: 'group_3', label: 'Chat for 3', icon: <Users size={24} /> },
            { id: 'gangbang', label: 'Gangbang', icon: <Flame size={24} /> },
          ].map((mode: any) => (
            <button
              key={mode.id}
              onClick={() => setConfig({ ...config, mode: mode.id })}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${config.mode === mode.id
                ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md ring-1 ring-blue-500/20 scale-105'
                : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                }`}
            >
              {mode.icon}
              <span className="text-xs font-bold">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gangbang Story Input */}
      <AnimatePresence>
        {config.mode === 'gangbang' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <label className="text-xs font-bold text-rose-600 block flex items-center gap-1">
              <Flame size={12} /> Story Context
              <span className="text-slate-400 font-normal ml-auto text-[10px]">{config.story?.length || 0}/140</span>
            </label>
            <textarea
              value={config.story || ''}
              onChange={(e) => setConfig({ ...config, story: e.target.value.slice(0, 140) })}
              placeholder="Set the scene... e.g. I walked into the wrong locker room..."
              className="w-full p-4 bg-rose-50/50 border border-rose-100 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 outline-none resize-none h-24 placeholder-rose-300 text-rose-900"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-800 block flex items-center gap-2">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" /> Privacy Tier
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'persistent', label: 'Persistence', sub: 'Saved to browser cache', icon: <Cloud size={18} /> },
            { id: 'off-record', label: 'Incognito', sub: 'Auto-delete on close', icon: <EyeOff size={18} /> },
            { id: '24h', label: '24 Hours', sub: 'Expires tomorrow', icon: <Clock size={18} /> },
            { id: '59m', label: '59 Minutes', sub: 'Speed run mode', icon: <Hourglass size={18} /> }
          ].map((p: any) => (
            <button
              key={p.id}
              onClick={() => setConfig({ ...config, privacy: p.id })}
              className={`p-3 rounded-2xl border flex items-center justify-start gap-4 transition-all duration-200 ${config.privacy === p.id
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm relative overflow-hidden'
                : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-600'
                }`}
            >
              {config.privacy === p.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
              <div className={`p-2.5 rounded-xl ${config.privacy === p.id ? 'bg-indigo-200/50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{p.icon}</div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{p.label}</span>
                <span className="text-[10px] opacity-70 text-left leading-tight">{p.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Safety & Atmosphere */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-800 block flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" /> Atmosphere tags
        </label>
        <div className="grid grid-cols-2 gap-3">

          {/* NSFW Toggle */}
          <div
            onClick={() => {
              const newVal = !config.safety.nsfw;
              setConfig(p => ({
                ...p,
                safety: {
                  ...p.safety,
                  nsfw: newVal,
                  flirtingProtection: newVal ? false : p.safety.flirtingProtection,
                  noNegativity: newVal ? false : p.safety.noNegativity
                }
              }));
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden group ${config.safety.nsfw ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
          >
            <div className="flex justify-between items-start z-10">
              <span className={`text-xs font-bold uppercase tracking-wider ${config.safety.nsfw ? 'text-rose-600' : 'text-slate-500'}`}>Explicit Mode</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${config.safety.nsfw ? 'bg-rose-500 border-rose-500' : 'border-slate-200'}`}>
                {config.safety.nsfw && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 leading-tight z-10 font-medium">
              Allow NSFW content and themes.
            </div>
            {config.safety.nsfw && <Flame className="absolute -bottom-4 -right-2 text-rose-500/10 rotate-12 transition-transform group-hover:scale-110" size={80} />}
          </div>

          {/* Vibe Shield Toggle */}
          <div
            onClick={() => {
              const newVal = !config.safety.flirtingProtection;
              setConfig(p => ({
                ...p,
                safety: {
                  ...p.safety,
                  flirtingProtection: newVal,
                  noNegativity: newVal,
                  nsfw: newVal ? false : p.safety.nsfw
                }
              }));
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden group ${config.safety.flirtingProtection ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
          >
            <div className="flex justify-between items-start z-10">
              <span className={`text-xs font-bold uppercase tracking-wider ${config.safety.flirtingProtection ? 'text-teal-600' : 'text-slate-500'}`}>Vibe Shield</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${config.safety.flirtingProtection ? 'bg-teal-500 border-teal-500' : 'border-slate-200'}`}>
                {config.safety.flirtingProtection && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 leading-tight z-10 font-medium">
              Blocks flirting and negativity.
            </div>
            {config.safety.flirtingProtection && <Shield className="absolute -bottom-4 -right-2 text-teal-500/10 rotate-12 transition-transform group-hover:scale-110" size={80} />}
          </div>

          {/* Slow Mode */}
          <div
            onClick={() => setConfig(p => ({ ...p, safety: { ...p.safety, slowMode: !p.safety.slowMode } }))}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden group ${config.safety.slowMode ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
          >
            <div className="flex justify-between items-start z-10">
              <span className={`text-xs font-bold uppercase tracking-wider ${config.safety.slowMode ? 'text-amber-600' : 'text-slate-500'}`}>Slow Mode</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${config.safety.slowMode ? 'bg-amber-500 border-amber-500' : 'border-slate-200'}`}>
                {config.safety.slowMode && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 leading-tight z-10 font-medium">
              Enforces a rapid-fire cooldown.
            </div>
          </div>

          {/* No Files */}
          <div
            onClick={() => setConfig(p => ({ ...p, safety: { ...p.safety, noFiles: !p.safety.noFiles } }))}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden group ${config.safety.noFiles ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
          >
            <div className="flex justify-between items-start z-10">
              <span className={`text-xs font-bold uppercase tracking-wider ${config.safety.noFiles ? 'text-indigo-600' : 'text-slate-500'}`}>Text Only</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${config.safety.noFiles ? 'bg-indigo-500 border-indigo-500' : 'border-slate-200'}`}>
                {config.safety.noFiles && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 leading-tight z-10 font-medium">
              Disables all file uploads.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 flex flex-col items-center justify-center py-2"
    >

      {/* Emoji Selection moved to Step 2 (Final) */}
      <div className="w-full">
        <label className="text-sm font-bold text-foreground block mb-4 text-center">Choose an Avatar</label>
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide snap-x justify-start px-4 md:justify-center">
          {Object.keys(EMOJI_TO_FLUENT_MAP).map(e => (
            <button
              key={e}
              onClick={() => setEmojiAndTheme(e)}
              className={`w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 snap-center border ${config.emoji === e
                ? 'bg-primary/20 border-primary scale-110 shadow-lg shadow-primary/20 ring-2 ring-primary/20'
                : 'bg-surface/50 border-border hover:border-primary/50 opacity-60 hover:opacity-100 hover:-translate-y-1'
                }`}
            >
              <img src={EMOJI_TO_FLUENT_MAP[e]} alt={e} className="w-10 h-10 object-contain drop-shadow-sm" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className={`w-36 h-36 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-4 border border-white/10 transition-all duration-500 bg-gradient-to-br from-surface/50 to-surface/10 backdrop-blur-xl relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
        <img src={EMOJI_TO_FLUENT_MAP[config.emoji || '💬']} alt="Avatar" className="w-24 h-24 object-contain drop-shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest bg-surface/50 px-3 py-1 rounded-full border border-border">Theme: {config.theme}</p>

      <div className="w-full space-y-3 mt-4 max-w-sm">
        <label className="text-sm font-bold text-foreground block text-center">Name your Session</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Late Night Thoughts..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 text-center font-bold text-lg placeholder-slate-300 transition-all"
          autoFocus
        />
      </div>

      <div className="text-center text-xs font-medium text-slate-400 max-w-xs mt-2">
        {config.mode === 'gangbang' && <span className="text-rose-500 font-bold">Warning: Intense roleplay mode active.</span>}
      </div>

      {/* Chat Tags Selection */}
      <div className="w-full mt-6">
        <label className="text-sm font-bold text-foreground block mb-3 text-center">The mushroom cloud</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { l: 'Straight Only', i: <HandMetal size={14} />, c: 'blue' },
            { l: 'Hide Language', i: <Eye size={14} />, c: 'emerald' },
            { l: 'Short-time', i: <Ghost size={14} />, c: 'purple' },
            { l: 'Perma-horny', i: <Anchor size={14} />, c: 'amber' },
            { l: 'Adults Only', i: <Crown size={14} />, c: 'red' },
            { l: 'Young Souls', i: <Heart size={14} />, c: 'pink' },
            { l: 'Rude Start', i: <Sword size={14} />, c: 'orange' },
            { l: 'Just Talk', i: <MessageCircle size={14} />, c: 'cyan' },
          ].map(opt => {
            const isActive = userProfile.tags.includes(opt.l);
            const activeClass = `bg-${opt.c}-600 border-${opt.c}-600 text-white shadow-lg shadow-${opt.c}-500/30 scale-105`;
            const inactiveClass = `bg-surface/50 border-border text-muted-foreground hover:border-${opt.c}-500/50 hover:text-${opt.c}-500 hover:bg-${opt.c}-500/10`;

            return (
              <button key={opt.l}
                onClick={() => {
                  const newTags = isActive
                    ? userProfile.tags.filter(t => t !== opt.l)
                    : [...userProfile.tags, opt.l];
                  onUpdateProfile({ tags: newTags });
                }}
                className={`px-2 py-2 rounded-xl text-[9px] font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-1.5 h-16 text-center leading-tight ${isActive ? activeClass : inactiveClass}`}
              >
                {opt.i}
                <span>{opt.l}</span>
              </button>
            )
          })}
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">These tags update your profile globally.</p>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-white/20"
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0">
          <div>
            <h2 className="font-black text-xl text-slate-900 tracking-tight">New Session</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-700 bg-slate-50"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-slate-50/30">
          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </AnimatePresence>
        </div>

        <div className="p-5 border-t border-slate-100 bg-white/80 backdrop-blur-md flex justify-between items-center">
          <div className="flex gap-2">
            {[1, 2].map(i => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ease-out ${step === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-muted-foreground text-sm font-bold hover:bg-surface rounded-2xl transition-colors flex items-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} className="px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl flex items-center gap-2 group">
                Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button onClick={() => onCreate(config, title)} className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                Start Chat <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateSessionWizard;
