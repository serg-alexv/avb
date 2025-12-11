import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';

interface MoodSelectorProps {
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
    isDark: boolean;
}

const MoodSelector = ({ value, onChange, suggestions, isDark }: MoodSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredSuggestions = suggestions.filter(s =>
        s.toLowerCase().includes(filter.toLowerCase())
    );

    useEffect(() => {
        setFilter(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
                setFilter(value); // Reset filter to current value on open? Or keep empty? 
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % filteredSuggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredSuggestions[activeIndex]) {
                selectMood(filteredSuggestions[activeIndex]);
            } else if (filter) {
                selectMood(filter); // Allow custom value
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const selectMood = (mood: string) => {
        onChange(mood);
        setFilter(mood);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all duration-200 ${isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'
                    }`}
            >
                <Sparkles size={10} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                <input
                    ref={inputRef}
                    type="text"
                    value={isOpen ? filter : value}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        if (!isOpen) setIsOpen(true);
                        setActiveIndex(0);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setFilter(value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Set mood..."
                    className={`w-full bg-transparent text-[10px] font-bold outline-none placeholder-opacity-50 ${isDark ? 'text-slate-300 placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'
                        }`}
                />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`focus:outline-none transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                    <ChevronDown size={10} className="opacity-50" />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar p-1 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'
                            }`}
                    >
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((mood, i) => (
                                <button
                                    key={mood}
                                    onClick={() => selectMood(mood)}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 transition-colors ${i === activeIndex
                                            ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700')
                                            : (isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
                                        }`}
                                    onMouseEnter={() => setActiveIndex(i)}
                                >
                                    <span>{mood}</span>
                                    {value === mood && <span className="ml-auto opacity-50">✓</span>}
                                </button>
                            ))
                        ) : (
                            <div className="p-2 text-center text-[10px] opacity-50">
                                Press Enter to set custom mood
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MoodSelector;
