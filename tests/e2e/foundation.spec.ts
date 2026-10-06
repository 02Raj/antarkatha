import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("foundation", () => {
  test("home renders hero with working primary CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Ancient wisdom for the life you are living now",
    );
    await expect(page.getByRole("link", { name: "Explore the library" }).first()).toHaveAttribute(
      "href",
      "/explore",
    );
    await expect(page.getByRole("link", { name: /Begin today’s reading/ }).first()).toHaveAttribute(
      "href",
      "/daily",
    );
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
  });

  test("home has no serious accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test("unknown routes render the not-found page", async ({ page }) => {
    const res = await page.goto("/this-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("This path leads nowhere");
  });
});
