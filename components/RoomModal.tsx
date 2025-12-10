import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Lock, Globe, Flame, User } from 'lucide-react';
import { ChatConfig } from '../types';

interface RoomModalProps {
    show: boolean;
    loading: boolean;
    error: string | null;
    onJoinPrivate: (roomId: string, mode: ChatConfig['mode']) => void;
    onCreatePublic: (topic: string, mode: ChatConfig['mode']) => void;
    onCancel: () => void;
}

const RoomModal: React.FC<RoomModalProps> = ({
    show,
    loading,
    error,
    onJoinPrivate,
    onCreatePublic,
    onCancel,
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'private' | 'public'>('public'); // Default to public as requested "Discovery" focus

    // Form States
    const [roomId, setRoomId] = useState('');
    const [topic, setTopic] = useState('');
    const [mode, setMode] = useState<ChatConfig['mode']>('1:1');

    if (!show) return null;

    const handleSubmit = () => {
        if (loading) return;
        if (activeTab === 'private') {
            onJoinPrivate(roomId, mode);
        } else {
            if (!topic.trim()) return;
            onCreatePublic(topic, mode);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => !loading && onCancel()}>
            <div className="bg-white rounded-2xl p-0 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header / Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('public')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'public' ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Globe size={16} /> Create Public Room
                    </button>
                    <button
                        onClick={() => setActiveTab('private')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'private' ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Lock size={16} /> Join Private ID
                    </button>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-slate-900">
                        {activeTab === 'public' ? 'Start a New Convo' : 'Enter Secret Room'}
                    </h3>

                    <div className="space-y-4 mb-6">
                        {activeTab === 'public' ? (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room Topic / Name</label>
                                <input
                                    autoFocus
                                    disabled={loading}
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                    placeholder="e.g. 'Late Night Thoughts' or 'Debate Club'"
                                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none text-slate-800 disabled:opacity-50"
                                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('room_modal.room_id_label')}</label>
                                <input
                                    autoFocus
                                    disabled={loading}
                                    value={roomId}
                                    onChange={e => setRoomId(e.target.value)}
                                    placeholder={t('room_modal.room_id_placeholder')}
                                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-slate-800 disabled:opacity-50"
                                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">{t('room_modal.random_room_hint')}</p>
                            </div>
                        )}

                        {/* Mode Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Room Mode</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: '1:1', label: '1 on 1', icon: User },
                                    { id: 'group_3', label: 'Group (3)', icon: Users },
                                    { id: 'gangbang', label: 'Gangbang', icon: Flame },
                                ].map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMode(m.id as any)}
                                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${mode === m.id
                                                ? (activeTab === 'public' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-purple-500 bg-purple-50 text-purple-700')
                                                : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                            }`}
                                    >
                                        <m.icon size={20} />
                                        <span className="text-[10px] font-bold uppercase">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-2 justify-end">
                        <button
                            disabled={loading}
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            {t('room_modal.cancel_btn')}
                        </button>
                        <button
                            disabled={loading || (activeTab === 'public' && !topic.trim())}
                            onClick={handleSubmit}
                            className={`px-6 py-2 text-white font-bold rounded-lg disabled:opacity-70 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform ${activeTab === 'public' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {t('room_modal.connecting')}
                                </>
                            ) : (
                                activeTab === 'public' ? 'Create & Join' : t('room_modal.join_btn')
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomModal;
