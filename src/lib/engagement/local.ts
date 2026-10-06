import { mergeProgress, withCompletion, type ReadingProgress } from "@/lib/domain/progress";

export const PROGRESS_KEY = "antarkatha.reading-progress";
export const BOOKMARK_KEY = "antarkatha.bookmarks";

export type LocalBookmark = { contentId: string; slug: string; title: string };

export type LocalLessonProgress = ReadingProgress & {
  contentId: string;
  slug: string;
  title: string;
};

export function parseLocalProgress(raw: string | null): LocalLessonProgress[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLocalProgress);
  } catch {
    return [];
  }
}

export function upsertLocalProgress(
  current: LocalLessonProgress[],
  next: LocalLessonProgress,
): LocalLessonProgress[] {
  const existing = current.find((item) => item.contentId === next.contentId);
  const merged = existing
    ? { ...next, ...mergeProgress(existing, next), contentId: next.contentId, slug: next.slug, title: next.title }
    : withCompletion(next);
  const rest = current.filter((item) => item.contentId !== next.contentId);
  return [merged as LocalLessonProgress, ...rest].slice(0, 40);
}

export function parseLocalBookmarks(raw: string | null): LocalBookmark[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is LocalBookmark =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as LocalBookmark).contentId === "string" &&
        typeof (item as LocalBookmark).slug === "string" &&
        typeof (item as LocalBookmark).title === "string",
    );
  } catch {
    return [];
  }
}

export function toggleLocalBookmark(current: LocalBookmark[], next: LocalBookmark) {
  const exists = current.some((item) => item.contentId === next.contentId);
  return exists ? current.filter((item) => item.contentId !== next.contentId) : [next, ...current];
}

function isLocalProgress(value: unknown): value is LocalLessonProgress {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<LocalLessonProgress>;
  return (
    typeof row.contentId === "string" &&
    typeof row.slug === "string" &&
    typeof row.title === "string" &&
    typeof row.progressPercent === "number" &&
    typeof row.updatedAt === "string"
  );
}
