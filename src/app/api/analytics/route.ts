import { NextResponse } from "next/server";
import { analyticsEventSchema, sanitizeAnalyticsProperties } from "@/lib/validation/analytics";
import { ANALYTICS_LIMIT, rateLimit } from "@/lib/server/rate-limit";
import { requestIp } from "@/lib/server/request-ip";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const ip = await requestIp();
  const limited = rateLimit(`analytics:${ip}`, ANALYTICS_LIMIT, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many events" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return new NextResponse(null, { status: 204 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !parsed.data.anonymousId) {
    return NextResponse.json({ error: "Missing anonymousId" }, { status: 400 });
  }

  const { error } = await supabase.from("analytics_events").insert({
    user_id: user?.id ?? null,
    anonymous_id: user ? null : parsed.data.anonymousId,
    event_name: parsed.data.eventName,
    content_id: parsed.data.contentId ?? null,
    properties: sanitizeAnalyticsProperties(parsed.data.properties),
  });

  if (error) {
    return NextResponse.json({ error: "Not recorded" }, { status: 400 });
  }

  return new NextResponse(null, { status: 204 });
}
