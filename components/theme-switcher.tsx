"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Moon,
  Sparkles,
  Sun,
  Sunset,
  TreePine,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { THEMES, type ThemeId, type ThemeOption } from "@/lib/themes";
import { cn } from "@/lib/utils";

const ICONS = {
  moon: Moon,
  sun: Sun,
  stars: Sparkles,
  sunset: Sunset,
  waves: Waves,
  tree: TreePine,
} as const;

function ThemePreviewCard({
  option,
  isActive,
  onSelect,
}: {
  option: ThemeOption;
  isActive: boolean;
  onSelect: () => void;
}) {
  const Icon = ICONS[option.icon];

  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-200",
        isActive
          ? "theme-card-active"
          : "border-border hover:border-[var(--accent-border)]",
      )}
    >
      <div
        className="relative h-9 w-full"
        style={{
          background: `linear-gradient(135deg, ${option.preview.bg} 0%, ${option.preview.card} 55%, ${option.preview.accent}33 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-1 px-2">
          <span
            className="h-3.5 w-3.5 rounded border border-white/20"
            style={{ backgroundColor: option.preview.card }}
          />
          <span
            className="h-3.5 flex-1 rounded border border-white/20"
            style={{ backgroundColor: option.preview.bg }}
          />
          <span
            className="h-3.5 w-3.5 rounded-full border border-white/20"
            style={{ backgroundColor: option.preview.accent }}
          />
        </div>
        {isActive && (
          <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-black">
            <Check className="h-2.5 w-2.5" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 border-t border-border bg-card px-2 py-1.5">
        <Icon
          className="h-3 w-3 shrink-0"
          style={{ color: option.preview.accent }}
        />
        <p className="truncate text-[11px] font-medium text-foreground">
          {option.label}
        </p>
      </div>
    </button>
  );
}

export function ThemeSwitcher({
  className,
  variant = "default",
  onOpen,
}: {
  className?: string;
  variant?: "default" | "header" | "chat";
  onOpen?: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const active = THEMES.find((item) => item.id === theme);
  const ActiveIcon = active ? ICONS[active.icon] : Waves;
  const isHeader = variant === "header";
  const isChat = variant === "chat";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSelect = (id: ThemeId) => {
    setTheme(id);
    setOpen(false);
  };

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) onOpen?.();
      return next;
    });
  };

  return (
    <div className={cn("relative", className)}>
      {isChat ? (
        <button
          type="button"
          onClick={toggleOpen}
          className="whatsapp-theme-btn"
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Change theme"
          title={active?.label ?? "Theme"}
        >
          <ActiveIcon
            className="h-4 w-4"
            strokeWidth={2.25}
            style={{ color: active?.preview.accent ?? "var(--accent)" }}
          />
        </button>
      ) : isHeader ? (
        <button
          type="button"
          onClick={toggleOpen}
          className="header-action header-action-theme"
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Change theme"
        >
          <ActiveIcon
            className="header-action-icon"
            strokeWidth={2.25}
            style={{ color: active?.preview.accent ?? "var(--accent)" }}
          />
          <span>{active?.label ?? "Theme"}</span>
        </button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleOpen}
          className="h-8 gap-1.5 px-2.5"
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Change theme"
        >
          <ActiveIcon
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: active?.preview.accent ?? "var(--accent)" }}
          />
          <span className="hidden text-xs sm:inline">{active?.label ?? "Theme"}</span>
        </Button>
      )}

      {open &&
        mounted &&
        createPortal(
          <>
            <div
              className={cn(
                "theme-overlay fixed inset-0 bg-black/40 backdrop-blur-[1px]",
                isChat ? "z-[480]" : "z-[200]",
              )}
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <div
              ref={pickerRef}
              role="dialog"
              aria-label="Choose a theme"
              className={cn(
                "theme-picker fixed overflow-hidden rounded-xl border border-border bg-card shadow-xl",
                isChat
                  ? "theme-picker-chat inset-x-4 bottom-24 z-[490] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-20 sm:w-[280px]"
                  : "inset-x-4 bottom-4 z-[210] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-14 sm:w-[280px]",
              )}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <p className="text-xs font-medium text-foreground">Themes</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                  aria-label="Close theme picker"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div
                role="listbox"
                aria-label="Theme options"
                className="grid grid-cols-3 gap-1.5 p-2"
              >
                {THEMES.map((option) => (
                  <ThemePreviewCard
                    key={option.id}
                    option={option}
                    isActive={theme === option.id}
                    onSelect={() => handleSelect(option.id)}
                  />
                ))}
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}