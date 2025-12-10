
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Layout Components ---

export const ChatShell = ({
    children, sidebar, isSidebarOpen, onToggleSidebar
}: {
    children: React.ReactNode, sidebar: React.ReactNode, isSidebarOpen: boolean, onToggleSidebar: () => void
}) => {
    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
            {/* Animated Gradient Background Blob */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[20%] w-[70vh] h-[70vh] rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl filter"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 50, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[10%] w-[50vh] h-[50vh] rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-3xl filter"
                />
            </div>

            {/* Sidebar with Framer Motion */}
            <AnimatePresence mode='wait'>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -320, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="z-20 w-80 h-full border-r border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl shrink-0 absolute md:relative"
                    >
                        {sidebar}
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">
                {children}
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden"
                    onClick={onToggleSidebar}
                />
            )}
        </div>
    );
};

// --- Atomic Design Tokens / Components ---

export const TokenButton = ({ children, onClick, active, variant = 'default', className }: { children: React.ReactNode, onClick?: () => void, active?: boolean, variant?: 'default' | 'ghost' | 'glass', className?: string }) => {
    const variants = {
        default: "bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-sm",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
        glass: "bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 text-slate-900 dark:text-white"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
                variants[variant],
                active && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950",
                className
            )}
        >
            {children}
        </motion.button>
    );
};

export const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
            "rounded-3xl border border-white/20 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-black/5",
            className
        )}
    >
        {children}
    </motion.div>
);
