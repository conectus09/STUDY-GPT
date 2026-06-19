"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { WhatsAppChat } from "@/components/whatsapp-chat";

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
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const leavingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchToken() {
      setError(null);
      try {
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
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Connection failed");
        }
      }
    }

    void fetchToken();
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
          Run{" "}
          <code className="rounded bg-card px-1.5 py-0.5 text-foreground">
            npm run livekit
          </code>{" "}
          then{" "}
          <code className="rounded bg-card px-1.5 py-0.5 text-foreground">
            npm run dev
          </code>
        </p>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
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