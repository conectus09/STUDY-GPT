export type ThemeId = "dark" | "light" | "midnight" | "sunset" | "ocean" | "forest";

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  icon: "moon" | "sun" | "stars" | "sunset" | "waves" | "tree";
  preview: {
    bg: string;
    accent: string;
    card: string;
  };
}

export const THEMES: ThemeOption[] = [
  {
    id: "ocean",
    label: "Ocean",
    description: "Cool teal waves",
    icon: "waves",
    preview: { bg: "#031016", accent: "#2dd4bf", card: "#082028" },
  },
  {
    id: "dark",
    label: "Dark",
    description: "Indigo night mode",
    icon: "moon",
    preview: { bg: "#09090b", accent: "#818cf8", card: "#18181b" },
  },
  {
    id: "light",
    label: "Light",
    description: "Bright & clean",
    icon: "sun",
    preview: { bg: "#eef0f8", accent: "#4338ca", card: "#ffffff" },
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep blue + cyan",
    icon: "stars",
    preview: { bg: "#040810", accent: "#38bdf8", card: "#0a1628" },
  },
  {
    id: "sunset",
    label: "Sunset",
    description: "Warm orange glow",
    icon: "sunset",
    preview: { bg: "#120804", accent: "#fb923c", card: "#221008" },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Emerald greens",
    icon: "tree",
    preview: { bg: "#040c07", accent: "#34d399", card: "#0a1a10" },
  },
];

export const DEFAULT_THEME: ThemeId = "ocean";
export const THEME_STORAGE_KEY = "chinwag-theme";
export const THEME_VERSION_KEY = "chinwag-theme-version";
export const CURRENT_THEME_VERSION = "2";

export function isThemeId(value: string): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}