export type Platform = "linkedin" | "instagram" | "twitter";

export type Tone = "profesional" | "cercano" | "motivacional" | "controversial";

export interface UserProfile {
  name: string;
  username: string; // @username for Twitter/Instagram
  headline: string; // Job title/headline for LinkedIn
  avatarUrl: string; // Preset or custom URL
}

export interface GeneratedPost {
  id: string;
  topic: string;
  platform: Platform;
  tone: Tone;
  includeEmojis: boolean;
  includeHashtags: boolean;
  variant1: string;
  variant2: string;
  createdAt: string;
}

export const PLATFORMS = [
  { id: "linkedin" as Platform, name: "LinkedIn", color: "#0077B5", bg: "bg-[#0077B5]" },
  { id: "instagram" as Platform, name: "Instagram", color: "#E1306C", bg: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" },
  { id: "twitter" as Platform, name: "X (Twitter)", color: "#0F1419", bg: "bg-[#000000]" },
];

export const TONES = [
  { id: "profesional" as Tone, name: "Profesional", emoji: "💼", desc: "Experto, estructurado, autoritativo" },
  { id: "cercano" as Tone, name: "Cercano", emoji: "👋", desc: "Amistoso, conversacional, con anécdotas" },
  { id: "motivacional" as Tone, name: "Motivacional", emoji: "🔥", desc: "Inspirador, energético, incita a la acción" },
  { id: "controversial" as Tone, name: "Controversial", emoji: "💡", desc: "Desafía mitos, genera debate en comentarios" },
];

export const PRESET_AVATARS = [
  { id: "avatar-1", name: "Emprendedor", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: "avatar-2", name: "Consultor", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { id: "avatar-3", name: "Creadora", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: "avatar-4", name: "Tech Lead", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
];
