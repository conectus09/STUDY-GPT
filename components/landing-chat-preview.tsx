"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PARTNER_NAME = "Sofia";
const GIRL_AVATAR = "/chat-avatar-girl.jpg";
const BOY_AVATAR = "/chat-avatar-boy.jpg";

type PreviewMessage = {
  id: string;
  text: string;
  sent: boolean;
  time: string;
};

const MESSAGES: PreviewMessage[] = [
  {
    id: "1",
    text: "hey",
    sent: false,
    time: "15:48",
  },
  {
    id: "2",
    text: "hi",
    sent: true,
    time: "15:48",
  },
  {
    id: "3",
    text: "looking for someone interesting to talk to?",
    sent: false,
    time: "15:49",
  },
  {
    id: "4",
    text: "maybe",
    sent: true,
    time: "15:49",
  },
  {
    id: "5",
    text: "join me on chinwag",
    sent: false,
    time: "15:49",
  },
  {
    id: "6",
    text: "sounds good ✨",
    sent: true,
    time: "15:50",
  },
];

const MESSAGE_GAP_MS = 2000;
const LOOP_PAUSE_MS = 3000;
const TYPING_LEAD_MS = 700;

function Checkmarks() {
  return (
    <span className="landing-chat-ticks" aria-hidden>
      <svg viewBox="0 0 16 15" fill="none">
        <path
          d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.516.021L6.35 12.178 2.28 8.153a.366.366 0 0 0-.516.021l-.478.372a.364.364 0 0 0 .021.516l4.74 4.693c.16.158.418.158.578 0L15.03 3.832a.363.363 0 0 0-.02-.516z"
          fill="currentColor"
        />
        <path
          d="M9.84 12.178l-.478-.372a.364.364 0 0 0-.516.021L3.28 8.153 2.28 7.153a.364.364 0 0 0-.516.021l-.478.372a.363.363 0 0 0 .021.516l1.478 1.464 4.74 4.693c.16.158.418.158.578 0L9.86 12.694a.364.364 0 0 0 .02-.516z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function ChatAvatar({
  src,
  size = "message",
}: {
  src: string;
  size?: "message" | "header";
}) {
  const className =
    size === "header" ? "landing-chat-topbar-avatar" : "landing-chat-avatar";

  return (
    <span className={className} aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        sizes={size === "header" ? "34px" : "28px"}
        className="landing-chat-avatar-image"
        priority={size === "header"}
      />
    </span>
  );
}

function PreviewAvatar({ sent }: { sent: boolean }) {
  return <ChatAvatar src={sent ? BOY_AVATAR : GIRL_AVATAR} />;
}

function PreviewBubble({ message }: { message: PreviewMessage }) {
  return (
    <div
      className={cn(
        "landing-chat-row landing-chat-row-enter",
        message.sent ? "is-sent" : "is-received",
      )}
    >
      {!message.sent && <PreviewAvatar sent={false} />}

      <div className="landing-chat-bubble-wrap">
        <div className="landing-chat-bubble">
          <span className="landing-chat-text">{message.text}</span>
          <span className="landing-chat-footer">
            <span className="landing-chat-time">{message.time}</span>
            {message.sent && <Checkmarks />}
          </span>
        </div>
      </div>

      {message.sent && <PreviewAvatar sent />}
    </div>
  );
}

function TypingIndicator({ sent }: { sent: boolean }) {
  return (
    <div
      className={cn("landing-chat-typing", sent && "is-sent")}
      aria-label={sent ? "You are typing" : `${PARTNER_NAME} is typing`}
    >
      <PreviewAvatar sent={sent} />
      <div className="landing-chat-typing-bubble">
        <span className="landing-chat-typing-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}

export function LandingChatPreview() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [showTyping, setShowTyping] = useState(false);
  const [typingSent, setTypingSent] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (visibleCount >= MESSAGES.length) {
      setShowTyping(false);

      const loopTimer = window.setTimeout(() => {
        setVisibleCount(1);
        setReplayKey((key) => key + 1);
      }, LOOP_PAUSE_MS);

      return () => window.clearTimeout(loopTimer);
    }

    const nextMessage = MESSAGES[visibleCount];

    const typingTimer = window.setTimeout(() => {
      setTypingSent(nextMessage.sent);
      setShowTyping(true);
    }, MESSAGE_GAP_MS - TYPING_LEAD_MS);

    const revealTimer = window.setTimeout(() => {
      setShowTyping(false);
      setVisibleCount((count) => count + 1);
    }, MESSAGE_GAP_MS);

    return () => {
      window.clearTimeout(typingTimer);
      window.clearTimeout(revealTimer);
    };
  }, [visibleCount, replayKey]);

  const visibleMessages = MESSAGES.slice(0, visibleCount);

  return (
    <div className="landing-chat-preview">
      <div className="landing-chat-phone">
        <div className="landing-chat-topbar">
          <ChatAvatar src={GIRL_AVATAR} size="header" />
          <div className="landing-chat-topbar-info">
            <span className="landing-chat-topbar-name">{PARTNER_NAME}</span>
            <span className="landing-chat-topbar-status">online</span>
          </div>
        </div>

        <div className="landing-chat-screen">
          <div className="landing-chat-messages">
            {visibleMessages.map((message) => (
              <PreviewBubble key={`${replayKey}-${message.id}`} message={message} />
            ))}
          </div>
        </div>

        <div className="landing-chat-typing-slot" aria-hidden={!showTyping}>
          {showTyping && <TypingIndicator sent={typingSent} />}
        </div>
      </div>
    </div>
  );
}