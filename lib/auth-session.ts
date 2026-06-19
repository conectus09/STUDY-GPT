export const AUTH_STORAGE_KEY = "chinwag-auth-session";
export const AUTH_CHANGE_EVENT = "chinwag-auth-change";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function setLoggedIn(loggedIn: boolean) {
  if (loggedIn) {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function readAuthLoggedIn() {
  return isLoggedIn();
}

export function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
}