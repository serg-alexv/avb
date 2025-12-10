
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SESSION_PALETTES } from "../constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getSessionPalette = (id: string) => {
    if (!id) return SESSION_PALETTES[0];
    const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return SESSION_PALETTES[sum % SESSION_PALETTES.length];
};
