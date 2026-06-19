export const COOKIE_CONSENT_KEY = "chinwag-cookie-consent";
export const COOKIE_CONSENT_VERSION_KEY = "chinwag-cookie-consent-version";
export const COOKIE_CONSENT_VERSION = "3";

export type CookieConsentChoice = "all" | "essential" | "custom";

export interface CookiePreferences {
  essential: true;
  functional: boolean;
  analytics: boolean;
}

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: true,
  analytics: false,
};

export const ESSENTIAL_ONLY_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
};

export const ALL_COOKIE_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: true,
  analytics: true,
};

export function parseCookiePreferences(raw: string | null): CookiePreferences | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookiePreferences;
    if (typeof parsed.functional !== "boolean" || typeof parsed.analytics !== "boolean") {
      return null;
    }
    return { essential: true, functional: parsed.functional, analytics: parsed.analytics };
  } catch {
    return null;
  }
}