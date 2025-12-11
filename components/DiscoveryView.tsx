import React, { useState, useEffect } from 'react';
import { Compass, Globe, Users } from 'lucide-react';
import { Agent, PublicRoom } from '../types';
import { DISCOVERY_AGENTS } from '../constants';
import { firestoreService } from '../services/firestore';

const DiscoveryView = ({ onJoin, onP2PJoin, onCloudRoomJoin, onJoinPublicRoom, isAdult }: {
  onJoin: (agent: Agent) => void,
  onP2PJoin: () => void,
  onCloudRoomJoin: () => void,
  onJoinPublicRoom: (id: string, topic: string) => void,
  isAdult: boolean
}) => {
  const [showNsfw, setShowNsfw] = useState(false);
  const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([]);

  useEffect(() => {
    firestoreService.subscribeToPublicRooms((rooms) => {
      setPublicRooms(rooms);
    });
  }, []);

  const totalActiveUsers = publicRooms.reduce((acc, room) => acc + (room.activeUsers || 0), 0);

  // Filter agents
  const agents = DISCOVERY_AGENTS.filter(a => {
    if (!isAdult) return !a.isNsfw;
    if (showNsfw) return true; // Show all if spicy mode on
    return !a.isNsfw; // Show safe only if spicy mode off
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Compass className="text-blue-500" /> Discovery</h1>

            {/* Global Stats Badge */}
            <div className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-2 border border-green-500/20 shadow-sm animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {totalActiveUsers > 0 ? totalActiveUsers : '0'} Online
            </div>

            {isAdult && (
              <div className="flex items-center gap-2 glass dark:glass-dark p-1 rounded-full border-transparent shadow-sm cursor-pointer ml-4" onClick={() => setShowNsfw(!showNsfw)}>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${!showNsfw ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'text-muted-foreground'}`}>Safe</div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${showNsfw ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>Spicy</div>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1 italic">"Finding love here is like looking for a salad at a strip club. Good luck."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Human P2P Card */}
        <div className="group glass dark:glass-dark rounded-3xl p-5 border-transparent hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden ring-4 ring-transparent hover:ring-purple-500/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              ⚡️
            </div>
            <button
              onClick={onP2PJoin}
              className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-full hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
            >
              Connect
            </button>
          </div>

          <h3 className="font-bold text-lg text-foreground mb-1">Random Human</h3>
          <p className="text-xs font-bold text-purple-500 mb-1 uppercase tracking-wider">Experimental</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 h-10 line-clamp-2">Connect to a random stranger for an anonymous chat. No AI, just vibes.</p>

          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">P2P</span>
            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">Anonymous</span>
          </div>
        </div>

        {/* Cloud Room Card */}
        <div className="group glass dark:glass-dark rounded-3xl p-5 border-transparent hover:shadow-xl hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden ring-4 ring-transparent hover:ring-orange-500/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-2xl flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
              🔥
            </div>
            <button
              onClick={onCloudRoomJoin}
              className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-full hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/30"
            >
              Create / Join
            </button>
          </div>

          <h3 className="font-bold text-lg text-foreground mb-1">Rooms</h3>
          <p className="text-xs font-bold text-orange-500 mb-1 uppercase tracking-wider">Beta</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 h-10 line-clamp-2">Join private or public rooms. Everyone can enter standard rooms.</p>

          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">Firebase</span>
            <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">Realtime</span>
          </div>
        </div>
      </div>

      {/* Chats availible (Filtered: > 3 users) */}
      {publicRooms.filter(r => (r.activeUsers || 0) >= 4).length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="text-green-500" size={20} /> Chats availible
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicRooms.filter(r => (r.activeUsers || 0) >= 4).map(room => (
              <div key={room.id} onClick={() => onJoinPublicRoom(room.id, room.topic)} className="cursor-pointer group glass dark:glass-dark rounded-2xl p-4 border-transparent hover:shadow-lg hover:border-green-500/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {/* Creator Flag - Using generic map or fallback */}
                    {room.creatorLang && (
                      <span className="text-lg" title={`Creator Lang: ${room.creatorLang}`}>
                        {/* Simple flag mapping or display code if no flag map avail */}
                        {room.creatorLang === 'en' ? '🇺🇸' : room.creatorLang === 'ru' ? '🇷🇺' : room.creatorLang === 'es' ? '🇪🇸' : room.creatorLang === 'fr' ? '🇫🇷' : room.creatorLang === 'de' ? '🇩🇪' : room.creatorLang === 'ja' ? '🇯🇵' : room.creatorLang === 'ko' ? '🇰🇷' : room.creatorLang === 'zh' ? '🇨🇳' : room.creatorLang === 'it' ? '🇮🇹' : room.creatorLang === 'pt' ? '🇧🇷' : '🏳️'}
                      </span>
                    )}
                    <h3 className="font-bold text-foreground">{room.topic}</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                    <Users size={10} /> {room.activeUsers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="group glass dark:glass-dark rounded-3xl p-5 border-transparent hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${agent.color}`} />
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-2xl bg-surface/50 dark:bg-black/20 flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-300">
                {agent.fluentIcon ? (
                  <img src={agent.fluentIcon} alt={agent.icon} className="w-14 h-14 object-contain drop-shadow-sm" />
                ) : (
                  <span className="text-3xl">{agent.icon}</span>
                )}
              </div>
              <button
                onClick={() => onJoin(agent)}
                className="px-4 py-1.5 bg-foreground text-background text-xs font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-black/10 group-hover:shadow-blue-500/30"
              >
                Join this
              </button>
            </div>

            <h3 className="font-bold text-lg text-foreground mb-1">{agent.name}</h3>
            {/* Added "Character bio" label */}
            <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider opacity-60">Character Bio</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 h-10 line-clamp-2">{agent.description}</p>

            <div className="flex flex-wrap gap-2">
              {agent.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-surface/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wider border border-border/50">
                  {t}
                </span>
              ))}
              {agent.isNsfw && <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold uppercase border border-red-500/20">NSFW</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryView;
