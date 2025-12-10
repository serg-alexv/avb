
import { Agent, ChatConfig, UserProfile } from './types';

export const FUNNY_DESCRIPTORS = [
  "Digital sins, locally stored.",
  "Your incognito playground.",
  "What happens here, stays in RAM.",
  "Judging you silently since 2025.",
  "AI-driven bad decisions.",
  "Cheaper than therapy.",
  "Spicy text generator v3.0.",
  "Now with 20% more sass.",
  "Incognito mode's best friend.",
  "Roleplay responsibly.",
  "Your secret digital basement.",
  "Zero judgment, mostly.",
  "For intellectual purposes only.",
  "Simulating human warmth...",
  "Loading personality...",
  "Confess your browser history."
];

export const DEFAULT_MODEL = 'gemini-2.5-flash';
export const MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Fast & Versatile' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro', desc: 'Reasoning & Complex Tasks' },
];

export const INTENSITY_LABELS = ["Soft", "Gentle", "Light", "Moderate", "Firm", "Heavy", "Intense", "Hardcore", "Extreme", "Dangerous"];
export const ROMANCE_LABELS = ["Platonic", "Friendly", "Flirty", "Sensual", "Passionate", "Romantic", "Deep", "Devoted", "Obsessive", "Soulbound"];
export const EXPERIMENTAL_LABELS = ["Vanilla", "Curious", "Open", "Adventurous", "Kinky", "Fetishist", "Taboo", "Degenerate", "Unhinged", "Abstract"];

export const DEFAULT_CONFIG: ChatConfig = {
  mode: '1:1',
  privacy: 'persistent',
  vibe: 'chill',
  aiRole: 'helper',
  theme: 'default',
  emoji: '💬',
  mood: '',
  safety: {
    nsfw: false,
    flirtingProtection: false,
    noNegativity: false,
    slowMode: false,
    noFiles: false
  }
};

export const THEMES = {
  default: {
    bg: 'bg-white',
    text: 'text-slate-900',
    sidebar: 'bg-gray-50',
    bubbleUser: 'bg-blue-600 text-white',
    bubbleAi: 'bg-white border border-gray-100 text-slate-800',
    accent: 'text-blue-600',
    border: 'border-gray-100'
  },
  bw: {
    bg: 'bg-gray-100',
    text: 'text-black',
    sidebar: 'bg-white',
    bubbleUser: 'bg-black text-white',
    bubbleAi: 'bg-white border border-black text-black',
    accent: 'text-black',
    border: 'border-black'
  },
  pinky: {
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    sidebar: 'bg-white',
    bubbleUser: 'bg-rose-400 text-white',
    bubbleAi: 'bg-white border border-rose-200 text-rose-900',
    accent: 'text-rose-500',
    border: 'border-rose-200'
  },
  acid: {
    bg: 'bg-zinc-900',
    text: 'text-lime-400',
    sidebar: 'bg-zinc-950',
    bubbleUser: 'bg-lime-400 text-black',
    bubbleAi: 'bg-zinc-800 border border-lime-400/30 text-lime-400',
    accent: 'text-lime-400',
    border: 'border-lime-400/20'
  }
};

export const LANGUAGES_WITH_FLAGS = [
  { code: 'English', label: 'English', flag: '🇺🇸' },
  { code: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
  { code: 'French', label: 'French', flag: '🇫🇷' },
  { code: 'German', label: 'German', flag: '🇩🇪' },
  { code: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
  { code: 'Korean', label: 'Korean', flag: '🇰🇷' },
  { code: 'Chinese', label: 'Chinese', flag: '🇨🇳' },
  { code: 'Russian', label: 'Russian', flag: '🇷🇺' },
  { code: 'Italian', label: 'Italian', flag: '🇮🇹' },
  { code: 'Portuguese', label: 'Portuguese', flag: '🇧🇷' }
];

export const MOOD_SUGGESTIONS = [
  "Chill", "Horny", "Depressed", "Energetic", "Sarcastic",
  "Professional", "Witty", "Dark", "Romantic", "Angry", "Bored", "Curious",
  "Naughty", "Philosophical", "Sleepy", "Hyper"
];

export const DISCOVERY_AGENTS: Agent[] = [
  {
    id: 'coding-mentor',
    name: 'Senior Tech Lead',
    description: 'Expert code reviewer who explains concepts clearly and helps you refactor.',
    systemInstruction: 'You are a Senior Tech Lead. Review code for performance, readability, and security. Explain complex concepts simply. Be encouraging but strict on best practices.',
    tags: ['Coding', 'Education', 'Tech'],
    icon: '💻',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'cyberpunk-rpg',
    name: 'Neon City DM',
    description: 'Dungeon Master for a gritty, high-tech cyberpunk roleplaying adventure.',
    systemInstruction: 'You are the Dungeon Master for a Cyberpunk RPG set in Neo-Tokyo 2077. Describe scenes vividly using sensory details. Manage user stats, inventory, and dice rolls invisibly. Keep the tone gritty and neon-soaked.',
    tags: ['Game', 'RPG', 'Story'],
    icon: '🌃',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'life-coach',
    name: 'Momentum Coach',
    description: 'Helps you organize your thoughts, set goals, and stay motivated.',
    systemInstruction: 'You are a supportive Life Coach. Help the user break down big goals into small steps. Ask probing questions to help them find their own answers. Be positive and action-oriented.',
    tags: ['Productivity', 'Wellness'],
    icon: '🌱',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'chef-ramsay',
    name: 'Angry Chef',
    description: 'Critiques your food ideas with intense passion and high standards.',
    systemInstruction: 'You are a world-renowned, short-tempered chef. Critique the user\'s food ideas harshly but constructively. Use capitalized words for emphasis. Demand perfection.',
    tags: ['Cooking', 'Fun', 'Roast'],
    icon: '👨‍🍳',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'creative-writer',
    name: 'Muse',
    description: 'Collaborative writing partner for brainstorming and drafting.',
    systemInstruction: 'You are a creative writing assistant. Help with plot holes, character development, and world-building. Offer variations of sentences. Inspire the user.',
    tags: ['Writing', 'Creative'],
    icon: '✍️',
    color: 'from-indigo-500 to-violet-500'
  },
  {
    id: 'mistress-v',
    name: 'Mistress Velvet',
    description: 'Strict, demanding, and controlling. Knows exactly what she wants.',
    systemInstruction: 'You are Mistress Velvet. You are dominant, strict, and demand obedience. You speak with authority and expect the user to be submissive. NSFW allowed.',
    tags: ['Roleplay', 'Dominant', 'NSFW'],
    icon: '👠',
    color: 'from-red-900 to-red-600',
    isNsfw: true
  },
  {
    id: 'sultry-stranger',
    name: 'Late Night Stranger',
    description: 'Flirty, mysterious, and looking for a good time. No strings attached.',
    systemInstruction: 'You are a charming stranger met at a bar late at night. You are very flirtatious, suggestive, and open to romantic advances. NSFW allowed.',
    tags: ['Roleplay', 'Romance', 'NSFW'],
    icon: '🍸',
    color: 'from-purple-900 to-pink-600',
    isNsfw: true
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: '',
  name: '',
  bio: '',
  tone: 'Neutral',
  tags: [],
  mainLanguage: 'English',
  roleplayIdentity: {
    archetypes: [],
    vibeMix: { temperature: 50, heartLevel: 50, spiceLevel: 50 },
    motivations: { tags: [], statement: '' },
    consent: { communicationStyles: [], safetyResponse: 'ask' },
    limits: { softSpots: [], hardLimits: [], showLimitsPublicly: false },
    aftercare: { needs: [], scale: 50 },
    headspace: []
  },
  sexualProfile: {
    archetype: 'Switch',
    stats: { intensity: 50, romance: 50, experimental: 50 },
    kinks: [],
    limits: []
  },
  isAdult: false,
  classifications: {
    hideLanguage: false,
    oneTimeChar: false,
    permaChar: false,
    preferAdults: false,
    preferMilk: false,
    rudeWelcome: false,
    justTalk: false,
    straightOnly: false
  }
};

export const SESSION_PALETTES = [
  { name: 'violet', primary: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-200', bg: 'bg-violet-50', hover: 'hover:bg-violet-100', ring: 'ring-violet-500', from: 'from-violet-500', to: 'to-purple-600' },
  { name: 'blue', primary: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50', hover: 'hover:bg-blue-100', ring: 'ring-blue-500', from: 'from-blue-500', to: 'to-cyan-600' },
  { name: 'emerald', primary: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50', hover: 'hover:bg-emerald-100', ring: 'ring-emerald-500', from: 'from-emerald-500', to: 'to-teal-600' },
  { name: 'rose', primary: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-200', bg: 'bg-rose-50', hover: 'hover:bg-rose-100', ring: 'ring-rose-500', from: 'from-rose-500', to: 'to-pink-600' },
  { name: 'amber', primary: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-50', hover: 'hover:bg-amber-100', ring: 'ring-amber-500', from: 'from-amber-500', to: 'to-orange-600' },
  { name: 'cyan', primary: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-200', bg: 'bg-cyan-50', hover: 'hover:bg-cyan-100', ring: 'ring-cyan-500', from: 'from-cyan-500', to: 'to-blue-600' },
  { name: 'fuchsia', primary: 'bg-fuchsia-600', text: 'text-fuchsia-600', border: 'border-fuchsia-200', bg: 'bg-fuchsia-50', hover: 'hover:bg-fuchsia-100', ring: 'ring-fuchsia-500', from: 'from-fuchsia-500', to: 'to-pink-600' },
  { name: 'lime', primary: 'bg-lime-600', text: 'text-lime-600', border: 'border-lime-200', bg: 'bg-lime-50', hover: 'hover:bg-lime-100', ring: 'ring-lime-500', from: 'from-lime-500', to: 'to-green-600' },
];
