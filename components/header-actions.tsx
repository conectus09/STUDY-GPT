"use client";

import { useState } from "react";
import { Crown, LogIn, Play } from "lucide-react";
import { AuthModal } from "@/components/auth-modal";
import { StartChatButton } from "@/components/start-chat-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UpgradeLoginPrompt } from "@/components/upgrade-login-prompt";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface HeaderActionsProps {
  className?: string;
  layout?: "horizontal" | "sidebar";
  onAction?: () => void;
}

export function HeaderActions({
  className,
  layout = "horizontal",
  onAction,
}: HeaderActionsProps) {
  const { isLoggedIn } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuth = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
    onAction?.();
  };

  const handleUpgrade = () => {
    if (!isLoggedIn) {
      setUpgradePromptOpen(true);
      onAction?.();
      return;
    }

    window.alert("Premium upgrade is coming soon!");
    onAction?.();
  };

  const handleStartClick = () => {
    onAction?.();
  };

  const handleLoginFromUpgrade = () => {
    setUpgradePromptOpen(false);
    openAuth("login");
  };

  return (
    <>
      <nav
        className={cn(
          "header-actions",
          layout === "sidebar" && "header-actions-sidebar",
          className,
        )}
        aria-label="Main actions"
      >
        <StartChatButton
          variant="ghost"
          className="header-action header-action-start"
          onClick={handleStartClick}
          aria-label="Start chat"
          title="Start"
        >
          <Play className="header-action-icon" strokeWidth={2.25} />
          <span>Start</span>
        </StartChatButton>

        <button
          type="button"
          onClick={() => openAuth("login")}
          className="header-action header-action-login"
          aria-label="Login"
          title="Login"
        >
          <LogIn className="header-action-icon" strokeWidth={2.25} />
          <span>Login</span>
        </button>

        <ThemeSwitcher variant="header" onOpen={onAction} />

        <button
          type="button"
          onClick={handleUpgrade}
          className="header-action header-action-upgrade"
          aria-label="Upgrade"
          title="Upgrade"
        >
          <Crown className="header-action-icon" strokeWidth={2.25} />
          <span>Upgrade</span>
        </button>
      </nav>

      <UpgradeLoginPrompt
        open={upgradePromptOpen}
        onClose={() => setUpgradePromptOpen(false)}
        onLogin={handleLoginFromUpgrade}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}