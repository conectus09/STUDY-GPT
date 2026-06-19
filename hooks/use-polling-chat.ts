"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CHAT_POLL_INTERVAL_MS,
  TYPING_HEARTBEAT_MS,
  TYPING_IDLE_MS,
} from "@/lib/constants";
import type { ChatMessage } from "@/components/whatsapp-chat-shell";

interface UsePollingChatOptions {
  roomId: string;
  userId: string;
  partnerId: string | null;
  enabled?: boolean;
}

export function usePollingChat({
  roomId,
  userId,
  partnerId,
  enabled = true,
}: UsePollingChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const lastTimestampRef = useRef(0);
  const isTypingRef = useRef(false);
  const lastTypingSentRef = useRef(0);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendTyping = useCallback(
    async (active: boolean) => {
      if (!enabled) return;

      try {
        await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId,
            userId,
            action: "typing",
            active,
          }),
        });
      } catch {
        // typing is best-effort
      }
    },
    [enabled, roomId, userId],
  );

  const stopLocalTyping = useCallback(() => {
    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      void sendTyping(false);
    }
  }, [sendTyping]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function poll() {
      try {
        const params = new URLSearchParams({
          roomId,
          since: String(lastTimestampRef.current),
        });
        if (partnerId) params.set("partnerId", partnerId);

        const response = await fetch(`/api/chat?${params.toString()}`);
        if (!response.ok) throw new Error("Poll failed");

        const data = (await response.json()) as {
          messages: Array<{
            id: string;
            sender: string;
            text: string;
            timestamp: number;
          }>;
          partnerTyping: boolean;
        };

        if (cancelled) return;

        setIsConnected(true);
        setPartnerTyping(data.partnerTyping);

        if (data.messages.length > 0) {
          setMessages((prev) => {
            const merged = [...prev];
            for (const message of data.messages) {
              if (merged.some((entry) => entry.id === message.id)) continue;
              merged.push({
                ...message,
                isLocal: message.sender === userId,
              });
              lastTimestampRef.current = Math.max(
                lastTimestampRef.current,
                message.timestamp,
              );
            }
            return merged;
          });
        }
      } catch {
        if (!cancelled) {
          setIsConnected(false);
        }
      }
    }

    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, CHAT_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, partnerId, roomId, userId]);

  const handleDraftChange = useCallback(
    (value: string, canSend: boolean) => {
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
        void sendTyping(true);
      }

      if (typingStopTimerRef.current) {
        clearTimeout(typingStopTimerRef.current);
      }
      typingStopTimerRef.current = setTimeout(() => {
        stopLocalTyping();
      }, TYPING_IDLE_MS);
    },
    [sendTyping, stopLocalTyping],
  );

  const sendMessage = useCallback(
    async (text: string, canSend: boolean) => {
      const trimmed = text.trim();
      if (!trimmed || !canSend) return false;

      setIsSending(true);
      setSendError(null);
      stopLocalTyping();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId,
            userId,
            action: "message",
            text: trimmed,
          }),
        });

        if (!response.ok) {
          throw new Error("Send failed");
        }

        const data = (await response.json()) as {
          message: {
            id: string;
            sender: string;
            text: string;
            timestamp: number;
          };
        };

        setMessages((prev) => {
          if (prev.some((entry) => entry.id === data.message.id)) return prev;
          lastTimestampRef.current = Math.max(
            lastTimestampRef.current,
            data.message.timestamp,
          );
          return [
            ...prev,
            {
              ...data.message,
              isLocal: true,
            },
          ];
        });

        return true;
      } catch {
        setSendError("Message failed to send. Try again.");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [roomId, stopLocalTyping, userId],
  );

  useEffect(
    () => () => {
      stopLocalTyping();
    },
    [stopLocalTyping],
  );

  return {
    messages,
    partnerTyping,
    isConnected,
    sendError,
    isSending,
    handleDraftChange,
    sendMessage,
    setSendError,
  };
}