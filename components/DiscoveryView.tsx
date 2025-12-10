
import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import { Agent } from '../types';
import { DISCOVERY_AGENTS } from '../constants';

const DiscoveryView = ({ onJoin, isAdult }: { onJoin: (agent: Agent) => void, isAdult: boolean }) => {
    const [showNsfw, setShowNsfw] = useState(false);
    
    // Filter agents
    const agents = DISCOVERY_AGENTS.filter(a => {
        if (!isAdult) return !a.isNsfw;
        if (showNsfw) return true; // Show all if spicy mode on
        return !a.isNsfw; // Show safe only if spicy mode off
    });

    return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Compass className="text-blue-500" /> Discovery</h1>
            <p className="text-gray-500 text-sm mt-1">Find your perfect AI partner.</p>
         </div>
         {isAdult && (
            <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200 shadow-sm cursor-pointer" onClick={() => setShowNsfw(!showNsfw)}>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${!showNsfw ? 'bg-teal-100 text-teal-700' : 'text-gray-400'}`}>Safe</div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${showNsfw ? 'bg-red-100 text-red-700' : 'text-gray-400'}`}>Spicy</div>
            </div>
         )}
      </div>
      
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
