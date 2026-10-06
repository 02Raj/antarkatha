import { describe, expect, it } from "vitest";
import { absoluteUrl, cn, formatDuration, formatMinutes, formatPaise } from "./utils";

describe("cn", () => {
  it("merges conflicting tailwind classes", () => {
    expect(cn("px-2 text-sm", false && "hidden", "px-4")).toBe("text-sm px-4");
  });
});

describe("formatDuration", () => {
  it.each([
    [0, "0:00"],
    [9, "0:09"],
    [75, "1:15"],
    [3725, "1:02:05"],
    [-1, "0:00"],
    [Number.NaN, "0:00"],
  ])("%d -> %s", (input, expected) => {
    expect(formatDuration(input)).toBe(expected);
  });
});

describe("formatMinutes", () => {
  it("rounds and labels minutes", () => {
    expect(formatMinutes(4.6)).toBe("5 min");
    expect(formatMinutes(0)).toBe("Under a minute");
  });
});

describe("formatPaise", () => {
  it("formats whole rupees without decimals", () => {
    expect(formatPaise(9900)).toBe("₹99");
    expect(formatPaise(79900)).toBe("₹799");
    expect(formatPaise(0)).toBe("₹0");
  });
  it("keeps paise when present", () => {
    expect(formatPaise(9950)).toBe("₹99.50");
  });
});

describe("absoluteUrl", () => {
  it("joins origin and path without double slashes", () => {
    expect(absoluteUrl("/read/x", "https://example.com/")).toBe("https://example.com/read/x");
    expect(absoluteUrl("daily", "https://example.com")).toBe("https://example.com/daily");
  });
});
