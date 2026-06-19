"use client";

import { useLocalParticipant } from "@livekit/components-react";
import {
  Flag,
  Mic,
  MicOff,
  PhoneOff,
  SkipForward,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatControlsProps {
  onNext: () => void;
  onEnd: () => void;
  onReport: () => void;
  isLoading?: boolean;
}

export function ChatControls({
  onNext,
  onEnd,
  onReport,
  isLoading,
}: ChatControlsProps) {
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled } =
    useLocalParticipant();

  return (
    <div className="theme-panel flex flex-wrap items-center justify-center gap-3 rounded-2xl p-4 backdrop-blur-sm">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => void localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
        aria-label={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
      >
        {isMicrophoneEnabled ? (
          <Mic className="h-5 w-5" />
        ) : (
          <MicOff className="h-5 w-5 text-red-400" />
        )}
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={() => void localParticipant.setCameraEnabled(!isCameraEnabled)}
        aria-label={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
      >
        {isCameraEnabled ? (
          <Video className="h-5 w-5" />
        ) : (
          <VideoOff className="h-5 w-5 text-red-400" />
        )}
      </Button>

      <Button
        variant="destructive"
        size="lg"
        onClick={onNext}
        disabled={isLoading}
        className="min-w-[140px] gap-2"
      >
        <SkipForward className="h-5 w-5" />
        Next
      </Button>

      <Button variant="outline" size="sm" onClick={onReport} className="gap-2">
        <Flag className="h-4 w-4" />
        Report
      </Button>

      <Button variant="ghost" size="sm" onClick={onEnd} className="gap-2 text-red-300">
        <PhoneOff className="h-4 w-4" />
        End Chat
      </Button>
    </div>
  );
}