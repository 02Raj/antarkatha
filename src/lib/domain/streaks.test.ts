import { describe, expect, it } from "vitest";
import { applyStreak } from "./streaks";

const empty = { currentStreak: 0, longestStreak: 0, lastActivityDate: null };

describe("streaks", () => {
  it("starts a streak on the first activity day", () => {
    expect(applyStreak(empty, "2026-10-05")).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: "2026-10-05",
    });
  });

  it("increments on consecutive days and ignores repeats", () => {
    const day1 = applyStreak(empty, "2026-10-05");
    const day2 = applyStreak(day1, "2026-10-06");
    expect(day2.currentStreak).toBe(2);
    expect(applyStreak(day2, "2026-10-06")).toEqual(day2);
  });

  it("resets after a gap and preserves longest", () => {
    const built = applyStreak(applyStreak(empty, "2026-10-01"), "2026-10-02");
    const reset = applyStreak(built, "2026-10-05");
    expect(reset).toEqual({
      currentStreak: 1,
      longestStreak: 2,
      lastActivityDate: "2026-10-05",
    });
  });
});
