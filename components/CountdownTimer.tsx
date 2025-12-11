import React, { useEffect, useState } from 'react';

export const CountdownTimer = ({ targetDate }: { targetDate: number }) => {
    const [timeLeft, setTimeLeft] = useState(Math.max(0, targetDate - Date.now()));

    useEffect(() => {
        const interval = setInterval(() => {
            const newTime = Math.max(0, targetDate - Date.now());
            setTimeLeft(newTime);
            if (newTime <= 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return <span className="font-mono">{formatTime(timeLeft)}</span>;
};
