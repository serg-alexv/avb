import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProfileView from './components/ProfileView';
import DiscoveryView from './components/DiscoveryView';
import CreateSessionWizard from './components/CreateSessionWizard';
import { ChatShell } from './components/ChatShell';
import RulePopup from './components/RulePopup';
import RoomModal from './components/RoomModal';

import { ChatConfig } from './types';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { GoogleGenAI } from "@google/genai";

const AppContent = () => {
  const { t } = useTranslation();
  const { appSettings, updateSettings, toggleTheme, isDark } = useSettings();
  const { userProfile, updateProfile, isWizardOpen, setWizardOpen } = useUser();
  const {
    sessions, activeSessionId, currentView, setCurrentView, setActiveSessionId, sessionTimer,
    handleCreateSession, handleJoinAgent, handleSend, handleDeleteSession, handleArchiveSession,
    funnySlogan, joinP2P, joinCloudRoom, createPublicRoom
  } = useSession();

  // Local UI state for modals that are not global
  const [rulePopup, setRulePopup] = useState<{ show: boolean, text: string, loading: boolean }>({ show: false, text: '', loading: false });
  const [roomModalState, setRoomModalState] = useState<{ show: boolean, loading: boolean, error: string | null }>({ show: false, loading: false, error: null });

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeSessionsList = sessions.filter(s => !s.archived);
  const archivedSessionsList = sessions.filter(s => s.archived);

  const fetchFunnyRule = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRulePopup({ show: true, text: '', loading: true });
    try {
      const ai = new GoogleGenAI({ apiKey: appSettings.apiKey || process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a short, funny, witty, and slightly scandalous "rule" for an anonymous NSFW chat app user. Max 15 words. Paradoxical style.',
      });
      setRulePopup({ show: true, text: response.text || t('rules.rule_404'), loading: false });
    } catch {
      setRulePopup({ show: true, text: t('rules.rule_1'), loading: false });
    }
  };

  const handleJoinPrivate = async (roomId: string, mode: ChatConfig['mode']) => { // Type fix needed if mode strict
    if (!roomId.trim()) roomId = crypto.randomUUID().slice(0, 8);
    setRoomModalState(p => ({ ...p, loading: true, error: null }));
    try {
      await joinCloudRoom(roomId, mode);
      setRoomModalState(p => ({ ...p, show: false, loading: false }));
    } catch (e: any) {
      console.error(e);
      let errorMsg = t('errors.failed_connect_generic');
      if (e.message?.includes("permission-denied") || e.code === 'permission-denied') {
        errorMsg = t('errors.permission_denied');
      }
      setRoomModalState(p => ({ ...p, loading: false, error: errorMsg }));
    }
  };

  const handleCreatePublic = async (topic: string, mode: ChatConfig['mode']) => {
    setRoomModalState(p => ({ ...p, loading: true, error: null }));
    try {
      const roomId = await createPublicRoom(topic);
      await joinCloudRoom(roomId, mode, topic);
      setRoomModalState(p => ({ ...p, show: false, loading: false }));
    } catch (e) {
      console.error("Failed to create public room", e);
      setRoomModalState(p => ({ ...p, loading: false, error: t('errors.failed_connect_generic') }));
    }
  };

  const handleJoinPublicRoom = async (id: string, topic: string) => {
    setRoomModalState(p => ({ ...p, loading: true, error: null })); // Show loading maybe? Or just jump in.
    try {
      await joinCloudRoom(id, '1:1', topic); // mode default?
    } catch (e) {
      console.error(e);
      // handle error
    }
  };


  return (
    <div className={`flex h-full w-full ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      <RulePopup
        show={rulePopup.show}
        text={rulePopup.text}
        loading={rulePopup.loading}
        onClose={() => setRulePopup(p => ({ ...p, show: false }))}
      />

      <RoomModal
        show={roomModalState.show}
        loading={roomModalState.loading}
        error={roomModalState.error}
        onJoinPrivate={handleJoinPrivate}
        onCreatePublic={handleCreatePublic}
        onCancel={() => setRoomModalState(p => ({ ...p, show: false }))}
      />

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
            currentTheme={appSettings.theme}
            isWizardOpen={isWizardOpen}
            handleUpdateProfile={updateProfile}
            setCurrentView={setCurrentView}
            setActiveSessionId={setActiveSessionId}
            setIsWizardOpen={setWizardOpen}
            handleArchiveSession={handleArchiveSession}
            handleDeleteSession={handleDeleteSession}
            toggleTheme={toggleTheme}
            fetchFunnyRule={fetchFunnyRule}
          />
        }
        isSidebarOpen={true}
        onToggleSidebar={() => { }}
      >
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
              onUpdate={updateProfile}
              appSettings={appSettings}
              onSaveSettings={updateSettings}
            />
          ) : (
            <DiscoveryView
              onJoin={handleJoinAgent}
              onP2PJoin={joinP2P}
              onCloudRoomJoin={() => setRoomModalState({ show: true, loading: false, error: null })}
              onJoinPublicRoom={handleJoinPublicRoom}
              isAdult={userProfile.isAdult}
            />
          )}
        </div>

        <CreateSessionWizard
          isOpen={isWizardOpen}
          onClose={() => setWizardOpen(false)}
          onCreate={handleCreateSession}
          userProfile={userProfile}
          onUpdateProfile={updateProfile}
        />
      </ChatShell>
    </div>
  );
};

const App = () => (
  <SettingsProvider>
    <UserProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </UserProvider>
  </SettingsProvider>
);

export default App;
