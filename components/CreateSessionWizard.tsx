
import React, { useState } from 'react';
import { User, Users, Flame, Cloud, EyeOff, Clock, Hourglass, Shield, Lock, X, HandMetal, Eye, Ghost, Anchor, Crown, Heart, Sword, MessageCircle } from 'lucide-react';
import { ChatConfig, UserProfile } from '../types';
import { DEFAULT_CONFIG, THEMES } from '../constants';

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

  const getThemeForEmoji = (e: string): 'default' | 'pinky' | 'acid' | 'bw' => {
    const pinky = ['💋', '🔥', '👑', '😈', '💄', '🍷', '🦄', '🌸', '🍓'];
    const acid = ['👽', '🧪', '🐍', '🔋', '🦠', '🦖', '🧩', '🛸'];
    const bw = ['👻', '💀', '🎱', '🕷️', '🎬', '🎹', '💣', '🕸️', '🗿'];

    if (pinky.includes(e)) return 'pinky';
    if (acid.includes(e)) return 'acid';
    if (bw.includes(e)) return 'bw';

    // Random fallback if no match
    const allThemes = ['default', 'pinky', 'acid', 'bw'] as const;
    return allThemes[Math.floor(Math.random() * allThemes.length)];
  };

  const setEmojiAndTheme = (e: string) => {
    setConfig({
      ...config,
      emoji: e,
      theme: getThemeForEmoji(e)
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900 block">Communication Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: '1:1', label: '1:1 Chat', icon: <User size={18} /> },
            { id: 'group_3', label: 'Chat for 3', icon: <Users size={18} /> },
            { id: 'gangbang', label: 'Gangbang', icon: <Flame size={18} /> },
          ].map((mode: any) => (
            <button
              key={mode.id}
              onClick={() => setConfig({ ...config, mode: mode.id })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${config.mode === mode.id
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
            >
              {mode.icon}
              <span className="text-xs font-bold">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gangbang Story Input */}
      {config.mode === 'gangbang' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-xs font-bold text-red-600 block flex items-center gap-1">
            <Flame size={12} /> Story (Context)
            <span className="text-gray-400 font-normal ml-auto">{config.story?.length || 0}/140</span>
          </label>
          <textarea
            value={config.story || ''}
            onChange={(e) => setConfig({ ...config, story: e.target.value.slice(0, 140) })}
            placeholder="E.g. I walked into the wrong locker room..."
            className="w-full p-3 bg-red-50 border border-red-100 rounded-xl text-sm focus:ring-2 focus:ring-red-200 outline-none resize-none h-20 placeholder-red-200"
          />
        </div>
      )}

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900 block">Privacy Tier</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'persistent', label: 'Saved', sub: 'Browser cache', icon: <Cloud size={16} /> },
            { id: 'off-record', label: 'Ram', sub: 'One-time, no cache', icon: <EyeOff size={16} /> },
            { id: '24h', label: '24h', sub: 'Using browser cache', icon: <Clock size={16} /> },
            { id: '59m', label: '59m', sub: 'Using browser cache', icon: <Hourglass size={16} /> }
          ].map((p: any) => (
            <button
              key={p.id}
              onClick={() => setConfig({ ...config, privacy: p.id })}
              className={`p-2.5 rounded-xl border flex items-center justify-start gap-3 transition-all ${config.privacy === p.id
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
            >
              <div className={`p-2 rounded-full ${config.privacy === p.id ? 'bg-indigo-100' : 'bg-gray-100'}`}>{p.icon}</div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold">{p.label}</span>
                <span className="text-[10px] opacity-70 text-left leading-tight">{p.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Safety & Atmosphere - Merged into Step 1 */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900 block">Safety & Atmosphere</label>
        <div className="grid grid-cols-2 gap-3">

          {/* NSFW Toggle - Mutually exclusive with Shield */}
          <div
            onClick={() => {
              const newVal = !config.safety.nsfw;
              setConfig(p => ({
                ...p,
                safety: {
                  ...p.safety,
                  nsfw: newVal,
                  // If enabling NSFW, disable Shield
                  flirtingProtection: newVal ? false : p.safety.flirtingProtection,
                  noNegativity: newVal ? false : p.safety.noNegativity
                }
              }));
            }}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden ${config.safety.nsfw ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
              }`}
          >
            <div className="flex justify-between items-start z-10">
              <span className={`text-xs font-bold ${config.safety.nsfw ? 'text-red-600' : 'text-gray-500'}`}>Explicit</span>
              <div className={`w-4 h-4 rounded-full border ${config.safety.nsfw ? 'bg-red-500 border-red-500' : 'border-gray-300'}`} />
            </div>
            <div className="text-[10px] text-gray-500 leading-tight z-10">
              NSFW chat
            </div>
            {config.safety.nsfw && <Flame className="absolute -bottom-2 -right-2 text-red-100 z-0" size={48} />}
          </div>

          {/* Vibe Shield Toggle - Mutually exclusive with NSFW */}
          <div
            onClick={() => {
              const newVal = !config.safety.flirtingProtection;
              setConfig(p => ({
                ...p,
                safety: {
                  ...p.safety,
                  flirtingProtection: newVal,
                  noNegativity: newVal,
                  // If enabling Shield, disable NSFW
                  nsfw: newVal ? false : p.safety.nsfw
                }
              }));
            }}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden ${config.safety.flirtingProtection ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
              }`}
          >
            <div className="flex justify-between items-start z-10">
              <span className={`text-xs font-bold ${config.safety.flirtingProtection ? 'text-teal-600' : 'text-gray-500'}`}>Shield</span>
              <div className={`w-4 h-4 rounded-full border ${config.safety.flirtingProtection ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`} />
            </div>
            <div className="text-[10px] text-gray-500 leading-tight z-10">
              Block flirting and negative topics.
            </div>
            {config.safety.flirtingProtection && <Shield className="absolute -bottom-2 -right-2 text-teal-100 z-0" size={48} />}
          </div>

          {/* Slow Mode */}
          <div
            onClick={() => setConfig(p => ({ ...p, safety: { ...p.safety, slowMode: !p.safety.slowMode } }))}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden ${config.safety.slowMode ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
              }`}
          >
            <div className="flex justify-between items-start z-10">
              <span className={`text-xs font-bold ${config.safety.slowMode ? 'text-amber-600' : 'text-gray-500'}`}>Slow Mode</span>
              <div className={`w-4 h-4 rounded-full border ${config.safety.slowMode ? 'bg-amber-500 border-amber-500' : 'border-gray-300'}`} />
            </div>
            <div className="text-[10px] text-gray-500 leading-tight z-10">
              10s cooldown.
            </div>
          </div>

          {/* No Files */}
          <div
            onClick={() => setConfig(p => ({ ...p, safety: { ...p.safety, noFiles: !p.safety.noFiles } }))}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden ${config.safety.noFiles ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
              }`}
          >
            <div className="flex justify-between items-start z-10">
              <span className={`text-xs font-bold ${config.safety.noFiles ? 'text-indigo-600' : 'text-gray-500'}`}>No Files</span>
              <div className={`w-4 h-4 rounded-full border ${config.safety.noFiles ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`} />
            </div>
            <div className="text-[10px] text-gray-500 leading-tight z-10">
              Strict text-only mode.
            </div>
          </div>
        </div>
      </div>

      {/* Disabled Export Option */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
        <div className="w-5 h-5 rounded border border-gray-300 bg-white flex items-center justify-center">
          {/* Unchecked */}
        </div>
        <span className="text-sm text-gray-500 font-medium select-none">Allow to save or export</span>
        <Lock size={14} className="ml-auto text-gray-400" />
      </div>

    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 flex flex-col items-center justify-center py-4">

      {/* Emoji Selection moved to Step 2 (Final) */}
      <div className="w-full">
        <label className="text-sm font-semibold text-gray-900 block mb-3 text-center">Choose an Avatar</label>
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x justify-center">
          {['💬', '🦊', '🚀', '👻', '💀', '👽', '🤖', '🧠', '💋', '🔥', '🎲', '🎭', '💊', '🔮', '💦', '👁️', '👑', '😈', '🐍', '🕸️', '🦄'].map(e => (
            <button
              key={e}
              onClick={() => setEmojiAndTheme(e)}
              className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl border transition-all snap-center ${config.emoji === e ? 'bg-blue-50 border-blue-400 scale-110 shadow-md ring-2 ring-blue-100' : 'bg-white border-gray-100 hover:border-gray-300 opacity-60 hover:opacity-100'
                }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-7xl shadow-inner mb-2 border border-gray-100 transition-colors duration-500 ${THEMES[config.theme].bg}`}>
        {config.emoji}
      </div>
      <p className="text-[10px] uppercase font-bold text-gray-400">Theme: {config.theme}</p>

      <div className="w-full space-y-2 mt-2">
        <label className="text-sm font-semibold text-gray-900 block text-center">Name your Chat</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Late Night Thoughts..."
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 text-center font-medium"
          autoFocus
        />
      </div>

      <div className="text-center text-xs text-gray-400 max-w-xs mt-2">
        {config.mode === 'gangbang' ? 'Warning: You have selected an intense roleplay mode.' : 'Ready to start your session?'}
      </div>

      {/* Chat Tags Selection */}
      <div className="w-full mt-4">
        <label className="text-sm font-semibold text-gray-900 block mb-2 text-center">Chat Tags</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { l: 'Straight Only', i: <HandMetal size={14} />, c: 'blue' },
            { l: 'Hide my language', i: <Eye size={14} />, c: 'emerald' },
            { l: 'Short-time horny', i: <Ghost size={14} />, c: 'purple' },
            { l: 'Permahorny gooner', i: <Anchor size={14} />, c: 'amber' },
            { l: 'Adults Only', i: <Crown size={14} />, c: 'red' },
            { l: 'For youngs', i: <Heart size={14} />, c: 'pink' },
            { l: 'Rude Start', i: <Sword size={14} />, c: 'orange' },
            { l: 'Just Talk', i: <MessageCircle size={14} />, c: 'cyan' },
          ].map(opt => {
            const isActive = userProfile.tags.includes(opt.l);
            const activeClass = `bg-${opt.c}-600 border-${opt.c}-600 text-white shadow-md shadow-${opt.c}-500/20`;
            const inactiveClass = `bg-white border-gray-200 text-gray-500 hover:border-${opt.c}-300 hover:text-${opt.c}-600`;

            return (
              <button key={opt.l}
                onClick={() => {
                  const newTags = isActive
                    ? userProfile.tags.filter(t => t !== opt.l)
                    : [...userProfile.tags, opt.l];
                  onUpdateProfile({ tags: newTags });
                }}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex flex-col items-center justify-center gap-1 h-14 text-center leading-tight ${isActive ? activeClass : inactiveClass}`}
              >
                {opt.i}
                <span>{opt.l}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <h2 className="font-bold text-lg text-slate-800">New Search</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex gap-1.5">
            {[1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-xl transition-colors">Back</button>
            )}
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">Continue</button>
            ) : (
              <button onClick={() => onCreate(config, title)} className="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">Start Chat</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionWizard;
