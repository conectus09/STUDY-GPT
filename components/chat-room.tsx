"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { WhatsAppChat } from "@/components/whatsapp-chat";
import { WhatsAppChatPolling } from "@/components/whatsapp-chat-polling";

type ChatMode = "loading" | "livekit" | "polling";

interface ChatRoomProps {
  roomId: string;
  userId: string;
  partnerId: string | null;
  partnerName?: string | null;
  partnerAge?: number | null;
  partnerLeft?: boolean;
  onNext: () => void;
  onEnd: () => void;
  onBack?: () => void;
}

export function ChatRoom({
  roomId,
  userId,
  partnerId,
  partnerName,
  partnerAge,
  partnerLeft,
  onNext,
  onEnd,
  onBack,
}: ChatRoomProps) {
  const [mode, setMode] = useState<ChatMode>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const leavingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setError(null);

      try {
        const configResponse = await fetch("/api/config");
        if (!configResponse.ok) {
          throw new Error("Failed to detect chat mode");
        }

        const config = (await configResponse.json()) as {
          livekit?: boolean;
          mode?: "livekit" | "polling";
        };

        if (cancelled) return;

        if (config.mode === "polling" || !config.livekit) {
          // No LiveKit keys on Render/local — use built-in HTTP polling chat.
          setMode("polling");
          return;
        }

        const response = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName: roomId, participantName: userId }),
        });

        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          throw new Error(body.error ?? "Failed to get LiveKit token");
        }

        const data = (await response.json()) as {
          token: string;
          serverUrl: string;
        };

        if (!cancelled) {
          setToken(data.token);
          setServerUrl(data.serverUrl);
          setMode("livekit");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Connection failed");
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [roomId, userId]);

  const handleLeave = useCallback(() => {
    leavingRef.current = true;
    setIsLoading(true);
    onEnd();
  }, [onEnd]);

  const handleNext = useCallback(() => {
    leavingRef.current = true;
    setIsLoading(true);
    onNext();
  }, [onNext]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <p className="font-medium text-red-200">{error}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Add LiveKit env vars on Render for real-time mode, or redeploy to use
          the built-in polling chat fallback.
        </p>
      </div>
    );
  }

  if (mode === "loading" || (mode === "livekit" && (!token || !serverUrl))) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (mode === "polling") {
    return (
      <WhatsAppChatPolling
        roomId={roomId}
        userId={userId}
        partnerId={partnerId}
        partnerName={partnerName}
        partnerAge={partnerAge}
        partnerLeft={partnerLeft}
        onNext={handleNext}
        onEndChat={handleLeave}
        onBack={onBack}
        isLoading={isLoading}
      />
    );
  }

  return (
    <LiveKitRoom
      token={token!}
      serverUrl={serverUrl!}
      connect={!isLoading}
      audio={false}
      video={false}
      className="h-dvh w-full"
      onDisconnected={() => {
        if (!leavingRef.current) onEnd();
      }}
    >
      <WhatsAppChat
        localIdentity={userId}
        partnerName={partnerName}
        partnerAge={partnerAge}
        partnerLeft={partnerLeft}
        onNext={handleNext}
        onEndChat={handleLeave}
        onBack={onBack}
        isLoading={isLoading}
      />
    </LiveKitRoom>
  );
}