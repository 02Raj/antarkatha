import { describe, expect, it } from "vitest";
import { canPublish, publishingBlockers } from "./publishing";

const approved = {
  sourceTitle: "Bhagavad Gita (demo adaptation)",
  sourceLocator: "Editorial placeholder — no verse number claimed",
  adaptationNote: "Demo adaptation — verify before publishing.",
  reviewStatus: "approved" as const,
};

describe("publishing checks", () => {
  it("allows publish when source and review are complete", () => {
    expect(canPublish(approved)).toBe(true);
    expect(publishingBlockers(approved)).toEqual([]);
  });

  it("blocks missing source fields and unapproved review", () => {
    expect(
      publishingBlockers({
        sourceTitle: "  ",
        sourceLocator: null,
        adaptationNote: undefined,
        reviewStatus: "pending",
      }),
    ).toEqual([
      "Source title is required",
      "Source locator is required",
      "Adaptation note is required",
      "Editorial review must be approved",
    ]);
  });
});
