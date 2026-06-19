"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Crown, LogIn, Sparkles, X } from "lucide-react";

interface UpgradeLoginPromptProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function UpgradeLoginPrompt({
  open,
  onClose,
  onLogin,
}: UpgradeLoginPromptProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div
        className="upgrade-prompt-overlay fixed inset-0 z-[290] bg-black/60 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Login required"
        className="upgrade-prompt fixed left-1/2 top-1/2 z-[295] w-[calc(100%-2rem)] max-w-[380px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="upgrade-prompt-accent h-1.5 w-full" />

        <button
          type="button"
          onClick={onClose}
          className="upgrade-prompt-close absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="upgrade-prompt-body px-6 pb-6 pt-8 text-center">
          <div className="upgrade-prompt-icon-shell mx-auto mb-5">
            <div className="upgrade-prompt-icon-ring" aria-hidden />
            <div className="upgrade-prompt-icon">
              <Crown className="h-7 w-7" strokeWidth={1.75} />
            </div>
          </div>

          <p className="upgrade-prompt-eyebrow mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Premium access
          </p>

          <h2 className="upgrade-prompt-title mb-2 text-xl font-bold tracking-tight text-foreground">
            Login to unlock more
          </h2>

          <p className="upgrade-prompt-copy mb-6 text-sm leading-relaxed">
            Sign in to explore premium features, save your profile, and get the full Chinwag experience.
          </p>

          <div className="upgrade-prompt-actions flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              className="upgrade-prompt-btn upgrade-prompt-btn-cancel flex-1"
              onClick={onClose}
            >
              Not now
            </button>
            <button
              type="button"
              className="upgrade-prompt-btn upgrade-prompt-btn-login flex-1"
              onClick={onLogin}
            >
              <LogIn className="h-4 w-4" />
              Login now
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}