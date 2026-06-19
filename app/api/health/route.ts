import { NextResponse } from "next/server";

// Force dynamic rendering so uptime pings always reach the live server
// (static caching would defeat the purpose on Render free tier).
export const dynamic = "force-dynamic";

/**
 * Lightweight liveness probe for external uptime monitors (cron-job.org, UptimeRobot, etc.).
 * Intentionally skips Redis/DB checks to keep wake-up pings fast and cheap.
 */
export async function GET() {
  return NextResponse.json(
    { status: "ok", timestamp: Date.now() },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}

/** Some monitors use HEAD to avoid parsing a response body. */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}