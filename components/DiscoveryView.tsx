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
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Compass className="text-blue-500" /> Discovery</h1>

            {/* Global Stats Badge */}
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-2 border border-green-200 shadow-sm animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {totalActiveUsers > 0 ? totalActiveUsers : '0'} Online
            </div>

            {isAdult && (
              <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200 shadow-sm cursor-pointer ml-4" onClick={() => setShowNsfw(!showNsfw)}>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${!showNsfw ? 'bg-teal-100 text-teal-700' : 'text-gray-400'}`}>Safe</div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${showNsfw ? 'bg-red-100 text-red-700' : 'text-gray-400'}`}>Spicy</div>
              </div>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1 italic">"Finding love here is like looking for a salad at a strip club. Good luck."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Human P2P Card */}
        <div className="group bg-white rounded-3xl p-5 border border-purple-100 hover:shadow-xl hover:border-purple-300 transition-all duration-300 relative overflow-hidden ring-4 ring-purple-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-2xl flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform duration-300">
              ⚡️
            </div>
            <button
              onClick={onP2PJoin}
              className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-full hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
            >
              Connect
            </button>
          </div>

          <h3 className="font-bold text-lg text-slate-800 mb-1">Random Human</h3>
          <p className="text-xs font-bold text-purple-400 mb-1 uppercase tracking-wider">Experimental</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 h-10 line-clamp-2">Connect to a random stranger for an anonymous chat. No AI, just vibes.</p>

          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider border border-purple-100">P2P</span>
            <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider border border-purple-100">Anonymous</span>
          </div>
        </div>

        {/* Cloud Room Card */}
        <div className="group bg-white rounded-3xl p-5 border border-orange-100 hover:shadow-xl hover:border-orange-300 transition-all duration-300 relative overflow-hidden ring-4 ring-orange-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-2xl flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform duration-300">
              🔥
            </div>
            <button
              onClick={onCloudRoomJoin}
              className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-full hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
            >
              Create / Join
            </button>
          </div>

          <h3 className="font-bold text-lg text-slate-800 mb-1">Private Room</h3>
          <p className="text-xs font-bold text-orange-400 mb-1 uppercase tracking-wider">Beta</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 h-10 line-clamp-2">Join a persistent realtime room by ID or create a Public Room.</p>

          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider border border-orange-100">Firebase</span>
            <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider border border-orange-100">Hidden</span>
          </div>
        </div>
      </div>

      {/* Live Public Rooms Section */}
      {publicRooms.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="text-green-500" size={20} /> Live Public Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicRooms.map(room => (
              <div key={room.id} onClick={() => onJoinPublicRoom(room.id, room.topic)} className="cursor-pointer group bg-white rounded-2xl p-4 border border-green-100 hover:shadow-lg hover:border-green-300 transition-all">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800">{room.topic}</h3>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                    <Users size={10} /> Active
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
          <div key={agent.id} className="group bg-white rounded-3xl p-5 border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${agent.color}`} />
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-2xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                {agent.icon}
              </div>
              <button
                onClick={() => onJoin(agent)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200 group-hover:shadow-blue-200"
              >
                Join this
              </button>
            </div>

            <h3 className="font-bold text-lg text-slate-800 mb-1">{agent.name}</h3>
            {/* Added "Character bio" label */}
            <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Character Bio</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 h-10 line-clamp-2">{agent.description}</p>

            <div className="flex flex-wrap gap-2">
              {agent.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                  {t}
                </span>
              ))}
              {agent.isNsfw && <span className="px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-[10px] font-bold uppercase border border-red-100">NSFW</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryView;
