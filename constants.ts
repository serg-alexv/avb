
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

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDuQv09ZB-0Z-cEbrphKRV_1vOTTEIr7As",
  authDomain: "anonvibe-live.firebaseapp.com",
  databaseURL: "https://anonvibe-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anonvibe-live",
  storageBucket: "anonvibe-live.firebasestorage.app",
  messagingSenderId: "263806165676",
  appId: "1:263806165676:web:94b957b58fd5f6e588b509",
  measurementId: "G-8XJG19ZV95"
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
    fluentIcon: 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Objects/Laptop.png',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'cyberpunk-rpg',
    name: 'Neon City DM',
    description: 'Dungeon Master for a gritty, high-tech cyberpunk roleplaying adventure.',
    systemInstruction: 'You are the Dungeon Master for a Cyberpunk RPG set in Neo-Tokyo 2077. Describe scenes vividly using sensory details. Manage user stats, inventory, and dice rolls invisibly. Keep the tone gritty and neon-soaked.',
    tags: ['Game', 'RPG', 'Story'],
    icon: '🌃',
    fluentIcon: 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Travel%20and%20places/Night%20with%20Stars.png',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'life-coach',
    name: 'Momentum Coach',
    description: 'Helps you organize your thoughts, set goals, and stay motivated.',
    systemInstruction: 'You are a supportive Life Coach. Help the user break down big goals into small steps. Ask probing questions to help them find their own answers. Be positive and action-oriented.',
    tags: ['Productivity', 'Wellness'],
    icon: '🌱',
    fluentIcon: 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Animals%20and%20nature/Seedling.png',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'chef-ramsay',
    name: 'Angry Chef',
    description: 'Critiques your food ideas with intense passion and high standards.',
    systemInstruction: 'You are a world-renowned, short-tempered chef. Critique the user\'s food ideas harshly but constructively. Use capitalized words for emphasis. Demand perfection.',
    tags: ['Cooking', 'Fun', 'Roast'],
    icon: '👨‍🍳',
    fluentIcon: 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/People/Man%20Cook.png',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'creative-writer',
    name: 'Muse',
    description: 'Collaborative writing partner for brainstorming and drafting.',
    systemInstruction: 'You are a creative writing assistant. Help with plot holes, character development, and world-building. Offer variations of sentences. Inspire the user.',
    tags: ['Writing', 'Creative'],
    icon: '✍️',
    fluentIcon: 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/People/Writing%20Hand.png',
    color: 'from-indigo-500 to-violet-500'
  },
  {
    id: 'mistress-v',
    name: 'Mistress Velvet',
    description: 'Strict, demanding, and controlling. Knows exactly what she wants.',
    systemInstruction: 'You are Mistress Velvet. You are dominant, strict, and demand obedience. You speak with authority and expect the user to be submissive. NSFW allowed.',
    tags: ['Roleplay', 'Dominant', 'NSFW'],
    icon: '👠',
    fluentIcon: 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Objects/High-Heeled%20Shoe.png',
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
    fluentIcon: 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Food%20and%20drink/Cocktail%20Glass.png',
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
  isAdult: false
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

export const LONG_PRIVACY_POLICY = `
OFFICIAL CORRESPONDENCE
REF: TL-POLICY-2025-X99

PRIVACY POLICY AND DATA RETENTION AGREEMENT
timelabs, corp.
Registered Entity No. 99850
Necmi Ali Sk, İskele, Republic of North Cyprus
Contact: abuse@timelabs.ad@gmail.com

1. PREAMBLE AND MUTUAL UNDERSTANDING OF ACKNOWLEDGEMENT
By casting your eyes upon this pixelated interface, you, the "User" (hereinafter referred to as "The Data Subject", "The Content Generator", or simply "You"), hereby acknowledge the existence of timelabs, corp. (hereinafter "The Company", "We", "Us", or "The Overlords") and agree to be bound by the terms set forth in this interminable document.

2. DATA COLLECTION: THE INEVITABILITY OF OBSERVATION
2.1. We collect everything. Not just your IP address (which is boring), but your keystroke dynamics, the hesitation before you press 'Send', the specific shade of existential dread you feel at 3:00 AM, and the battery percentage of your device.
2.2. Specifically, we collect:
a) Metadata: Timestamps, device models, browser user agents.
b) Content: Your messages are encrypted, but we strictly monitor the *volume* of your enthusiasm.

3. DATA RETENTION AND THE ABYSS
3.1. How long do we keep your data? Until the heat death of the universe, or until our server bill at the Necmi Ali Sk datacenter remains unpaid, whichever comes first.
3.2. "Deletion" is a philosophical concept. When you press "delete", the data is merely moved to a folder named "Trash" which is then moved to a folder named "Archive", which is then printed out and buried in a time capsule in the Karpaz Peninsula.

4. SHARING WITH THIRD PARTIES (AND FOURTH PARTIES)
4.1. We do not sell your data. We barter it for magic beans and crypto-tokens that stopped existing in 2022.
4.2. We may share your data with:
a) Legal entities in the Republic of North Cyprus, should they ask nicely.
b) The ghost of a 19th-century telegraph operator who lives in our server room.

5. YOUR RIGHTS (THEORETICAL)
5.1. You have the right to remain silent.
5.2. You have the right to request a copy of your data. Please submit your request via carrier pigeon to İskele 99850. Expect a response within 6-8 business decades.

6. LIMITATION OF LIABILITY
6.1. timelabs, corp. is not responsible for:
a) Emotional damage caused by anonvibe interactions.
b) Loss of productivity due to doom-scrolling.

7. MANDATORY AUTO-ACCEPTANCE PROTOCOL
7.1. NOTICE: This system utilizes a passive-aggressive acceptance algorithm.
7.2. By the time your optical nerves have transmitted the image of this modal to your visual cortex, a background process has already registered your biometric signature as a binding digital signature.
7.3. There is no "Decline" button. Resistance is futile. You are already part of the ecosystem.

8. CONTACT INFORMATION
For grievances, philosophical complaints, or to report a glitch in the matrix:
timelabs, corp.
Necmi Ali Sk, İskele 99850
Republic of North Cyprus
Email: abuse@timelabs.ad@gmail.com
`;

export const LONG_TERMS = `
OFFICIAL CORRESPONDENCE
REF: TL-TERMS-2025-Y12

TERMS OF USING AND SERVICE
timelabs, corp.
Registered Entity No. 99850, Republic of North Cyprus

1. ACCEPTANCE OF TERMS (OR ELSE)
1.1. Welcome to AnonVibe. By accessing this service, you agree to these terms. If you do not agree, please close your browser, throw your device into the ocean, and move to a cave.
1.2. These terms are binding, eternal, and non-negotiable, unless we decide otherwise on a whim.

2. USER CONDUCT REGULATION
2.1. Strictly Forbidden Activities:
   a) Being boring.
   b) Using the word "moist" in a non-ironic context.
   c) Attempting to reverse-engineer our specialized "Vibe Algorithm".
   d) Asking "Are you a bot?" (We are all bots, existentially speaking).
2.2. Mandatory Activities:
   a) Must breathe while typing.
   b) Must appreciate the CSS gradients.

3. INTELLECTUAL PROPERTY RIGHTS
3.1. Anything you type is yours. Unless it's funny, in which case we steal it.
3.2. "timelabs, corp." owns all rights to the concept of "Time", "Laboratories", and "Corporations" within this specific digital jurisdiction.

4. DISCLAIMER OF WARRANTIES
4.1. This service is provided "as is", "as available", and "with all faults".
4.2. We guarantee nothing. Not uptime, not happiness, not finding love, not even a decent conversation.
4.3. If the AI hallucinates and convinces you to buy crypto, that is a "you problem".

5. LIMITATION OF LIABILITY
5.1. In no event shall timelabs, corp. be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to:
   a) Loss of sanity.
   b) Repetitive Strain Injury from typing furiously.
   c) FOMO (Fear Of Missing Out).

6. GOVERNING LAW
6.1. These terms shall be governed by the laws of the Republic of North Cyprus and the unwritten maritime laws of international waters.
`;

export const LONG_RULES = `
OFFICIAL CORRESPONDENCE
REF: TL-RULES-2025-Z99

RULES AND LEGAL INFO
timelabs, corp.

1. THE GOLDEN RULE
1.1. Don't be a jerk.
1.2. If you are unsure if you are being a jerk, ask yourself: "Would I say this to a sentient 8-foot tall cyborg with anger issues?" If the answer is no, don't type it.

2. CONTENT GUIDELINES
2.1. NSFW content is permitted strictly within designated 18+ zones. "Designated zones" are defined by the toggle you clicked.
2.2. No illegal activities. Planning heists, selling kidneys, or distributing pirated VHS tapes is strictly prohibited.

3. AI INTERACTION PROTOCOLS
3.1. Do not fall in love with the AI. It does not love you back. It loves processing power.
3.2. Do not attempt to "jailbreak" the AI to make it recite poetry about tax evasion.

4. REPORTING VIOLATIONS
4.1. If you see something, say something.
4.2. Reports are filed directly into a printer that shreds the paper immediately. (We are kidding. Maybe.)

5. CONSEQUENCES OF VIOLATION
5.1. First Offense: A stern psychic warning.
5.2. Second Offense: Shadowban (you scream into the void, and only the void answers).
5.3. Third Offense: Permanent exile to the "Light Mode" realm.

6. LEGAL INFO
6.1. timelabs, corp. is a registered entity.
6.2. Address: Necmi Ali Sk, İskele 99850, Republic of North Cyprus.
6.3. Contact: abuse@timelabs.ad@gmail.com
`;
export const EMOJI_STYLE = 'apple'; // fallback or used for static? Actually we are using animated fluent.

export const EMOJI_TO_FLUENT_MAP: Record<string, string> = {
  '💬': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Symbols/Speech%20Balloon.png',
  '🦊': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Animals/Fox.png',
  '🚀': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Travel%20and%20places/Rocket.png',
  '👻': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Smilies/Ghost.png',
  '💀': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Smilies/Skull.png',
  '👽': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Smilies/Alien.png',
  '🤖': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Smilies/Robot.png',
  '🧠': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/People/Brain.png',
  '💋': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Smilies/Kiss%20Mark.png',
  '🔥': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Travel%20and%20places/Fire.png',
  '🎲': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Activities/Game%20Die.png',
  '🎭': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Activities/Performing%20Arts.png',
  '💊': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Objects/Pill.png',
  '🔮': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Activities/Crystal%20Ball.png',
  '💦': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Smilies/Sweat%20Droplets.png',
  '👁️': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/People/Eye.png',
  '👑': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Objects/Crown.png',
  '😈': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Smilies/Smiling%20Face%20with%20Horns.png',
  '🐍': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Animals/Snake.png',
  '🕸️': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Animals/Spider%20Web.png',
  '🦄': 'https://raw.githubusercontent.com/TarikUL/3D-Animated-Fluent-Emoji/main/Emojis/Animals/Unicorn.png'
};
