"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  RoomAudioRenderer,
  useConnectionState,
  useRoomContext,
} from "@livekit/components-react";
import { ConnectionState, RoomEvent } from "livekit-client";
import {
  ArrowLeft,
  Phone,
  PhoneOff,
  SkipForward,
  UserRound,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  CHAT_TOPIC,
  SYSTEM_TOPIC,
  TYPING_HEARTBEAT_MS,
  TYPING_IDLE_MS,
  TYPING_PARTNER_TIMEOUT_MS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isLocal: boolean;
}

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

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const [upgradeTier, setUpgradeTier] = useState<"pro" | "max" | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [endChatConfirm, setEndChatConfirm] = useState(false);
  const [partnerLeftMessage, setPartnerLeftMessage] = useState<string | null>(
    null,
  );
  const [partnerTyping, setPartnerTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const partnerLeftShownRef = useRef(false);
  const isTypingRef = useRef(false);
  const lastTypingSentRef = useRef(0);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partnerTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isConnected = connectionState === ConnectionState.Connected;
  const partnerHasLeft = partnerLeftMessage != null;
  const canSend =
    isConnected && !isLoading && !isSending && !partnerHasLeft;

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, partnerLeftMessage, partnerTyping, scrollToBottom]);

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
      if (!isTypingRef.current || now - lastTypingSentRef.current > TYPING_HEARTBEAT_MS) {
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
    if (!endChatConfirm) return;
    const timer = window.setTimeout(() => setEndChatConfirm(false), 5000);
    return () => window.clearTimeout(timer);
  }, [endChatConfirm]);

  useEffect(() => {
    if (!upgradeTier) return;
    const timer = window.setTimeout(() => setUpgradeTier(null), 3000);
    return () => window.clearTimeout(timer);
  }, [upgradeTier]);

  const handleEndChatClick = useCallback(() => {
    if (endChatConfirm) {
      setEndChatConfirm(false);
      onEndChat();
      return;
    }
    setEndChatConfirm(true);
  }, [endChatConfirm, onEndChat]);

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

  const handleVoiceClick = useCallback(() => {
    setUpgradeTier("pro");
  }, []);

  const handleVideoClick = useCallback(() => {
    setUpgradeTier("max");
  }, []);

  return (
    <>
      <RoomAudioRenderer />

      <div className="whatsapp-chat flex h-dvh w-full overflow-hidden">
        <div className="whatsapp-split flex h-full w-full overflow-hidden">
          <aside className="whatsapp-video-box w-[30%] shrink-0">
            <div className="whatsapp-ads-box">
              <div className="whatsapp-ads-label">
                <p className="whatsapp-ads-title">ONLY FOR ADS</p>
                <p className="whatsapp-ads-subtitle">REMOVE IT UPGRADE TO MAX</p>
              </div>
            </div>
          </aside>

          <div className="whatsapp-chat-panel w-[70%] min-w-0 shrink-0">
            <header className="whatsapp-header flex shrink-0 items-center gap-2 px-2 py-3 sm:px-4">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-card-hover"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-muted text-accent">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate font-semibold text-foreground">
                    {partnerName ?? "Stranger"}
                  </p>
                  {partnerAge != null && (
                    <span className="whatsapp-partner-age shrink-0">{partnerAge}</span>
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs",
                    partnerTyping
                      ? "text-sky-400"
                      : isConnected
                        ? "text-emerald-400"
                        : "text-amber-400",
                  )}
                >
                  {partnerTyping
                    ? "typing..."
                    : isConnected
                      ? "online"
                      : connectionState === ConnectionState.Connecting ||
                          connectionState === ConnectionState.Reconnecting ||
                          connectionState === ConnectionState.SignalReconnecting
                        ? "connecting..."
                        : "offline"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <ThemeSwitcher variant="chat" />

                <button
                  type="button"
                  onClick={handleVoiceClick}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                  aria-label="Voice call"
                >
                  <Phone className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleVideoClick}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                  aria-label="Video call"
                >
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="whatsapp-messages min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-4">
              {messages.length === 0 && !partnerLeftMessage ? (
                <div className="flex h-full items-center justify-center">
                  <p className="rounded-xl bg-card/80 px-4 py-2 text-center text-sm text-muted shadow-sm">
                    Say hi to your random match — messages are live
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.isLocal ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "whatsapp-bubble max-w-[82%] px-3 py-2 shadow-sm",
                        message.isLocal
                          ? "whatsapp-bubble-out rounded-2xl rounded-br-md"
                          : "whatsapp-bubble-in rounded-2xl rounded-bl-md",
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p
                        className={cn(
                          "mt-1 text-right text-[10px]",
                          message.isLocal
                            ? "text-emerald-100/70"
                            : "text-muted",
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {partnerLeftMessage && (
                <div className="flex justify-center py-4">
                  <p className="whatsapp-partner-left-notice">{partnerLeftMessage}</p>
                </div>
              )}

              {partnerTyping && !partnerLeftMessage && (
                <div className="flex justify-start">
                  <div className="whatsapp-typing-bubble">
                    <span className="whatsapp-typing-label">
                      {partnerName ?? "Stranger"} is typing
                    </span>
                    <span className="whatsapp-typing-dots" aria-hidden>
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {sendError && (
              <p className="shrink-0 border-t border-border bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">
                {sendError}
              </p>
            )}

            <form
              className="whatsapp-input flex shrink-0 items-center gap-2 border-t border-border bg-card px-3 py-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
            >
              <Input
                value={draft}
                onChange={(event) => handleDraftChange(event.target.value)}
                placeholder={
                  partnerHasLeft
                    ? "Partner left the chat"
                    : canSend
                      ? "Type a message"
                      : "Connecting..."
                }
                autoComplete="off"
                disabled={!canSend}
                className="h-11 flex-1 rounded-full border-border bg-card-hover px-4"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim() || !canSend}
                className="h-11 w-11 shrink-0 rounded-full"
              >
                <span className="sr-only">Send</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </Button>
            </form>

            <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-card px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEndChatClick}
                disabled={isLoading}
                className={cn(
                  "gap-1.5 font-black",
                  endChatConfirm
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-200 hover:text-amber-100"
                    : "text-red-300 hover:text-red-200",
                )}
              >
                <PhoneOff className="h-3.5 w-3.5" />
                {endChatConfirm ? "Really?" : "End Chat"}
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setEndChatConfirm(false);
                  onNext();
                }}
                disabled={isLoading}
                className="gap-1.5"
              >
                <SkipForward className="h-3.5 w-3.5" />
                Next Stranger
              </Button>
            </footer>

            {upgradeTier && (
              <div className="whatsapp-upgrade-overlay" role="status" aria-live="polite">
                <div
                  className={cn(
                    "whatsapp-upgrade-box",
                    upgradeTier === "pro"
                      ? "whatsapp-upgrade-box-pro"
                      : "whatsapp-upgrade-box-max",
                  )}
                >
                  <p className="whatsapp-upgrade-box-text">
                    {upgradeTier === "pro" ? "UPGRADE TO PRO" : "UPGRADE TO MAX"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}