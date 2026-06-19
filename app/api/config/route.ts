import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Chat uses built-in HTTP polling — no external real-time server required. */
export async function GET() {
  return NextResponse.json({
    mode: "polling",
  });
}