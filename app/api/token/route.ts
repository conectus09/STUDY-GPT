import { NextRequest, NextResponse } from "next/server";
import { createLiveKitToken, getLiveKitUrl } from "@/lib/livekit";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      roomName?: string;
      participantName?: string;
    };

    const { roomName, participantName } = body;

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: "roomName and participantName are required" },
        { status: 400 },
      );
    }

    const token = await createLiveKitToken(roomName, participantName);
    const serverUrl = getLiveKitUrl();

    return NextResponse.json({ token, serverUrl });
  } catch (error) {
    console.error("[token]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Token generation failed" },
      { status: 500 },
    );
  }
}