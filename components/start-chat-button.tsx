"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StartGateModal } from "@/components/start-gate-modal";
import { Button, type ButtonProps } from "@/components/ui/button";

interface StartChatButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function StartChatButton({
  children,
  onClick,
  ...props
}: StartChatButtonProps) {
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    setGateOpen(true);
  };

  return (
    <>
      <Button {...props} onClick={handleClick}>
        {children}
      </Button>

      <StartGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onComplete={() => {
          setGateOpen(false);
          router.push("/chat");
        }}
      />
    </>
  );
}