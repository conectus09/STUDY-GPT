import { NextRequest, NextResponse } from "next/server";
import { reportUser } from "@/lib/matching";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      reporterId?: string;
      reportedId?: string;
      roomId?: string;
      reason?: string;
    };

    if (!body.reporterId) {
      return NextResponse.json(
        { error: "reporterId is required" },
        { status: 400 },
      );
    }

    await reportUser({
      reporterId: body.reporterId,
      reportedId: body.reportedId,
      roomId: body.roomId,
      reason: body.reason,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[report]", error);
    return NextResponse.json({ error: "Report failed" }, { status: 500 });
  }
}