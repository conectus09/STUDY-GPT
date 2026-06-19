"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  RoomAudioRenderer,
  useConnectionState,
  useRoomContext,
} from "@livekit/components-react";
import { ConnectionState, RoomEvent } from "livekit-client";
import {
  CHAT_TOPIC,
  SYSTEM_TOPIC,
  TYPING_HEARTBEAT_MS,
  TYPING_IDLE_MS,
  TYPING_PARTNER_TIMEOUT_MS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  WhatsAppChatShell,
  type ChatMessage,
} from "@/components/whatsapp-chat-shell";

interface WhatsAppChatProps {
  localIdentity: string;
  partnerName?: string | null;
  partnerAge?: number | null;
  partnerLeft?: boolean;
  onNext: () => void;
  onEndChat: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function WhatsAppChat({
  localIdentity,
  partnerName,
  partnerAge,
  partnerLeft,
  onNext,
  onEndChat,
  onBack,
  isLoading,
}: WhatsAppChatProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [partnerLeftMessage, setPartnerLeftMessage] = useState<string | null>(
    null,
  );
  const [partnerTyping, setPartnerTyping] = useState(false);
  const partnerLeftShownRef = useRef(false);
  const isTypingRef = useRef(false);
  const lastTypingSentRef = useRef(0);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partnerTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isConnected = connectionState === ConnectionState.Connected;
  const partnerHasLeft = partnerLeftMessage != null;
  const canSend =
    isConnected && !isLoading && !isSending && !partnerHasLeft;

  const publishTyping = useCallback(
    async (active: boolean) => {
      if (!room || !isConnected) return;

      try {
        const encoded = new TextEncoder().encode(
          JSON.stringify({
            type: "typing",
            active,
            sender: localIdentity,
            timestamp: Date.now(),
          }),
        );
        await room.localParticipant.publishData(encoded, {
          reliable: false,
          topic: SYSTEM_TOPIC,
        });
      } catch {
        // ignore typing publish failures
      }
    },
    [isConnected, localIdentity, room],
  );

  const stopLocalTyping = useCallback(() => {
    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      void publishTyping(false);
    }
  }, [publishTyping]);

  const schedulePartnerTypingClear = useCallback(() => {
    if (partnerTypingTimerRef.current) {
      clearTimeout(partnerTypingTimerRef.current);
    }
    partnerTypingTimerRef.current = setTimeout(() => {
      setPartnerTyping(false);
    }, TYPING_PARTNER_TIMEOUT_MS);
  }, []);

  const showPartnerLeftNotice = useCallback(() => {
    if (partnerLeftShownRef.current) return;
    partnerLeftShownRef.current = true;
    const name = (partnerName ?? "Stranger").toUpperCase();
    setPartnerLeftMessage(`OOPS THE ${name} LEFT THE CHAT`);
  }, [partnerName]);

  useEffect(() => {
    if (!room) return;

    const onParticipantDisconnected = (participant: { identity: string }) => {
      if (participant.identity !== localIdentity) {
        showPartnerLeftNotice();
      }
    };

    room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    return () => {
      room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    };
  }, [localIdentity, room, showPartnerLeftNotice]);

  useEffect(() => {
    if (partnerLeft) {
      showPartnerLeftNotice();
    }
  }, [partnerLeft, showPartnerLeftNotice]);

  useEffect(() => {
    if (!room) return;

    const onData = (
      payload: Uint8Array,
      participant?: { identity?: string },
      _kind?: unknown,
      topic?: string,
    ) => {
      if (topic === SYSTEM_TOPIC) {
        try {
          const parsed = JSON.parse(new TextDecoder().decode(payload)) as {
            type?: string;
            active?: boolean;
            sender?: string;
          };

          if (
            parsed.type === "typing" &&
            parsed.sender &&
            parsed.sender !== localIdentity
          ) {
            setPartnerTyping(!!parsed.active);
            if (parsed.active) {
              schedulePartnerTypingClear();
            }
          }
        } catch {
          // ignore malformed typing events
        }
        return;
      }

      if (topic !== CHAT_TOPIC) return;

      try {
        const parsed = JSON.parse(new TextDecoder().decode(payload)) as {
          id: string;
          text: string;
          timestamp: number;
        };

        const sender = participant?.identity ?? "Stranger";
        setMessages((prev) => {
          if (prev.some((m) => m.id === parsed.id)) return prev;
          return [
            ...prev,
            {
              id: parsed.id,
              sender,
              text: parsed.text,
              timestamp: parsed.timestamp,
              isLocal: sender === localIdentity,
            },
          ];
        });
      } catch {
        // ignore malformed messages
      }
    };

    room.on("dataReceived", onData);
    return () => {
      room.off("dataReceived", onData);
    };
  }, [localIdentity, room, schedulePartnerTypingClear]);

  useEffect(
    () => () => {
      stopLocalTyping();
      if (partnerTypingTimerRef.current) {
        clearTimeout(partnerTypingTimerRef.current);
      }
    },
    [stopLocalTyping],
  );

  const handleDraftChange = useCallback(
    (value: string) => {
      setDraft(value);
      if (sendError) setSendError(null);
      if (!canSend) return;

      if (!value.trim()) {
        stopLocalTyping();
        return;
      }

      const now = Date.now();
      if (
        !isTypingRef.current ||
        now - lastTypingSentRef.current > TYPING_HEARTBEAT_MS
      ) {
        isTypingRef.current = true;
        lastTypingSentRef.current = now;
        void publishTyping(true);
      }

      if (typingStopTimerRef.current) {
        clearTimeout(typingStopTimerRef.current);
      }
      typingStopTimerRef.current = setTimeout(() => {
        stopLocalTyping();
      }, TYPING_IDLE_MS);
    },
    [canSend, publishTyping, sendError, stopLocalTyping],
  );

  const sendMessage = useCallback(async () => {
    const text = draft.trim();
    if (!text || !room || !canSend) return;

    const message = {
      id: `${localIdentity}-${Date.now()}`,
      text,
      timestamp: Date.now(),
    };

    setIsSending(true);
    setSendError(null);
    stopLocalTyping();

    try {
      const encoded = new TextEncoder().encode(JSON.stringify(message));
      await room.localParticipant.publishData(encoded, {
        reliable: true,
        topic: CHAT_TOPIC,
      });

      setMessages((prev) => [
        ...prev,
        { ...message, sender: localIdentity, isLocal: true },
      ]);
      setDraft("");
    } catch {
      setSendError("Connection lost. Wait to reconnect or skip to the next stranger.");
    } finally {
      setIsSending(false);
    }
  }, [canSend, draft, localIdentity, room, stopLocalTyping]);

  const statusText = partnerTyping
    ? "typing..."
    : isConnected
      ? "online"
      : connectionState === ConnectionState.Connecting ||
          connectionState === ConnectionState.Reconnecting ||
          connectionState === ConnectionState.SignalReconnecting
        ? "connecting..."
        : "offline";

  const statusClassName = partnerTyping
    ? "text-sky-400"
    : isConnected
      ? "text-emerald-400"
      : "text-amber-400";

  return (
    <>
      <RoomAudioRenderer />
      <WhatsAppChatShell
        partnerName={partnerName}
        partnerAge={partnerAge}
        partnerLeftMessage={partnerLeftMessage}
        partnerTyping={partnerTyping}
        statusText={statusText}
        statusClassName={cn(statusClassName)}
        messages={messages}
        draft={draft}
        onDraftChange={handleDraftChange}
        canSend={canSend}
        isSending={isSending}
        sendError={sendError}
        onSend={() => {
          void sendMessage();
        }}
        onNext={onNext}
        onEndChat={onEndChat}
        onBack={onBack}
        isLoading={isLoading}
      />
    </>
  );
}