import { describe, expect, it } from "vitest";
import { safeInternalPath } from "./paths";

describe("safeInternalPath", () => {
  it("rejects open redirects", () => {
    expect(safeInternalPath("//evil.example")).toBe("/dashboard");
    expect(safeInternalPath("https://evil.example")).toBe("/dashboard");
    expect(safeInternalPath("/admin")).toBe("/admin");
    expect(safeInternalPath("/login?next=/admin")).toBe("/dashboard");
  });
});
