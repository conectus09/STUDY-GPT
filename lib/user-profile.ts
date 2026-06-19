export interface UserProfile {
  name: string;
  age: number;
  isAdultConfirmed: boolean;
}

const STORAGE_KEY = "chinwag-user-profile";

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as UserProfile;
    if (
      typeof parsed.name === "string" &&
      typeof parsed.age === "number" &&
      parsed.isAdultConfirmed === true &&
      parsed.age >= 18
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function setUserProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function hasCompletedStartGate() {
  return getUserProfile() !== null;
}