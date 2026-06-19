"use client";

import { useEffect, useRef, useState } from "react";

const MIN_ONLINE = 2000;
const MAX_ONLINE = 3000;
const STORAGE_KEY = "chinwag:live-count";

function clampOnline(count: number) {
  return Math.min(MAX_ONLINE, Math.max(MIN_ONLINE, count));
}

function naturalizeCount(count: number) {
  let value = clampOnline(Math.round(count));

  if (value % 100 === 0) {
    value += (Math.random() > 0.5 ? 1 : -1) * (11 + Math.floor(Math.random() * 19));
  } else if (value % 50 === 0) {
    value += (Math.random() > 0.5 ? 1 : -1) * (5 + Math.floor(Math.random() * 14));
  } else if (value % 10 === 0 && Math.random() < 0.45) {
    value += (Math.random() > 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 5));
  }

  return clampOnline(value);
}

function randomNaturalCount() {
  const cluster = Math.random();

  let value: number;
  if (cluster < 0.7) {
    const drift = (Math.random() + Math.random() + Math.random()) / 3;
    value = Math.round(2460 + (drift - 0.5) * 260);
  } else if (cluster < 0.88) {
    value = Math.round(2200 + Math.random() * 180);
  } else {
    value = Math.round(2720 + Math.random() * 220);
  }

  return naturalizeCount(value);
}

function readStoredCount() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;

    return naturalizeCount(parsed);
  } catch {
    return null;
  }
}

function writeStoredCount(count: number) {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(count));
  } catch {
    // ignore storage failures
  }
}

function randomTickDelay() {
  if (Math.random() < 0.32) {
    return 11000 + Math.random() * 16000;
  }

  return 4200 + Math.random() * 7800;
}

function nextNaturalCount(prev: number, momentum: number) {
  if (Math.random() < 0.28) {
    return { next: prev, momentum: momentum * 0.82 };
  }

  const roll = Math.random();
  let delta: number;

  if (roll < 0.58) {
    delta = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2));
  } else if (roll < 0.86) {
    const sign =
      Math.abs(momentum) > 0.15
        ? Math.sign(momentum)
        : Math.random() < 0.5
          ? -1
          : 1;
    delta = sign * (3 + Math.floor(Math.random() * 5));
  } else {
    delta = (Math.random() < 0.5 ? -1 : 1) * (8 + Math.floor(Math.random() * 10));
  }

  if (prev <= MIN_ONLINE + 35) delta = Math.abs(delta);
  if (prev >= MAX_ONLINE - 35) delta = -Math.abs(delta);

  if (prev < 2280 && delta < 0 && Math.random() < 0.72) {
    delta = Math.abs(delta);
  }

  if (prev > 2720 && delta > 0 && Math.random() < 0.72) {
    delta = -Math.abs(delta);
  }

  let next = naturalizeCount(prev + delta);

  if (next === prev) {
    const nudge = Math.random() < 0.5 ? -1 : 1;
    next = naturalizeCount(prev + nudge * (1 + Math.floor(Math.random() * 3)));
  }

  const newMomentum = momentum * 0.68 + Math.sign(next - prev) * 0.32;

  return { next, momentum: newMomentum };
}

export function LiveOnlineCounter({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [bump, setBump] = useState(0);
  const momentumRef = useRef((Math.random() - 0.5) * 0.4);

  useEffect(() => {
    const initial = readStoredCount() ?? randomNaturalCount();
    setCount(initial);
    writeStoredCount(initial);

    const scheduleTick = () =>
      window.setTimeout(() => {
        setCount((prev) => {
          if (prev === null) return prev;

          const { next, momentum } = nextNaturalCount(prev, momentumRef.current);
          momentumRef.current = momentum;

          if (next !== prev) {
            writeStoredCount(next);
            setBump((key) => key + 1);
          }

          return next;
        });

        timeoutId = scheduleTick();
      }, randomTickDelay());

    let timeoutId = scheduleTick();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const displayCount = count ?? 2527;

  return (
    <div
      className={`live-counter inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 sm:gap-2.5 sm:px-3 sm:py-1.5 ${className}`}
      aria-live="polite"
    >
      <span className="live-counter-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]">
        <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
          <span className="live-counter-ping absolute inline-flex h-full w-full rounded-full" />
          <span className="live-counter-dot relative inline-flex h-1.5 w-1.5 rounded-full" />
        </span>
        Live
      </span>

      <span className="live-counter-divider hidden h-3 w-px sm:block" aria-hidden />

      <p className="live-counter-copy whitespace-nowrap text-xs sm:text-[13px]">
        <span
          key={bump}
          className="live-counter-number font-semibold tabular-nums"
          suppressHydrationWarning
        >
          {displayCount.toLocaleString("en-US")}
        </span>
        <span className="live-counter-label"> people online now</span>
      </p>
    </div>
  );
}