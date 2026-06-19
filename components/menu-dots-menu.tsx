"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function MenuDotsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="menu-dots-wrap">
      <button
        type="button"
        className={cn("menu-dots-circle", open && "is-open")}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="menu-dots-panel"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <MoreVertical className="h-4 w-4" strokeWidth={2.25} />
      </button>

      {open && (
        <div id="menu-dots-panel" className="menu-dots-panel" role="status">
          <p className="menu-dots-panel-message">UPGRADE TO ACCESS THIS</p>
        </div>
      )}
    </div>
  );
}