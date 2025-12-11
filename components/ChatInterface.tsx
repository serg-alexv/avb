import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, User, Users, Flame, EyeOff, Cloud, Clock, Shield, Hourglass, Plus, Send, Globe, MoreVertical, Sparkles } from 'lucide-react';
import { Session } from '../types';
import { getSessionPalette } from '../lib/utils';
import Markdown from './Markdown';
import { firestoreService } from '../services/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES, DISCOVERY_AGENTS } from '../constants';

const InputToolbar = ({ onAction }: { onAction: (a: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide"
  >
    <button onClick={() => onAction('icebreaker')} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold hover:bg-blue-100 flex items-center gap-1 whitespace-nowrap border border-blue-100 transition-transform active:scale-95">
      🧊 Icebreaker
    </button>
    <button onClick={() => onAction('rewrite')} className="px-3 py-1.5 rounded-lg bg-fuchsia-50 text-fuchsia-600 text-[10px] font-bold hover:bg-fuchsia-100 flex items-center gap-1 whitespace-nowrap border border-fuchsia-100 transition-transform active:scale-95">
      ✨ Magic Rewrite
    </button>
    <button onClick={() => onAction('summarize')} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold hover:bg-green-100 flex items-center gap-1 whitespace-nowrap border border-green-100 transition-transform active:scale-95">
      📝 Catch me up
    </button>
  </motion.div>
);

const ChatInterface = ({ session, onBack, onSend, appTheme }: { session: Session, onBack: () => void, onSend: (text: string) => void, appTheme: 'light' | 'dark' }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const [activeUsers, setActiveUsers] = useState<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  // Presence Subscription
  useEffect(() => {
    if (session.isFirebaseRoom && session.firebaseRoomId) {
      firestoreService.subscribeToPresence(session.firebaseRoomId, (count) => {
        setActiveUsers(count);
      });
      return () => {
        // Unsub logic is handled via map map but efficient enough for now
      };
    }
  }, [session.isFirebaseRoom, session.firebaseRoomId]);

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

  // Enforce strict Day/Night mode logic
  const bgClass = isDark ? 'bg-slate-950/60' : 'bg-white/60';
  const textClass = isDark ? 'text-white' : 'text-slate-800';

  return (
    <div className={`flex flex-col h-full w-full transition-colors duration-500 backdrop-blur-sm ${bgClass} ${textClass}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 backdrop-blur-xl sticky top-0 z-20 transition-colors ${isDark
        ? `border-white/5 bg-slate-950/80`
        : `border-slate-100 bg-white/80`
        }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors group">
            <ArrowRight className="rotate-180 group-hover:-translate-x-0.5 transition-transform" size={20} />
          </button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              {session.fluentAvatar ? (
                <img src={session.fluentAvatar} alt="avatar" className="w-10 h-10 object-contain drop-shadow-sm" />
              ) : (
                <span className="text-3xl drop-shadow-sm">{session.config.emoji}</span>
              )}
              <h2 className={`font-bold truncate text-base bg-clip-text text-transparent bg-gradient-to-r ${palette.from} ${palette.to}`}>
                {session.title}
              </h2>
            </div>

            {/* Tags Row */}
            <div className="flex items-center gap-1.5 mt-0.5 overflow-x-auto scrollbar-hide">
              {/* Presence Indicator */}
              {session.isFirebaseRoom && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 border ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {activeUsers}
                </span>
              )}

              {/* Status Logic */}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white text-slate-600 border-slate-300 shadow-sm'}`}>
                {session.isP2P ? 'Direct' : (session.isFirebaseRoom ? 'Live' : 'Bot')}
              </span>

              {/* Agent Tags */}
              {DISCOVERY_AGENTS.find(a => a.id === session.agentId)?.tags.map(tag => (
                <span key={tag} className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border whitespace-nowrap ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white text-slate-600 border-slate-300 shadow-sm'}`}>
                  {tag}
                </span>
              ))}

              {session.config.safety.nsfw &&
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border bg-red-500/10 text-red-500 border-red-500/20">
                  NSFW
                </span>
              }
            </div>
          </div>
        </div>
        <button className={`p-2 rounded-full border opacity-50 hover:opacity-100 transition-opacity ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-transparent custom-scrollbar">
        <AnimatePresence initial={false}>
          {session.messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const isLast = i === session.messages.length - 1;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Message Bubble */}
                <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm relative group transition-all duration-200 ${isUser
                  ? `${palette.primary} text-white rounded-tr-sm shadow-md shadow-${palette.name}-500/20`
                  : `${isDark ? 'bg-white/5 border border-white/5 text-slate-100' : 'bg-white border border-slate-100 text-slate-800'} rounded-tl-sm shadow-sm`
                  }`}>
                  {!isUser && session.agentIcon && (
                    <div className="absolute -top-3 -left-2 text-xl bg-white dark:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 transform -rotate-3 z-10">
                      {session.agentIcon}
                    </div>
                  )}

                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                    <Markdown content={showOriginal[msg.id] && msg.originalContent ? msg.originalContent : msg.content} theme="default" />
                  </div>

                  {msg.originalContent && (
                    <button onClick={() => toggleTranslation(msg.id)} className="mt-2 text-[10px] font-bold uppercase opacity-60 hover:opacity-100 flex items-center gap-1 border-t border-current pt-1 w-full">
                      <Globe size={10} /> {showOriginal[msg.id] ? 'Show Translated' : 'Show Original'}
                    </button>
                  )}

                  <div className={`text-[9px] mt-1.5 opacity-40 flex justify-end gap-1 font-medium select-none ${isUser ? 'text-white' : 'text-slate-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.status === 'sending' && <span className="animate-pulse">...</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {session.messages.length === 0 && (
          <div className={`flex flex-col items-center justify-center h-full select-none text-center`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
              <span className="text-6xl drop-shadow-sm filter grayscale opacity-50">{session.config.emoji}</span>
            </div>
            <p className={`text-sm font-bold tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Start the conversation</p>
            {session.config.safety.slowMode && <p className="text-xs mt-2 text-amber-500 font-bold flex items-center gap-1"><Hourglass size={12} /> Slow Mode Active</p>}
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className={`p-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'} border-t backdrop-blur-lg`}>
        {/* Co-host Toolbar */}
        {(['helper', 'co-host'].includes(session.config.aiRole)) && (
          <InputToolbar onAction={(action) => {
            console.log("Co-host action:", action);
          }} />
        )}

        <div className={`flex gap-2 p-1.5 rounded-[2rem] border shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-offset-1 dark:focus-within:ring-offset-slate-950 ${isDark
          ? `bg-slate-800/50 border-slate-700/50 focus-within:ring-${palette.name}-500/50`
          : `bg-white border-slate-200 focus-within:ring-${palette.name}-200`
          }`}>
          <button className={`p-3 rounded-full transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
            <Plus size={20} className="stroke-[2.5]" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={session.config.safety.slowMode ? "Slow mode active..." : "Type a message..."}
            disabled={false}
            className={`flex-1 bg-transparent focus:outline-none px-2 font-medium text-sm ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-500'}`}
          />
          <button
            onClick={() => { if (input.trim()) { onSend(input); setInput(''); } }}
            disabled={!input.trim()}
            className={`p-3 rounded-full transition-all duration-300 transform ${input.trim()
              ? `${palette.primary} text-white shadow-lg hover:scale-105 shadow-${palette.name}-500/25 rotate-0`
              : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600 rotate-12 scale-90'
              }`}
          >
            {input.trim() ? <Send size={18} className="fill-current" /> : <Sparkles size={18} />}
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-slate-400 font-medium">
            {session.config.privacy === 'off-record' ? '🔒 Incognito Mode' : 'AI can make mistakes. Check settings.'}
          </span>
        </div>
      </div>
    </div >
  );
};

export default ChatInterface;
