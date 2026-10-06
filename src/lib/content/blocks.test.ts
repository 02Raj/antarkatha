import { describe, expect, it } from "vitest";
import { parseContentBlocks, blocksToPlainText } from "./blocks";

describe("content blocks", () => {
  it("drops unknown types instead of rendering them", () => {
    expect(
      parseContentBlocks([
        { type: "script", text: "<img>" },
        { type: "paragraph", text: "Safe" },
      ]),
    ).toEqual([{ type: "paragraph", text: "Safe" }]);
  });

  it("flattens blocks to plain text for search", () => {
    const text = blocksToPlainText([
      { type: "heading", text: "Context", level: "h2" },
      { type: "verse", lines: ["One bird eats", "one watches"] },
      { type: "divider" },
    ]);
    expect(text).toContain("Context");
    expect(text).toContain("One bird eats");
    expect(text).not.toContain("divider");
  });
});
