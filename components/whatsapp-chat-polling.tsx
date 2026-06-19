"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePollingChat } from "@/hooks/use-polling-chat";
import { WhatsAppChatShell } from "@/components/whatsapp-chat-shell";
import { cn } from "@/lib/utils";

interface WhatsAppChatPollingProps {
  roomId: string;
  userId: string;
  partnerId: string | null;
  partnerName?: string | null;
  partnerAge?: number | null;
  partnerLeft?: boolean;
  onNext: () => void;
  onEndChat: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function WhatsAppChatPolling({
  roomId,
  userId,
  partnerId,
  partnerName,
  partnerAge,
  partnerLeft,
  onNext,
  onEndChat,
  onBack,
  isLoading,
}: WhatsAppChatPollingProps) {
  const [draft, setDraft] = useState("");
  const [partnerLeftMessage, setPartnerLeftMessage] = useState<string | null>(
    null,
  );
  const partnerLeftShownRef = useRef(false);

  const {
    messages,
    partnerTyping,
    isConnected,
    sendError,
    isSending,
    handleDraftChange,
    sendMessage,
    setSendError,
  } = usePollingChat({ roomId, userId, partnerId });

  const partnerHasLeft = partnerLeftMessage != null;
  const canSend = isConnected && !isLoading && !isSending && !partnerHasLeft;

  const showPartnerLeftNotice = useCallback(() => {
    if (partnerLeftShownRef.current) return;
    partnerLeftShownRef.current = true;
    const name = (partnerName ?? "Stranger").toUpperCase();
    setPartnerLeftMessage(`OOPS THE ${name} LEFT THE CHAT`);
  }, [partnerName]);

  useEffect(() => {
    if (partnerLeft) {
      showPartnerLeftNotice();
    }
  }, [partnerLeft, showPartnerLeftNotice]);

  const statusText = partnerTyping
    ? "typing..."
    : isConnected
      ? "online"
      : "connecting...";

  const statusClassName = partnerTyping
    ? "text-sky-400"
    : isConnected
      ? "text-emerald-400"
      : "text-amber-400";

  return (
    <WhatsAppChatShell
      partnerName={partnerName}
      partnerAge={partnerAge}
      partnerLeftMessage={partnerLeftMessage}
      partnerTyping={partnerTyping}
      statusText={statusText}
      statusClassName={cn(statusClassName)}
      messages={messages}
      draft={draft}
      onDraftChange={(value) => {
        setDraft(value);
        if (sendError) setSendError(null);
        handleDraftChange(value, canSend);
      }}
      canSend={canSend}
      isSending={isSending}
      sendError={sendError}
      onSend={() => {
        void sendMessage(draft, canSend).then((sent) => {
          if (sent) setDraft("");
        });
      }}
      onNext={onNext}
      onEndChat={onEndChat}
      onBack={onBack}
      isLoading={isLoading}
    />
  );
}