import { describe, expect, it } from "vitest";
import { parseLocalProgress, upsertLocalProgress } from "./local";

const sample = {
  contentId: "a",
  slug: "when-the-mind-will-not-sit",
  title: "When the mind will not sit still",
  progressPercent: 20,
  lastPosition: { ratio: 0.2 },
  completedAt: null,
  updatedAt: "2026-10-05T08:00:00.000Z",
};

describe("local reading progress", () => {
  it("ignores malformed storage", () => {
    expect(parseLocalProgress("nope")).toEqual([]);
    expect(parseLocalProgress(JSON.stringify([{ slug: "x" }]))).toEqual([]);
  });

  it("keeps the farther progress for the same lesson", () => {
    const next = upsertLocalProgress([sample], {
      ...sample,
      progressPercent: 70,
      updatedAt: "2026-10-06T08:00:00.000Z",
    });
    expect(next).toHaveLength(1);
    expect(next[0]?.progressPercent).toBe(70);
  });
});
