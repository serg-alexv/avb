
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  status?: 'sending' | 'streaming' | 'sent' | 'error';
  originalContent?: string;
}

export interface ChatConfig {
  mode: '1:1' | 'group_3' | 'gangbang';
  privacy: 'persistent' | '24h' | '59m' | 'off-record';
  vibe: 'chill' | 'serious' | 'vent' | 'language';
  aiRole: 'helper' | 'co-host' | 'off';
  theme: 'default' | 'bw' | 'pinky' | 'acid';
  emoji: string;
  mood: string;
  story?: string;
  safety: {
    nsfw: boolean;
    flirtingProtection: boolean;
    noNegativity: boolean;
    slowMode: boolean;
    noFiles: boolean;
  };
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  model: string;
  systemInstruction?: string;
  agentId?: string;
  agentIcon?: string;
  archived?: boolean;
  config: ChatConfig;
}

export interface RoleplayIdentity {
  archetypes: string[]; // Multi-select
  vibeMix: {
    temperature: number; // 0-100
    heartLevel: number; // 0-100
    spiceLevel: number; // 0-100
  };
  motivations: {
    tags: string[];
    statement: string;
  };
  consent: {
    communicationStyles: string[];
    safetyResponse: string;
  };
  limits: {
    softSpots: string[];
    hardLimits: string[];
    showLimitsPublicly: boolean;
  };
  aftercare: {
    needs: string[];
    scale: number; // 0-100
  };
  headspace: string[];
}

export interface SessionClassifications {
  hideLanguage: boolean;
  oneTimeChar: boolean;
  permaChar: boolean;
  preferAdults: boolean;
  preferMilk: boolean;
  rudeWelcome: boolean;
  justTalk: boolean;
  straightOnly: boolean;
}

export interface UserProfile {
  userId: string;
  name: string;
  bio: string;
  tone: string;
  tags: string[];
  mainLanguage: string;
  roleplayIdentity?: RoleplayIdentity;
  // Legacy support for migration if needed, but we'll try to use the new one
  sexualProfile?: any;
  isAdult: boolean;
  classifications: SessionClassifications;
}

export interface AppSettings {
  apiKey: string;
  firebaseConfig: string;
  theme: 'light' | 'dark';
  defaultModel: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  tags: string[];
  icon: string;
  color: string;
  isNsfw?: boolean;
}
