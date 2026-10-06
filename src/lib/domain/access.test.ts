import { describe, expect, it } from "vitest";
import { canReadFullLesson, canSeeInCatalog, isStaffRole, shouldShowPaywall } from "./access";

const publishedFree = {
  role: null,
  isAuthenticated: false,
  hasLibraryEntitlement: false,
  isDailyLesson: false,
  accessTier: "free" as const,
  status: "published" as const,
};

describe("access", () => {
  it("treats editors and admins as staff", () => {
    expect(isStaffRole("editor")).toBe(true);
    expect(isStaffRole("admin")).toBe(true);
    expect(isStaffRole("user")).toBe(false);
  });

  it("never blocks a published free lesson or today's lesson", () => {
    expect(canReadFullLesson(publishedFree)).toBe(true);
    expect(
      canReadFullLesson({
        ...publishedFree,
        accessTier: "premium",
        isDailyLesson: true,
      }),
    ).toBe(true);
  });

  it("paywalls premium lessons for guests", () => {
    const premium = { ...publishedFree, accessTier: "premium" as const };
    expect(canReadFullLesson(premium)).toBe(false);
    expect(shouldShowPaywall(premium)).toBe(true);
    expect(canSeeInCatalog(premium)).toBe(true);
  });

  it("grants premium after a verified entitlement", () => {
    expect(
      canReadFullLesson({
        ...publishedFree,
        accessTier: "premium",
        isAuthenticated: true,
        hasLibraryEntitlement: true,
      }),
    ).toBe(true);
  });

  it("hides drafts from readers and shows them to staff", () => {
    expect(canSeeInCatalog({ status: "draft", role: null })).toBe(false);
    expect(canSeeInCatalog({ status: "draft", role: "editor" })).toBe(true);
    expect(
      canReadFullLesson({
        ...publishedFree,
        status: "draft",
        role: "editor",
        isAuthenticated: true,
      }),
    ).toBe(true);
  });
});
