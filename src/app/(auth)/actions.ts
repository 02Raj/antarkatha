"use server";

import { redirect } from "next/navigation";
import { publicEnv, isSupabaseConfigured } from "@/lib/env";
import { safeInternalPath } from "@/lib/auth/paths";
import { AUTH_LIMIT, AUTH_WINDOW_MS, rateLimit } from "@/lib/server/rate-limit";
import { requestIp } from "@/lib/server/request-ip";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  magicLinkSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
} from "@/lib/validation/auth";

export type AuthState = { error?: string; info?: string };

type AuthGate =
  | { ok: true; supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabase>>> }
  | { ok: false; error: string };

async function gated(): Promise<AuthGate> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Authentication is not configured on this instance yet." };
  }
  const ip = await requestIp();
  const limited = rateLimit(`auth:${ip}`, AUTH_LIMIT, AUTH_WINDOW_MS);
  if (!limited.ok) {
    return {
      ok: false,
      error: `Too many attempts. Try again in ${limited.retryAfterSec} seconds.`,
    };
  }
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { ok: false, error: "Authentication is not configured on this instance yet." };
  }
  return { ok: true, supabase };
}

function callbackUrl(next: string) {
  const url = new URL("/auth/callback", publicEnv.appUrl);
  url.searchParams.set("next", next);
  return url.toString();
}

export async function signInWithPassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const gate = await gated();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: error.message };

  redirect(safeInternalPath(parsed.data.next));
}

export async function signUpWithPassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName") || undefined,
    next: formData.get("next") || undefined,
  });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const gate = await gated();
  if (!gate.ok) return { error: gate.error };

  const next = safeInternalPath(parsed.data.next);
  const { data, error } = await gate.supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: callbackUrl(next),
      data: { display_name: parsed.data.displayName ?? "" },
    },
  });
  if (error) return { error: error.message };
  if (data.session) redirect(next);

  return {
    info: "Account created. If email confirmation is enabled, check your inbox for the next step.",
  };
}

export async function sendMagicLink(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = magicLinkSchema.safeParse({
    email: formData.get("email"),
    next: formData.get("next") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a valid email." };

  const gate = await gated();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: callbackUrl(safeInternalPath(parsed.data.next)) },
  });
  if (error) return { error: error.message };
  return { info: "If that address is able to receive mail, a sign-in link is on its way." };
}

export async function sendPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a valid email." };

  const gate = await gated();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${publicEnv.appUrl}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
  });
  if (error) return { error: error.message };
  return { info: "If an account exists, a reset link is on its way." };
}

export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = updatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Choose a stronger password." };

  const gate = await gated();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function startGoogleOAuthForm(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  return startGoogleOAuth(String(formData.get("next") || "") || undefined);
}

export async function startGoogleOAuth(nextPath?: string): Promise<AuthState> {
  const gate = await gated();
  if (!gate.ok) return { error: gate.error };

  const { data, error } = await gate.supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl(safeInternalPath(nextPath)),
      skipBrowserRedirect: true,
    },
  });
  if (error || !data.url) {
    return {
      error: "Google sign-in is not configured on this project yet. Use email instead.",
    };
  }
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createServerSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
