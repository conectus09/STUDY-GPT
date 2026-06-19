"use client";

import { useEffect, useRef, useState } from "react";
import {
  isTrackReference,
  useLocalParticipant,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const remoteTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: true },
  );
  const { localParticipant, isCameraEnabled } = useLocalParticipant();

  const [pipPos, setPipPos] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const remoteVideo = remoteTracks
    .filter(isTrackReference)
    .find(
      (track) => track.participant.identity !== localParticipant.identity,
    );

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const pipWidth = 160;
      const pipHeight = 120;

      const x = Math.min(
        Math.max(e.clientX - rect.left - dragOffset.current.x, 8),
        rect.width - pipWidth - 8,
      );
      const y = Math.min(
        Math.max(e.clientY - rect.top - dragOffset.current.y, 8),
        rect.height - pipHeight - 8,
      );

      setPipPos({ x, y });
    };

    const onUp = () => setIsDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="theme-card relative aspect-video w-full overflow-hidden rounded-2xl lg:aspect-auto lg:h-full lg:min-h-[420px]"
    >
      {remoteVideo ? (
        <VideoTrack
          trackRef={remoteVideo}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="video-panel-bg flex h-full min-h-[280px] items-center justify-center">
          <div className="text-center">
            <div className="pip-glow mx-auto mb-3 h-16 w-16 animate-pulse rounded-full" />
            <p className="text-sm text-muted">Waiting for video...</p>
          </div>
        </div>
      )}

      <div
        className={cn(
          "pip-border absolute z-10 h-[120px] w-[160px] overflow-hidden rounded-xl border-2 bg-card shadow-2xl",
          isDragging && "cursor-grabbing",
        )}
        style={{ left: pipPos.x, top: pipPos.y }}
      >
        <button
          type="button"
          className="absolute left-1 top-1 z-20 flex h-6 w-6 cursor-grab items-center justify-center rounded-md bg-card text-muted hover:bg-card-hover active:cursor-grabbing"
          onPointerDown={(e) => {
            const rect = e.currentTarget.parentElement?.getBoundingClientRect();
            if (!rect) return;
            dragOffset.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            };
            setIsDragging(true);
          }}
          aria-label="Drag local video"
        >
          <GripVertical className="h-3 w-3" />
        </button>

        {isCameraEnabled ? (
          <LocalVideoPip />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Camera off
          </div>
        )}
      </div>
    </div>
  );
}

function LocalVideoPip() {
  const localTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: false }],
    { onlySubscribed: false },
  );
  const localVideo = localTracks.filter(isTrackReference)[0];

  if (!localVideo) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted">
        Starting camera...
      </div>
    );
  }

  return (
    <VideoTrack
      trackRef={localVideo}
      className="h-full w-full object-cover mirror"
    />
  );
}