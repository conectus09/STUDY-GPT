import { NextRequest, NextResponse } from "next/server";
import {
  getMatchStatus,
  joinMatchQueue,
  leaveMatch,
} from "@/lib/matching";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const status = await getMatchStatus(userId);
    return NextResponse.json(status);
  } catch (error) {
    console.error("[match GET]", error);
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      action?: "join" | "next" | "leave";
      profile?: { name?: string; age?: number };
    };

    const { userId, action = "join", profile } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (action === "leave") {
      await leaveMatch(userId);
      return NextResponse.json({ status: "idle" });
    }

    if (action === "next") {
      await leaveMatch(userId);
      const result = await joinMatchQueue(userId, profile);
      return NextResponse.json(result);
    }

    const result = await joinMatchQueue(userId, profile);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[match POST]", error);
    return NextResponse.json({ error: "Match request failed" }, { status: 500 });
  }
}