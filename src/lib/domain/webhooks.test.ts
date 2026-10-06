import { describe, expect, it } from "vitest";
import { resolveWebhookDelivery } from "./webhooks";

describe("webhook idempotency", () => {
  it("processes the first event and skips duplicates", () => {
    const incoming = { provider: "razorpay", providerEventId: "evt_1" };
    expect(resolveWebhookDelivery(undefined, incoming)).toBe("process");
    expect(resolveWebhookDelivery({ ...incoming, status: "processed" }, incoming)).toBe(
      "duplicate",
    );
  });
});
