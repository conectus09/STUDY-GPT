"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHAT_TOPIC } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isLocal: boolean;
}

interface TextChatProps {
  localIdentity: string;
}

export function TextChat({ localIdentity }: TextChatProps) {
  const room = useRoomContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!room) return;

    const onData = (
      payload: Uint8Array,
      participant?: { identity?: string },
      _kind?: unknown,
      topic?: string,
    ) => {
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
  }, [localIdentity, room]);

  const sendMessage = useCallback(async () => {
    const text = draft.trim();
    if (!text || !room) return;

    const message = {
      id: `${localIdentity}-${Date.now()}`,
      text,
      timestamp: Date.now(),
    };

    const encoded = new TextEncoder().encode(JSON.stringify(message));
    await room.localParticipant.publishData(encoded, {
      reliable: true,
      topic: CHAT_TOPIC,
    });

    setMessages((prev) => [
      ...prev,
      {
        ...message,
        sender: localIdentity,
        isLocal: true,
      },
    ]);
    setDraft("");
  }, [draft, localIdentity, room]);

  return (
    <div className="theme-panel flex h-full flex-col rounded-2xl backdrop-blur-sm">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Text Chat</h3>
        <p className="text-xs text-muted">Messages are sent via LiveKit</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted">
            Say hello to start the conversation
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[85%]",
                message.isLocal ? "ml-auto items-end" : "items-start",
              )}
            >
              <span className="mb-1 text-[10px] uppercase tracking-wider text-muted">
                {message.isLocal ? "You" : "Stranger"}
              </span>
              <div
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm",
                  message.isLocal ? "message-local" : "message-remote",
                )}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage();
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
        />
        <Button type="submit" size="icon" disabled={!draft.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}