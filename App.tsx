
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles } from 'lucide-react';

import { Session, Message, UserProfile, AppSettings, ChatConfig, Agent } from './types';
import { FUNNY_DESCRIPTORS, DEFAULT_MODEL, DEFAULT_CONFIG, DEFAULT_USER_PROFILE } from './constants';
import { Storage } from './services/storage';
import { firestoreService } from './services/firestore';

import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProfileView from './components/ProfileView';
import DiscoveryView from './components/DiscoveryView';
import CreateSessionWizard from './components/CreateSessionWizard';
import { ChatShell } from './components/ChatShell';

const App = () => {
  const [currentView, setCurrentView] = useState<'chat' | 'discovery' | 'profile'>('discovery');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const p = Storage.get('user_profile', DEFAULT_USER_PROFILE);
    if (!p.userId) p.userId = crypto.randomUUID();
    return p;
  });
  const [appSettings, setAppSettings] = useState<AppSettings>(Storage.get('app_settings', { apiKey: '', firebaseConfig: '', theme: 'light', defaultModel: DEFAULT_MODEL }));
  const [sessionTimer, setSessionTimer] = useState(0);
  const [rulePopup, setRulePopup] = useState<{ show: boolean, text: string, loading: boolean }>({ show: false, text: '', loading: false });

  // Load local sessions
  useEffect(() => {
    const saved = Storage.get<Session[]>('sessions', []);
    setSessions(saved);
    // Init firebase
    firestoreService.init(appSettings.firebaseConfig);
  }, []);

  // Timer
  useEffect(() => {
    const i = setInterval(() => setSessionTimer(p => p + 1), 1000);
    return () => clearInterval(i);
  }, []);

  // Save sessions & Sync
  useEffect(() => {
    Storage.set('sessions', sessions);
  }, [sessions]);

  // Sync profile to localstorage when it updates
  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...updates };
    setUserProfile(newProfile);
    Storage.set('user_profile', newProfile);
  };

  const fetchFunnyRule = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the checkbox
    setRulePopup({ show: true, text: '', loading: true });
    try {
      const ai = new GoogleGenAI({ apiKey: appSettings.apiKey || process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a short, funny, witty, and slightly scandalous "rule" for an anonymous NSFW chat app user. Max 15 words. Paradoxical style.',
      });
      setRulePopup({ show: true, text: response.text || "Rule #404: Rules not found.", loading: false });
    } catch {
      setRulePopup({ show: true, text: "Rule #1: There are no rules.", loading: false });
    }
  };

  // Cleanup 59m/24h sessions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSessions(prev => prev.filter(s => {
        if (s.config.privacy === '59m' && now - s.updatedAt > 3540000) return false; // 59 mins
        if (s.config.privacy === '24h' && now - s.updatedAt > 86400000) return false;
        return true;
      }));
    }, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const handleCreateSession = (config: ChatConfig, title: string) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: title || `Chat ${sessions.length + 1}`,
      messages: [],
      updatedAt: Date.now(),
      model: appSettings.defaultModel,
      config: config
    };

    // For 'off-record', we don't save to localStorage in the same way, but for this demo we keep in state.
    // In real app, filter these out of Storage.set
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setCurrentView('chat');
    setIsWizardOpen(false);
  };

  const handleJoinAgent = (agent: Agent) => {
    const config: ChatConfig = {
      ...DEFAULT_CONFIG,
      aiRole: 'co-host',
      emoji: agent.icon,
      safety: { ...DEFAULT_CONFIG.safety, nsfw: agent.isNsfw || false }
    };

    const newSession: Session = {
      id: crypto.randomUUID(),
      title: `Chat with ${agent.name}`,
      messages: [],
      updatedAt: Date.now(),
      model: appSettings.defaultModel,
      systemInstruction: agent.systemInstruction,
      agentId: agent.id,
      agentIcon: agent.icon,
      config: config
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setCurrentView('chat');
  };

  const handleSend = async (text: string) => {
    if (!activeSessionId) return;

    // 1. User Message
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now(), status: 'sent' };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, userMsg], updatedAt: Date.now() };
      }
      return s;
    }));

    // 2. AI Response
    const session = sessions.find(s => s.id === activeSessionId);
    if (!session || session.config.aiRole === 'off') return;

    try {
      const ai = new GoogleGenAI({ apiKey: appSettings.apiKey || process.env.API_KEY });
      const modelName = session.model; // Use session model

      // Construct System Instruction with Profile Context
      let systemPrompt = session.systemInstruction || "You are a helpful AI assistant.";

      // Inject User Profile
      if (userProfile.bio) systemPrompt += `\nUser Bio: ${userProfile.bio}`;
      if (userProfile.name) systemPrompt += `\nUser Name: ${userProfile.name}`;
      if (userProfile.tone) systemPrompt += `\nUser Mood: ${userProfile.tone}`;
      if (userProfile.tags?.length) systemPrompt += `\nUser Interests: ${userProfile.tags.join(', ')}`;
      if (userProfile.mainLanguage) systemPrompt += `\nUser Main Language: ${userProfile.mainLanguage}. If you reply in another language, append the translation or original. Format: [Translated Text] ___ORIGINAL___ [Original Text]`;

      // Classifications & Prefs
      if (userProfile.classifications.straightOnly) systemPrompt += `\nUser Preference: Straight Only. Do not engage in same-sex romance.`;
      if (userProfile.classifications.rudeWelcome) systemPrompt += `\nBe rude and dismissive initially.`;
      if (userProfile.classifications.preferMilk) systemPrompt += `\nMention milk occasionally.`;

      // Inject Config Context
      systemPrompt += `\nMode: ${session.config.mode}`;
      if (session.config.mode === 'gangbang') {
        systemPrompt += `\nRoleplay Context: Gangbang/Group scenario. ${session.config.story ? `Context: ${session.config.story}` : ''}`;
      }
      if (session.config.privacy === 'off-record') systemPrompt += `\nThis chat is off-record.`;
      if (session.config.safety.nsfw) {
        systemPrompt += `\nNSFW Content is ALLOWED. Be open to mature themes.`;
        // Inject Sexual Profile
        if (userProfile.sexualProfile) {
          const sp = userProfile.sexualProfile;
          systemPrompt += `\nUser Archetype: ${sp.archetype}`;
          systemPrompt += `\nDynamics: Intensity ${sp.stats.intensity}/100, Romance ${sp.stats.romance}/100.`;
          if (sp.kinks.length) systemPrompt += `\nKinks: ${sp.kinks.join(', ')}`;
          if (sp.limits.length) systemPrompt += `\nHard Limits (Do NOT cross): ${sp.limits.join(', ')}`;
        }
      } else {
        systemPrompt += `\nKeep content Safe for Work (SFW).`;
      }
      if (session.config.safety.flirtingProtection) systemPrompt += `\nDo not flirt. Maintain boundaries.`;
      if (session.config.safety.noNegativity) systemPrompt += `\nKeep the tone positive and uplifting.`;
      if (session.config.safety.slowMode) systemPrompt += `\n(System: Slow mode active).`;

      // Streaming
      const chat = ai.chats.create({
        model: modelName,
        config: { systemInstruction: systemPrompt },
        history: session.messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
      });

      const result = await chat.sendMessageStream({ message: text });

      const aiMsgId = crypto.randomUUID();
      let aiContent = '';

      // Add placeholder message
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, { id: aiMsgId, role: 'model', content: '', timestamp: Date.now(), status: 'streaming' }] };
        }
        return s;
      }));

      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        aiContent += chunkText;

        // Update message content
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            const msgs = [...s.messages];
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg.id === aiMsgId) {
              lastMsg.content = aiContent;
            }
            return { ...s, messages: msgs };
          }
          return s;
        }));
      }

      // Check for translation delimiter
      let finalContent = aiContent;
      let original = undefined;
      if (aiContent.includes('___ORIGINAL___')) {
        const parts = aiContent.split('___ORIGINAL___');
        finalContent = parts[0].trim();
        original = parts[1].trim();
      }

      // Finalize status
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          const msgs = [...s.messages];
          const lastMsg = msgs[msgs.length - 1];
          lastMsg.status = 'sent';
          lastMsg.content = finalContent;
          lastMsg.originalContent = original;
          return { ...s, messages: msgs };
        }
        return s;
      }));

      // Firestore Sync
      const finalSession = sessions.find(s => s.id === activeSessionId);
      if (finalSession) firestoreService.syncSession(finalSession);

    } catch (e) {
      console.error(e);
      // Error State
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, { id: crypto.randomUUID(), role: 'model', content: 'Error generating response.', timestamp: Date.now(), status: 'error' }] };
        }
        return s;
      }));
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(sessions.filter(s => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const handleArchiveSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(sessions.map(s => s.id === id ? { ...s, archived: !s.archived } : s));
    if (activeSessionId === id && !sessions.find(s => s.id === id)?.archived) setActiveSessionId(null);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeSessionsList = sessions.filter(s => !s.archived);
  const archivedSessionsList = sessions.filter(s => s.archived);

  const funnySlogan = useMemo(() => FUNNY_DESCRIPTORS[Math.floor(Math.random() * FUNNY_DESCRIPTORS.length)], []);

  // Update app theme effect
  const isDark = appSettings.theme === 'dark';

  return (
    <div className={`flex h-full w-full ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>

      {/* Rule Popup */}
      {rulePopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setRulePopup(p => ({ ...p, show: false }))}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">📜</div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900"><Sparkles className="text-purple-600" /> AI Wisdom</h3>
            <div className="text-lg font-medium text-center py-4 text-slate-800 min-h-[100px] flex items-center justify-center">
              {rulePopup.loading ? (
                <span className="animate-pulse text-gray-400">Consulting the Oracle...</span>
              ) : (
                `"${rulePopup.text}"`
              )}
            </div>
            <button onClick={() => setRulePopup(p => ({ ...p, show: false }))} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold mt-2 hover:bg-purple-700">Understood</button>
          </div>
        </div>
      )}

      <ChatShell
        sidebar={
          <Sidebar
            userProfile={userProfile}
            activeSessionsList={activeSessionsList}
            archivedSessionsList={archivedSessionsList}
            activeSessionId={activeSessionId}
            currentView={currentView}
            funnySlogan={funnySlogan}
            sessionTimer={sessionTimer}
            isDark={isDark}
            isWizardOpen={isWizardOpen}
            handleUpdateProfile={handleUpdateProfile}
            setCurrentView={setCurrentView}
            setActiveSessionId={setActiveSessionId}
            setIsWizardOpen={setIsWizardOpen}
            handleArchiveSession={handleArchiveSession}
            handleDeleteSession={handleDeleteSession}
            toggleTheme={() => setAppSettings(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))}
            fetchFunnyRule={fetchFunnyRule}
          />
        }
        isSidebarOpen={true} // In a real mobile implementation, this would be state
        onToggleSidebar={() => { }}
      >
        {/* Main Area */}
        <div className="h-full w-full">
          {currentView === 'chat' && activeSession ? (
            <ChatInterface
              session={activeSession}
              onBack={() => { setActiveSessionId(null); setCurrentView('sidebar'); }}
              onSend={handleSend}
              appTheme={appSettings.theme}
            />
          ) : currentView === 'profile' ? (
            <ProfileView
              onClose={() => setCurrentView('discovery')}
              profile={userProfile}
              onUpdate={handleUpdateProfile}
              appSettings={appSettings}
              onSaveSettings={(s) => {
                setAppSettings(s);
                Storage.set('app_settings', s);
              }}
            />
          ) : (
            <DiscoveryView onJoin={handleJoinAgent} isAdult={userProfile.isAdult} />
          )}
        </div>

        <CreateSessionWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onCreate={handleCreateSession}
        />
      </ChatShell>
    </div>
  );

};

export default App;
