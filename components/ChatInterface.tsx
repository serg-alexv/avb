
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, User, Users, Flame, EyeOff, Cloud, Clock, Shield, Hourglass, Plus, Send, Globe, MoreVertical } from 'lucide-react';
import { Session } from '../types';
import { getSessionPalette } from '../lib/utils';
import Markdown from './Markdown';

const CountdownTimer = ({ targetDate }: { targetDate: number }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span className="text-[10px] font-mono text-red-500 bg-red-50 px-1 rounded flex items-center gap-1">
      <Hourglass size={8} /> {timeLeft}
    </span>
  );
};

const InputToolbar = ({ onAction }: { onAction: (a: string) => void }) => (
  <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide">
    <button onClick={() => onAction('icebreaker')} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 flex items-center gap-1 whitespace-nowrap border border-blue-100">
      🧊 Icebreaker
    </button>
    <button onClick={() => onAction('rewrite')} className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-xs font-bold hover:bg-purple-100 flex items-center gap-1 whitespace-nowrap border border-purple-100">
      ✨ Magic Rewrite
    </button>
    <button onClick={() => onAction('summarize')} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-bold hover:bg-green-100 flex items-center gap-1 whitespace-nowrap border border-green-100">
      📝 Catch me up
    </button>
  </div>
);

const ChatInterface = ({ session, onBack, onSend, appTheme }: { session: Session, onBack: () => void, onSend: (text: string) => void, appTheme: 'light' | 'dark' }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSend(input);
        setInput('');
      }
    }
  };

  const toggleTranslation = (msgId: string) => {
    setShowOriginal(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const isDark = appTheme === 'dark';
  const palette = getSessionPalette(session.id); // Get unique color for this session

  return (
    <div className={`flex flex-col h-full transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between shrink-0 backdrop-blur-md sticky top-0 z-10 transition-colors ${isDark
        ? `border-white/5 bg-slate-950/80`
        : `border-gray-100 bg-white/80`
        }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><ArrowRight className="rotate-180" size={20} /></button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{session.config.emoji}</span>
              <h2 className={`font-bold truncate bg-clip-text text-transparent bg-gradient-to-r ${palette.from} ${palette.to}`}>
                {session.title}
              </h2>
            </div>

            {/* Tags Row */}
            <div className="flex items-center gap-2 mt-1 overflow-x-auto scrollbar-hide">
              {/* Mode */}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 border opacity-70 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                {session.config.mode === '1:1' ? <User size={10} /> : session.config.mode === 'group_3' ? <Users size={10} /> : <Flame size={10} />}
                {session.config.mode}
              </span>
              {/* Privacy */}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 border opacity-70 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                {session.config.privacy === 'off-record' ? <EyeOff size={10} /> : session.config.privacy === 'persistent' ? <Cloud size={10} /> : <Clock size={10} />}
                {session.config.privacy}
              </span>
              {/* Safety */}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 border ${session.config.safety.nsfw
                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                {session.config.safety.nsfw ? <Flame size={10} /> : <Shield size={10} />}
                {session.config.safety.nsfw ? 'NSFW' : 'SAFE'}
              </span>
            </div>
          </div>
        </div>
        <div className={`p-2 rounded-full border opacity-50 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <MoreVertical size={20} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-transparent">
        {session.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {/* Message Bubble */}
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group ${msg.role === 'user'
              ? `${palette.primary} text-white rounded-tr-none shadow-md shadow-${palette.name}-500/20`
              : `${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-slate-800'} rounded-tl-none`
              }`}>
              {msg.role === 'model' && session.agentIcon && (
                <div className="absolute -top-3 -left-2 text-xl bg-white rounded-full p-0.5 shadow-sm border border-gray-100 transform -rotate-6">{session.agentIcon}</div>
              )}

              <Markdown content={showOriginal[msg.id] && msg.originalContent ? msg.originalContent : msg.content} theme="default" />

              {msg.originalContent && (
                <button onClick={() => toggleTranslation(msg.id)} className="mt-2 text-[10px] font-bold uppercase opacity-60 hover:opacity-100 flex items-center gap-1 border-t border-current pt-1 w-full">
                  <Globe size={10} /> {showOriginal[msg.id] ? 'Show Translated' : 'Show Original'}
                </button>
              )}

              <div className={`text-[10px] mt-1 opacity-50 flex justify-end gap-1 ${msg.role === 'user' ? 'text-white' : (isDark ? 'text-gray-400' : 'text-gray-400')}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.status === 'sending' && <span className="animate-pulse">...</span>}
              </div>
            </div>
          </div>
        ))}
        {session.messages.length === 0 && (
          <div className={`flex flex-col items-center justify-center h-full opacity-30`}>
            <div className="text-6xl mb-4 grayscale opacity-50">{session.config.emoji}</div>
            <p className="text-sm font-medium">Start the conversation...</p>
            {session.config.safety.slowMode && <p className="text-xs mt-2 text-amber-500 font-bold flex items-center gap-1"><Hourglass size={12} /> Slow Mode Active</p>}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 border-gray-100'} border-t backdrop-blur-md`}>
        {/* Co-host Toolbar */}
        {(['helper', 'co-host'].includes(session.config.aiRole)) && (
          <InputToolbar onAction={(action) => {
            // Implement co-host actions logic here if needed
            console.log("Co-host action:", action);
          }} />
        )}

        <div className={`flex gap-2 p-1.5 rounded-3xl border shadow-sm transition-all focus-within:ring-2 ${isDark
          ? `bg-slate-800 border-slate-700 focus-within:ring-${palette.name}-500/50`
          : `bg-white border-gray-200 focus-within:ring-${palette.name}-200`
          }`}>
          <button className={`p-3 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'}`}>
            <Plus size={20} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={session.config.safety.slowMode ? "Slow mode active..." : "Type a message..."}
            disabled={false}
            className={`flex-1 bg-transparent focus:outline-none px-2 font-medium ${isDark ? 'text-white placeholder-gray-500' : 'text-slate-800 placeholder-gray-400'}`}
          />
          <button
            onClick={() => { if (input.trim()) { onSend(input); setInput(''); } }}
            disabled={!input.trim()}
            className={`p-3 rounded-full transition-all duration-300 ${input.trim()
              ? `${palette.primary} text-white shadow-md hover:scale-105 shadow-${palette.name}-500/20`
              : 'bg-gray-100 text-gray-300 dark:bg-slate-700 dark:text-gray-500'
              }`}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-400">
            AI can make mistakes. {session.config.privacy === 'off-record' ? 'Chat is not saved.' : 'Check settings.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
export { CountdownTimer };
