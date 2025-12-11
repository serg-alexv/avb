import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Lock, Globe, Flame, User, X } from 'lucide-react';
import { ChatConfig } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [activeTab, setActiveTab] = useState<'private' | 'public'>('public');

    // Form States
    const [roomId, setRoomId] = useState('');
    const [topic, setTopic] = useState('');
    const [mode, setMode] = useState<ChatConfig['mode']>('1:1');

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !loading && onCancel()}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={e => e.stopPropagation()}
                        className="bg-white rounded-[2rem] p-0 max-w-md w-full shadow-2xl relative overflow-hidden ring-1 ring-white/20"
                    >
                        {/* Header / Tabs */}
                        <div className="flex border-b border-slate-100">
                            <button
                                onClick={() => setActiveTab('public')}
                                className={`flex-1 py-5 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'public' ? 'text-orange-600 bg-orange-50/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Globe size={18} /> Public Room
                                {activeTab === 'public' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('private')}
                                className={`flex-1 py-5 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'private' ? 'text-purple-600 bg-purple-50/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Lock size={18} /> Private ID
                                {activeTab === 'private' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: activeTab === 'public' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: activeTab === 'public' ? 10 : -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">
                                        {activeTab === 'public' ? 'Create a Topic' : 'Enter Room ID'}
                                    </h3>

                                    <div className="space-y-6 mb-8">
                                        {activeTab === 'public' ? (
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Topic</label>
                                                <input
                                                    autoFocus
                                                    disabled={loading}
                                                    value={topic}
                                                    onChange={e => setTopic(e.target.value)}
                                                    placeholder="e.g. 'Late Night Thoughts'"
                                                    className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none text-slate-800 disabled:opacity-50 font-medium transition-all"
                                                    onKeyDown={e => e.key === 'Enter' && !loading && topic.trim() && onCreatePublic(topic, mode)}
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">{t('room_modal.room_id_label')}</label>
                                                <input
                                                    autoFocus
                                                    disabled={loading}
                                                    value={roomId}
                                                    onChange={e => setRoomId(e.target.value)}
                                                    placeholder={t('room_modal.room_id_placeholder')}
                                                    className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-400 outline-none text-slate-800 disabled:opacity-50 font-mono transition-all"
                                                    onKeyDown={e => e.key === 'Enter' && !loading && roomId && onJoinPrivate(roomId, mode)}
                                                />
                                            </div>
                                        )}

                                        {/* Mode Selector */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Room Mode</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { id: '1:1', label: '1 on 1', icon: User },
                                                    { id: 'group_3', label: 'Group (3)', icon: Users },
                                                    { id: 'gangbang', label: 'Large Group', icon: Flame },
                                                ].map(m => (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => setMode(m.id as any)}
                                                        className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-200 ${mode === m.id
                                                            ? (activeTab === 'public' ? 'border-orange-500 bg-orange-50/50 text-orange-700 shadow-sm' : 'border-purple-500 bg-purple-50/50 text-purple-700 shadow-sm')
                                                            : 'border-slate-100 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <m.icon size={20} />
                                                        <span className="text-[10px] font-bold uppercase tracking-wide">{m.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-2xl border border-red-100 flex items-start gap-3"
                                >
                                    <div className="p-1 bg-red-100 rounded-lg"><div className="text-xl">⚠️</div></div>
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    disabled={loading}
                                    onClick={onCancel}
                                    className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl disabled:opacity-50 transition-colors"
                                >
                                    {t('room_modal.cancel_btn')}
                                </button>
                                <button
                                    disabled={loading || (activeTab === 'public' && !topic.trim()) || (activeTab === 'private' && !roomId)}
                                    onClick={() => activeTab === 'public' ? onCreatePublic(topic, mode) : onJoinPrivate(roomId, mode)}
                                    className={`px-8 py-3 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 ${activeTab === 'public' ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/20' : 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/20'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t('room_modal.connecting')}
                                        </>
                                    ) : (
                                        activeTab === 'public' ? 'Create Room' : 'Join Room'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RoomModal;
