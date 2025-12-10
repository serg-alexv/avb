
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RulePopupProps {
    show: boolean;
    text: string;
    loading: boolean;
    onClose: () => void;
}

const RulePopup: React.FC<RulePopupProps> = ({ show, text, loading, onClose }) => {
    const { t } = useTranslation();

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">📜</div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900"><Sparkles className="text-purple-600" /> {t('rules.title')}</h3>
                <div className="text-lg font-medium text-center py-4 text-slate-800 min-h-[100px] flex items-center justify-center">
                    {loading ? (
                        <span className="animate-pulse text-gray-400">{t('rules.consulting')}</span>
                    ) : (
                        `"${text}"`
                    )}
                </div>
                <button onClick={onClose} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold mt-2 hover:bg-purple-700">{t('rules.understood_btn')}</button>
            </div>
        </div>
    );
};

export default RulePopup;
