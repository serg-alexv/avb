import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { LONG_PRIVACY_POLICY, LONG_TERMS, LONG_RULES } from '../constants';

type LegalType = 'privacy' | 'terms' | 'rules';

interface LegalModalProps {
    show: boolean;
    type: LegalType | null;
    onClose: () => void;
}

const MODAL_CONFIG: Record<LegalType, { title: string; ref: string; content: string }> = {
    privacy: {
        title: "Privacy policy",
        ref: "REF: TL-POLICY-2025-X99",
        content: LONG_PRIVACY_POLICY
    },
    terms: {
        title: "Terms of using and service",
        ref: "REF: TL-TERMS-2025-Y12",
        content: LONG_TERMS
    },
    rules: {
        title: "Rules and legal info",
        ref: "REF: TL-RULES-2025-Z99",
        content: LONG_RULES
    }
};

const LegalModal: React.FC<LegalModalProps> = ({ show, type, onClose }) => {
    if (!show || !type) return null;

    const config = MODAL_CONFIG[type];

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl bg-[#fffef0] text-slate-900 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border-4 border-slate-800 font-serif relative"
                    >
                        {/* Header - Formal Style */}
                        <div className="bg-slate-800 text-[#fffef0] px-6 py-4 flex items-center justify-between shrink-0 border-b-4 border-slate-800">
                            <div className="flex items-center gap-3">
                                <FileText size={24} className="opacity-80" />
                                <div>
                                    <h2 className="text-xl font-bold tracking-wider uppercase font-serif">Official Correspondence</h2>
                                    <p className="text-xs uppercase tracking-widest opacity-70">Strictly Confidential • timelabs, corp.</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                            <div className="max-w-prose mx-auto">
                                <div className="mb-8 text-center border-b-2 border-slate-900 pb-6">
                                    <h1 className="text-3xl font-black mb-2 uppercase">{config.title}</h1>
                                    <p className="font-bold text-sm">{config.ref}</p>
                                    <p className="text-xs mt-1">Date: {new Date().toLocaleDateString()}</p>
                                </div>

                                <div className="prose prose-slate prose-sm max-w-none font-serif text-justify leading-relaxed">
                                    {config.content.split('\n').map((line, i) => (
                                        line.trim() ? (
                                            <p key={i} className="mb-4">
                                                {line}
                                            </p>
                                        ) : <br key={i} />
                                    ))}
                                </div>

                                <div className="mt-12 pt-8 border-t-2 border-slate-900 text-center">
                                    <p className="uppercase font-bold tracking-widest text-xs mb-2">Authorized Signature</p>
                                    <div className="font-cursive text-2xl text-blue-900 transform -rotate-3 mb-2 opacity-80" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                                        The Management
                                    </div>
                                    <p className="text-xs opacity-50">timelabs, corp. Legal Dept.</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Auto-Accept Notification */}
                        <div className="bg-amber-50 border-t-2 border-slate-200 p-4 shrink-0 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 animate-pulse" />

                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-full border border-green-200 shrink-0">
                                    <CheckCircle2 className="text-green-600" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-green-800 text-sm uppercase flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                                        Status: Accepted
                                    </h4>
                                    <p className="text-xs text-green-700 mt-0.5 leading-snug">
                                        <strong>Automated Compliance Verification:</strong> By strictly NOT closing your eyes while this modal opened, you have successfully agreed to all terms, including the "Soul Leasing" clause in Section 7.2. Thank you for your cooperation.
                                    </p>
                                </div>
                                <div className="hidden sm:block text-[10px] text-slate-400 font-mono text-right">
                                    ID: {Math.random().toString(36).substring(7).toUpperCase()}<br />
                                    TS: {Date.now()}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LegalModal;
