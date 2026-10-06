import { describe, expect, it } from "vitest";
import { filterLessons, paginateLessons, parseExploreFilters, sortLessons } from "./filter";
import type { CatalogLesson } from "./types";

function lesson(
  partial: Partial<CatalogLesson> & Pick<CatalogLesson, "slug" | "title">,
): CatalogLesson {
  return {
    id: partial.id ?? partial.slug,
    subtitle: null,
    summary: partial.summary ?? partial.title,
    collectionId: "c1",
    collectionSlug: "gita",
    collectionTitle: "Gita",
    language: "en",
    type: "lesson",
    difficulty: "introductory",
    accessTier: "free",
    readingMinutes: 5,
    previewBlocks: [],
    body: [],
    hasAudio: false,
    sourceTitle: null,
    sourceLocator: null,
    adaptationNote: null,
    publishedAt: "2026-01-01",
    sortOrder: 1,
    topicSlugs: ["anxiety"],
    seoTitle: null,
    seoDescription: null,
    ...partial,
  };
}

describe("explore filters", () => {
  it("parses unknown values to defaults", () => {
    const filters = parseExploreFilters({ type: "novel", page: "0", sort: "loudest" });
    expect(filters.type).toBe("");
    expect(filters.page).toBe(1);
    expect(filters.sort).toBe("recommended");
  });

  it("filters by query, topic and access", () => {
    const rows = [
      lesson({ slug: "a", title: "Still mind", accessTier: "free", topicSlugs: ["anxiety"] }),
      lesson({
        slug: "b",
        title: "Hard choice",
        accessTier: "premium",
        topicSlugs: ["leadership"],
      }),
    ];
    const found = filterLessons(rows, parseExploreFilters({ q: "still", access: "free" }));
    expect(found.map((l) => l.slug)).toEqual(["a"]);
  });

  it("sorts shortest first and paginates", () => {
    const rows = [
      lesson({ slug: "long", title: "Long", readingMinutes: 9 }),
      lesson({ slug: "short", title: "Short", readingMinutes: 4 }),
    ];
    const sorted = sortLessons(rows, "shortest", new Map());
    expect(sorted[0]?.slug).toBe("short");
    const page = paginateLessons(sorted, 1, 1);
    expect(page.totalPages).toBe(2);
    expect(page.items).toHaveLength(1);
  });
});
