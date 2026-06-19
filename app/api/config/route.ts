import { NextResponse } from "next/server";
import { isLiveKitConfigured } from "@/lib/livekit";

export const dynamic = "force-dynamic";

/** Tells the client whether to use LiveKit or the built-in polling chat fallback. */
export async function GET() {
  const livekit = isLiveKitConfigured();

  return NextResponse.json({
    livekit,
    mode: livekit ? "livekit" : "polling",
  });
}