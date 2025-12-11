import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChatShellProps {
    children: ReactNode;
    sidebar?: ReactNode;
    isSidebarOpen?: boolean;
    onToggleSidebar?: () => void;
}

export const ChatShell: React.FC<ChatShellProps> = ({ children, sidebar, isSidebarOpen = true, onToggleSidebar }) => {
    return (
        <div className="relative flex h-screen w-screen overflow-hidden bg-bg-main text-slate-100 font-sans selection:bg-accent-primary selection:text-white">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">

                {/* Blob 1 - Cyan/Blue */}
                <motion.div
                    className="absolute -top-[20%] -left-[20%] h-[90vw] w-[90vw] rounded-full blur-[150px] opacity-30 mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 60%)',
                    }}
                    animate={{
                        x: [0, 80, -40, 0],
                        y: [0, 60, -30, 0],
                        scale: [1, 1.2, 0.9, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                    }}
                />

                {/* Blob 2 - Pink/Violet */}
                <motion.div
                    className="absolute top-[10%] right-[0%] h-[80vw] w-[80vw] rounded-full blur-[160px] opacity-25 mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 60%)',
                    }}
                    animate={{
                        x: [0, -60, 40, 0],
                        y: [0, -80, 30, 0],
                        scale: [1, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                    }}
                />

                {/* Blob 3 - Violet Primary */}
                <motion.div
                    className="absolute -bottom-[30%] left-[20%] h-[100vw] w-[100vw] rounded-full blur-[180px] opacity-25 mix-blend-screen"
                    style={{
                        background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 60%)',
                    }}
                    animate={{
                        x: [0, 30, -50, 0],
                        y: [0, -30, 40, 0],
                        scale: [1, 1.05, 0.95, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                    }}
                />

                {/* Noise overlay for texture */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex h-full w-full backdrop-blur-[1px]">
                {/* Sidebar Panel */}
                {sidebar && (
                    <aside
                        className={`
                    hidden md:flex flex-col h-full border-r border-white/10 bg-black/20 
                    transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'w-[280px] xl:w-[320px]' : 'w-0 opacity-0 overflow-hidden'}
                `}
                    >
                        {sidebar}
                    </aside>
                )}

                {/* content */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
};
