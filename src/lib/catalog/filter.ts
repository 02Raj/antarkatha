import type { ContentType, DifficultyLevel, AccessTier } from "@/types/database";
import {
  EXPLORE_PAGE_SIZE,
  type CatalogLesson,
  type DurationBucket,
  type ExploreFilters,
  type ExploreSort,
} from "./types";

export type { ExploreFilters, ExploreSort, DurationBucket };

const CONTENT_TYPES: ContentType[] = ["lesson", "primer", "commentary", "story"];
const DIFFICULTIES: DifficultyLevel[] = ["introductory", "familiar", "deep"];
const ACCESS: AccessTier[] = ["free", "premium"];
const DURATIONS: DurationBucket[] = ["short", "medium", "long"];
const SORTS: ExploreSort[] = ["recommended", "newest", "shortest", "collection"];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function parseExploreFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ExploreFilters {
  const type = first(searchParams.type);
  const duration = first(searchParams.duration);
  const difficulty = first(searchParams.difficulty);
  const access = first(searchParams.access);
  const sort = first(searchParams.sort);
  const page = Number.parseInt(first(searchParams.page) || "1", 10);

  return {
    q: first(searchParams.q).trim(),
    collection: first(searchParams.collection).trim(),
    topic: first(searchParams.topic).trim(),
    type: CONTENT_TYPES.includes(type as ContentType) ? (type as ContentType) : "",
    duration: DURATIONS.includes(duration as DurationBucket) ? (duration as DurationBucket) : "",
    difficulty: DIFFICULTIES.includes(difficulty as DifficultyLevel)
      ? (difficulty as DifficultyLevel)
      : "",
    access: ACCESS.includes(access as AccessTier) ? (access as AccessTier) : "",
    sort: SORTS.includes(sort as ExploreSort) ? (sort as ExploreSort) : "recommended",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function exploreQueryString(filters: ExploreFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.topic) params.set("topic", filters.topic);
  if (filters.type) params.set("type", filters.type);
  if (filters.duration) params.set("duration", filters.duration);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.access) params.set("access", filters.access);
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function durationBucket(minutes: number): DurationBucket {
  if (minutes <= 5) return "short";
  if (minutes <= 8) return "medium";
  return "long";
}

function searchableText(lesson: CatalogLesson) {
  return [
    lesson.title,
    lesson.subtitle,
    lesson.summary,
    lesson.collectionTitle,
    ...lesson.topicSlugs,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterLessons(lessons: CatalogLesson[], filters: ExploreFilters) {
  const q = filters.q.toLowerCase();
  return lessons.filter((lesson) => {
    if (q && !searchableText(lesson).includes(q)) return false;
    if (filters.collection && lesson.collectionSlug !== filters.collection) return false;
    if (filters.topic && !lesson.topicSlugs.includes(filters.topic)) return false;
    if (filters.type && lesson.type !== filters.type) return false;
    if (filters.duration && durationBucket(lesson.readingMinutes) !== filters.duration)
      return false;
    if (filters.difficulty && lesson.difficulty !== filters.difficulty) return false;
    if (filters.access && lesson.accessTier !== filters.access) return false;
    return true;
  });
}

export function sortLessons(
  lessons: CatalogLesson[],
  sort: ExploreSort,
  collectionOrder: Map<string, number>,
) {
  const copy = [...lessons];
  copy.sort((a, b) => {
    switch (sort) {
      case "newest":
        return (
          (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") || a.title.localeCompare(b.title)
        );
      case "shortest":
        return a.readingMinutes - b.readingMinutes || a.title.localeCompare(b.title);
      case "collection": {
        const ac = collectionOrder.get(a.collectionSlug) ?? 99;
        const bc = collectionOrder.get(b.collectionSlug) ?? 99;
        return ac - bc || a.sortOrder - b.sortOrder || a.title.localeCompare(b.title);
      }
      default:
        if (a.accessTier !== b.accessTier) return a.accessTier === "free" ? -1 : 1;
        return a.sortOrder - b.sortOrder || a.title.localeCompare(b.title);
    }
  });
  return copy;
}

export function paginateLessons(
  lessons: CatalogLesson[],
  page: number,
  pageSize = EXPLORE_PAGE_SIZE,
) {
  const total = lessons.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: lessons.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
    pageSize,
  };
}
