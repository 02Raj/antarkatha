import { createServerSupabase } from "@/lib/supabase/server";
import { getViewer } from "@/lib/auth/viewer";
import { listLessons } from "@/lib/catalog/queries";
import type { CatalogLesson } from "@/lib/catalog/types";
import type { ReaderFont, ReaderTheme } from "@/types/database";

export type ReaderPrefs = {
  emailDaily: boolean;
  audioSpeed: number;
  readerTheme: ReaderTheme;
  fontFamily: ReaderFont;
  fontScale: number;
};

export const defaultReaderPrefs: ReaderPrefs = {
  emailDaily: true,
  audioSpeed: 1,
  readerTheme: "sepia",
  fontFamily: "serif",
  fontScale: 1,
};

export async function getReaderState(contentId: string) {
  const viewer = await getViewer();
  if (!viewer) {
    return { signedIn: false, bookmarked: false, progressPercent: 0, prefs: defaultReaderPrefs };
  }
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { signedIn: true, bookmarked: false, progressPercent: 0, prefs: defaultReaderPrefs };
  }

  const [{ data: bookmark }, { data: progress }, { data: prefs }] = await Promise.all([
    supabase
      .from("bookmarks")
      .select("content_id")
      .eq("user_id", viewer.id)
      .eq("content_id", contentId)
      .maybeSingle(),
    supabase
      .from("reading_progress")
      .select("progress_percent")
      .eq("user_id", viewer.id)
      .eq("content_id", contentId)
      .maybeSingle(),
    supabase
      .from("user_preferences")
      .select("email_daily, audio_speed, reader_theme, font_family, font_scale")
      .eq("user_id", viewer.id)
      .maybeSingle(),
  ]);

  return {
    signedIn: true,
    bookmarked: Boolean(bookmark),
    progressPercent: Number(progress?.progress_percent ?? 0),
    prefs: prefs
      ? {
          emailDaily: prefs.email_daily,
          audioSpeed: Number(prefs.audio_speed),
          readerTheme: prefs.reader_theme,
          fontFamily: prefs.font_family,
          fontScale: Number(prefs.font_scale),
        }
      : defaultReaderPrefs,
  };
}

export async function listSavedLessons(): Promise<CatalogLesson[]> {
  const viewer = await getViewer();
  const supabase = await createServerSupabase();
  if (!viewer || !supabase) return [];
  const { data, error } = await supabase
    .from("bookmarks")
    .select("content_id, created_at")
    .eq("user_id", viewer.id)
    .order("created_at", { ascending: false });
  if (error || !data?.length) return [];
  const ids = new Set(data.map((row) => row.content_id));
  const { data: lessons } = await listLessons();
  return lessons.filter((lesson) => ids.has(lesson.id));
}

export async function getPracticeSummary() {
  const viewer = await getViewer();
  const supabase = await createServerSupabase();
  const empty = {
    currentStreak: 0,
    longestStreak: 0,
    savedCount: 0,
    continueLesson: null as { slug: string; title: string; progressPercent: number } | null,
  };
  if (!viewer || !supabase) return empty;

  const [{ data: streak }, { data: bookmarks }, { data: progress }] = await Promise.all([
    supabase
      .from("user_streaks")
      .select("current_streak, longest_streak")
      .eq("user_id", viewer.id)
      .maybeSingle(),
    supabase.from("bookmarks").select("content_id").eq("user_id", viewer.id),
    supabase
      .from("reading_progress")
      .select("content_id, progress_percent, updated_at")
      .eq("user_id", viewer.id)
      .order("updated_at", { ascending: false })
      .limit(8),
  ]);

  const { data: lessons } = await listLessons();
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const open = (progress ?? []).find((row) => Number(row.progress_percent) < 95);
  const lesson = open ? byId.get(open.content_id) : null;

  return {
    currentStreak: streak?.current_streak ?? 0,
    longestStreak: streak?.longest_streak ?? 0,
    savedCount: bookmarks?.length ?? 0,
    continueLesson: lesson
      ? {
          slug: lesson.slug,
          title: lesson.title,
          progressPercent: Number(open?.progress_percent ?? 0),
        }
      : null,
  };
}

export async function getReaderPreferences(): Promise<ReaderPrefs> {
  const viewer = await getViewer();
  const supabase = await createServerSupabase();
  if (!viewer || !supabase) return defaultReaderPrefs;
  const { data } = await supabase
    .from("user_preferences")
    .select("email_daily, audio_speed, reader_theme, font_family, font_scale")
    .eq("user_id", viewer.id)
    .maybeSingle();
  if (!data) return defaultReaderPrefs;
  return {
    emailDaily: data.email_daily,
    audioSpeed: Number(data.audio_speed),
    readerTheme: data.reader_theme,
    fontFamily: data.font_family,
    fontScale: Number(data.font_scale),
  };
}
