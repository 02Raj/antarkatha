"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { applyStreak } from "@/lib/domain/streaks";
import { withCompletion } from "@/lib/domain/progress";
import { getViewer } from "@/lib/auth/viewer";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Json, ReaderFont, ReaderTheme } from "@/types/database";

const progressSchema = z.object({
  contentId: z.string().min(1).max(80),
  percent: z.number().min(0).max(100),
});

const bookmarkSchema = z.object({
  contentId: z.string().min(1).max(80),
  slug: z.string().min(1).max(160),
});

const prefsSchema = z.object({
  emailDaily: z.boolean(),
  audioSpeed: z.number().min(0.5).max(2),
  readerTheme: z.enum(["light", "sepia", "dark"]),
  fontFamily: z.enum(["serif", "sans"]),
  fontScale: z.number().min(0.85).max(1.4),
});

function practiceDate() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export async function saveReadingProgress(input: { contentId: string; percent: number }) {
  const parsed = progressSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, stored: "browser" as const };
  const viewer = await getViewer();
  const supabase = await createServerSupabase();
  if (!viewer || !supabase) return { ok: false as const, stored: "browser" as const };

  const stamped = withCompletion({
    progressPercent: parsed.data.percent,
    lastPosition: { ratio: parsed.data.percent / 100 },
    completedAt: null,
    updatedAt: new Date().toISOString(),
  });

  const { error } = await supabase.from("reading_progress").upsert({
    user_id: viewer.id,
    content_id: parsed.data.contentId,
    progress_percent: stamped.progressPercent,
    last_position: stamped.lastPosition as Json,
    completed_at: stamped.completedAt,
    updated_at: stamped.updatedAt,
  });
  if (error) return { ok: false as const, stored: "browser" as const };

  const { data: streak } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("user_id", viewer.id)
    .maybeSingle();
  const next = applyStreak(
    {
      currentStreak: streak?.current_streak ?? 0,
      longestStreak: streak?.longest_streak ?? 0,
      lastActivityDate: streak?.last_activity_date ?? null,
    },
    practiceDate(),
  );
  await supabase.from("user_streaks").upsert({
    user_id: viewer.id,
    current_streak: next.currentStreak,
    longest_streak: next.longestStreak,
    last_activity_date: next.lastActivityDate,
  });

  return { ok: true as const, stored: "account" as const };
}

export async function toggleBookmark(input: { contentId: string; slug: string }) {
  const parsed = bookmarkSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, bookmarked: false };
  const viewer = await getViewer();
  const supabase = await createServerSupabase();
  if (!viewer || !supabase) return { ok: false as const, bookmarked: false };

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("content_id")
    .eq("user_id", viewer.id)
    .eq("content_id", parsed.data.contentId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", viewer.id)
      .eq("content_id", parsed.data.contentId);
    if (error) return { ok: false as const, bookmarked: true };
    revalidatePath("/bookmarks");
    revalidatePath(`/read/${parsed.data.slug}`);
    return { ok: true as const, bookmarked: false };
  }

  const { error } = await supabase.from("bookmarks").insert({
    user_id: viewer.id,
    content_id: parsed.data.contentId,
  });
  if (error) return { ok: false as const, bookmarked: false };
  revalidatePath("/bookmarks");
  revalidatePath(`/read/${parsed.data.slug}`);
  return { ok: true as const, bookmarked: true };
}

export async function saveReaderPreferences(input: z.infer<typeof prefsSchema>) {
  const parsed = prefsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  const viewer = await getViewer();
  const supabase = await createServerSupabase();
  if (!viewer || !supabase) {
    return { info: "Saved on this browser. Sign-in sync needs the database tables." };
  }
  const { error } = await supabase.from("user_preferences").upsert({
    user_id: viewer.id,
    email_daily: parsed.data.emailDaily,
    audio_speed: parsed.data.audioSpeed,
    reader_theme: parsed.data.readerTheme as ReaderTheme,
    font_family: parsed.data.fontFamily as ReaderFont,
    font_scale: parsed.data.fontScale,
  });
  if (error) return { info: "Saved on this browser. The preference table is not ready yet." };
  revalidatePath("/settings");
  revalidatePath("/read");
  return { info: "Reading preferences saved to your account." };
}
