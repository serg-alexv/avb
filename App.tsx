import React, { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';

// Dynamic imports
const ChatInterface = React.lazy(() => import('./components/ChatInterface'));
const ProfileView = React.lazy(() => import('./components/ProfileView'));
const DiscoveryView = React.lazy(() => import('./components/DiscoveryView'));
const CreateSessionWizard = React.lazy(() => import('./components/CreateSessionWizard'));


import { Route, Switch, useLocation } from "wouter";
import { ROUTES } from './routes';
import { ChatShell } from './components/ChatShell';
import { ChatConfig } from './types';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { SoundProvider } from './contexts/SoundContext';
import { ModalProvider, useModal } from './contexts/ModalContext';
import { GoogleGenAI } from "@google/genai";

const ParticleBackground = React.lazy(() => import('./components/ParticleBackground'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
  </div>
);

const AppContent = () => {
  const { t } = useTranslation();
  const { appSettings, updateSettings, toggleTheme, isDark } = useSettings();
  const { userProfile, updateProfile, isWizardOpen, setWizardOpen } = useUser();
  const {
    sessions, activeSessionId, currentView, setCurrentView, setActiveSessionId, sessionTimer,
    handleCreateSession, handleJoinAgent, handleSend, handleDeleteSession, handleArchiveSession,
    funnySlogan, joinP2P
  } = useSession();

  const { openRulePopup, openRoomModal, openLegalModal, openPublicRoomJoin } = useModal() as any; // Cast for now if interface incomplete, or updated context defines public join separately? 
  // Actually, I should update ModalContext to support direct joinPublicRoom call if DiscoveryView needs it.
  // Wait, `handleJoinPublicRoom` in App.tsx was: `await joinCloudRoom(id, '1:1', topic);`.
  // My ModalContext `activeRoomModalActions` exposes 'join' which calls `joinCloudRoom`. 
  // But wait, DiscoveryView typically calls `onJoinPublicRoom` directly without opening the modal first? 
  // Or does it? DiscoveryView calls `onCloudRoomJoin` to OPEN the modal, but `onJoinPublicRoom` to JOIN immediately.
  // I need to ensure `useModal` or `useSession` covers this. `joinCloudRoom` is in `useSession`.
  // So `DiscoveryView` can just use `joinCloudRoom` from `useSession`? No, `DiscoveryView` doesn't use `useSession`. It receives props.
  // I will pass a wrapper using `useSession`'s `joinCloudRoom`.

  const [location, setLocation] = useLocation();

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeSessionsList = sessions.filter(s => !s.archived);
  const archivedSessionsList = sessions.filter(s => s.archived);

  // Wrapper for DiscoveryView's direct join (if needed, else it uses Modal)
  const { joinCloudRoom } = useSession();
  const handleDirectJoinPublic = async (id: string, topic: string) => {
    try { await joinCloudRoom(id, '1:1', topic); } catch (e) { console.error(e); }
  };

  return (
    <div className={`flex h-full w-full ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      <Suspense fallback={null}>
        <ParticleBackground isDark={isDark} />
      </Suspense>

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
            fetchFunnyRule={(e) => { e.stopPropagation(); openRulePopup(); }}
            onOpenLegal={openLegalModal}
          />
        }
        isSidebarOpen={true}
        onToggleSidebar={() => { }}
      >
        <div className="h-full w-full flex flex-col relative overflow-hidden">
          <Suspense fallback={<LoadingSpinner />}>
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
                onCloudRoomJoin={openRoomModal}
                onJoinPublicRoom={handleDirectJoinPublic}
                isAdult={userProfile.isAdult}
              />
            )}
          </Suspense>
        </div>

        <Suspense fallback={null}>
          {isWizardOpen && (
            <CreateSessionWizard
              isOpen={isWizardOpen}
              onClose={() => setWizardOpen(false)}
              onCreate={(config, title) => {
                handleCreateSession(config, title);
                setWizardOpen(false);
              }}
              userProfile={userProfile}
              onUpdateProfile={updateProfile}
            />
          )}
        </Suspense>
      </ChatShell>
    </div>
  );
};

const App = () => (
  <SettingsProvider>
    <UserProvider>
      <SoundProvider>
        <SessionProvider>
          <ModalProvider>
            <AppContent />
          </ModalProvider>
        </SessionProvider>
      </SoundProvider>
    </UserProvider>
  </SettingsProvider>
);

export default App;
