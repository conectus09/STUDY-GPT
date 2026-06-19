"use client";

import { RefreshCw } from "lucide-react";
import { isCaptchaChar, splitCaptchaPairs } from "@/lib/captcha";
import { cn } from "@/lib/utils";

interface CaptchaDisplayProps {
  code: string;
  onRefresh: () => void;
}

function CaptchaChar({ char, index }: { char: string; index: number }) {
  const isNumber = /\d/.test(char);

  return (
    <span
      className={cn(
        "auth-captcha-char inline-flex h-6 w-5 items-center justify-center rounded border text-[0.65rem] font-bold",
        isNumber ? "auth-captcha-char-number" : "auth-captcha-char-letter",
      )}
      style={{
        transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (3 + (index % 3))}deg)`,
      }}
    >
      {char}
    </span>
  );
}

function CaptchaPair({ pair, offset }: { pair: string; offset: number }) {
  return (
    <div className="flex items-center gap-1">
      {pair.split("").map((char, index) => (
        <CaptchaChar
          key={`${char}-${index}`}
          char={isCaptchaChar(char) ? char : "?"}
          index={offset + index}
        />
      ))}
    </div>
  );
}

export function CaptchaDisplay({ code, onRefresh }: CaptchaDisplayProps) {
  const [pair1, pair2] = splitCaptchaPairs(code);

  return (
    <div className="auth-captcha-panel relative overflow-hidden border">
      <div className="relative flex items-center justify-between gap-1.5 px-2 py-1.5">
        <div className="flex items-center gap-1">
          <CaptchaPair pair={pair1} offset={0} />
          <span className="auth-captcha-separator font-bold text-muted">-</span>
          <CaptchaPair pair={pair2} offset={4} />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-card text-muted transition-colors hover:bg-card-hover hover:text-foreground"
          aria-label="Refresh captcha"
        >
          <RefreshCw className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}