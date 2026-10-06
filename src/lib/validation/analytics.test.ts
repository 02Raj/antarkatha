import { describe, expect, it } from "vitest";
import { analyticsEventSchema, sanitizeAnalyticsProperties } from "./analytics";

describe("analytics events", () => {
  it("accepts allowlisted events and strips lesson body", () => {
    const parsed = analyticsEventSchema.parse({
      eventName: "audio_start",
      anonymousId: "anon-1234",
      properties: { speed: 1 },
    });
    expect(parsed.eventName).toBe("audio_start");
    expect(sanitizeAnalyticsProperties({ body: "secret", speed: 1 })).toEqual({ speed: 1 });
  });

  it("rejects unknown event names", () => {
    expect(analyticsEventSchema.safeParse({ eventName: "track_everything" }).success).toBe(false);
  });
});
