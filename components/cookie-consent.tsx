"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import {
  ALL_COOKIE_PREFERENCES,
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_VERSION,
  COOKIE_CONSENT_VERSION_KEY,
  ESSENTIAL_ONLY_PREFERENCES,
  type CookiePreferences,
  parseCookiePreferences,
} from "@/lib/cookie-consent";

function saveConsent(prefs: CookiePreferences, choice: string) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
  localStorage.setItem(COOKIE_CONSENT_VERSION_KEY, COOKIE_CONSENT_VERSION);
  localStorage.setItem(`${COOKIE_CONSENT_KEY}-choice`, choice);
}

function hasValidConsent(): boolean {
  try {
    const version = localStorage.getItem(COOKIE_CONSENT_VERSION_KEY);
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    return version === COOKIE_CONSENT_VERSION && parseCookiePreferences(raw) !== null;
  } catch {
    return false;
  }
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hasValidConsent()) {
      setVisible(true);
    }
  }, [mounted]);

  const dismiss = useCallback((nextPrefs: CookiePreferences, choice: string) => {
    saveConsent(nextPrefs, choice);
    setVisible(false);
  }, []);

  if (!mounted || !visible) return null;

  return createPortal(
    <div className="cookie-consent-root">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        className="cookie-consent-bar"
      >
        <p className="cookie-consent-text">
          We use essential cookies to run {APP_NAME} and optional cookies for themes
          and preferences. Choose what you&apos;re comfortable with below. Read our{" "}
          <Link href="/cookies" className="cookie-consent-link">
            Cookie Policy
          </Link>{" "}
          for full details.
        </p>

        <div className="cookie-consent-actions">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cookie-consent-btn cookie-consent-btn-decline"
            onClick={() => dismiss(ESSENTIAL_ONLY_PREFERENCES, "decline")}
          >
            Decline
          </Button>
          <Button
            type="button"
            size="sm"
            className="cookie-consent-btn cookie-consent-btn-accept"
            onClick={() => dismiss(ALL_COOKIE_PREFERENCES, "all")}
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}