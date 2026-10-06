import { describe, expect, it } from "vitest";
import { clampProgress, isLessonComplete, mergeProgress, withCompletion } from "./progress";

describe("progress", () => {
  it("clamps and completes at the threshold", () => {
    expect(clampProgress(-4)).toBe(0);
    expect(clampProgress(140)).toBe(100);
    expect(isLessonComplete(94.9)).toBe(false);
    expect(isLessonComplete(95)).toBe(true);
  });

  it("merges guest and account progress by max percent", () => {
    const guest = {
      progressPercent: 40,
      lastPosition: { block: 2 },
      completedAt: null,
      updatedAt: "2026-10-01T10:00:00.000Z",
    };
    const account = {
      progressPercent: 80,
      lastPosition: { block: 6 },
      completedAt: null,
      updatedAt: "2026-10-02T10:00:00.000Z",
    };
    const merged = mergeProgress(guest, account);
    expect(merged.progressPercent).toBe(80);
    expect(merged.lastPosition).toEqual({ block: 6 });
  });

  it("stamps completedAt once when crossing the threshold", () => {
    const now = "2026-10-05T08:00:00.000Z";
    const done = withCompletion(
      {
        progressPercent: 100,
        lastPosition: {},
        completedAt: null,
        updatedAt: now,
      },
      now,
    );
    expect(done.completedAt).toBe(now);
  });
});
