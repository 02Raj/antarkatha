import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/auth/paths";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeInternalPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth", origin));
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=config", origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth", origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
