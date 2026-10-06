import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

const t = {
  paper: "#F6F0E3",
  surface: "#FFFDF8",
  ink: "#1C1915",
  inkMuted: "#6B6257",
  saffron: "#B85C27",
  saffronInk: "#9A4A1E",
  forest: "#23483A",
  forestDeep: "#183328",
  danger: "#A13D3D",
  white: "#FFFFFF",
};

describe("design token contrast (WCAG AA, 4.5:1 for body text)", () => {
  it.each([
    ["ink on paper", t.ink, t.paper],
    ["muted ink on paper", t.inkMuted, t.paper],
    ["muted ink on surface", t.inkMuted, t.surface],
    ["saffron-ink on paper", t.saffronInk, t.paper],
    ["forest on paper", t.forest, t.paper],
    ["danger on surface", t.danger, t.surface],
    ["surface on forest (primary button)", t.surface, t.forest],
    ["white on saffron (accent button)", t.white, t.saffron],
    ["paper on forest-deep (announcement)", t.paper, t.forestDeep],
  ])("%s passes", (_label, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("flags saffron as large-text only on paper", () => {
    const ratio = contrastRatio(t.saffron, t.paper);
    expect(ratio).toBeLessThan(4.5);
    expect(ratio).toBeGreaterThanOrEqual(3);
  });
});
