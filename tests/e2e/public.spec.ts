import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function noSeriousAxe(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test.describe("public product", () => {
  test("home conversion links reach real pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("What are you navigating?")).toBeVisible();
    await page.getByRole("link", { name: "Explore the library" }).first().click();
    await expect(page).toHaveURL(/\/explore/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Find a lesson");
  });

  test("explore filters sync to the URL and paginate", async ({ page }) => {
    await page.goto("/explore");
    await page.getByLabel("Access").selectOption("free");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page).toHaveURL(/access=free/);
    await expect(page.getByRole("link", { name: /Read the lesson/ }).first()).toBeVisible();
    await page.goto("/explore");
    await page.getByRole("link", { name: "Next" }).click();
    await expect(page).toHaveURL(/page=2/);
  });

  test("daily lesson is fully readable", async ({ page }) => {
    await page.goto("/daily");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Audio coming soon")).toBeVisible();
    await expect(page.getByText(/Source\.\s*Demo adaptation/).first()).toBeVisible();
  });

  test("collection and topic pages list lessons", async ({ page }) => {
    await page.goto("/collections/bhagavad-gita");
    await expect(page.getByRole("heading", { level: 1, name: "Bhagavad Gita" })).toBeVisible();
    await page.goto("/topics/anxiety");
    await expect(page.getByRole("heading", { level: 1, name: "Anxiety" })).toBeVisible();
    await expect(page.getByText("not medical", { exact: false })).toBeVisible();
  });

  test("pricing and policies are reachable", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Pay for the library");
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("A calm desk");
    await page.goto("/contact");
    await expect(page.getByLabel("Email")).toBeVisible();
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  });

  test("home and reader have no serious accessibility violations", async ({ page }) => {
    await page.goto("/");
    await noSeriousAxe(page);
    await page.goto("/read/when-the-mind-will-not-sit");
    await noSeriousAxe(page);
  });
});
