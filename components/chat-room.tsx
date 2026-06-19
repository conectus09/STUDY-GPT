"use client";

import { useCallback, useRef, useState } from "react";
import { WhatsAppChatPolling } from "@/components/whatsapp-chat-polling";

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
  const [isLoading, setIsLoading] = useState(false);
  const leavingRef = useRef(false);

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