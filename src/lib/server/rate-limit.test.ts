import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("rate limiter", () => {
  it("allows up to the limit then blocks inside the window", () => {
    let t = 1_000;
    const limit = createRateLimiter({ now: () => t });
    expect(limit("auth:1", 2, 1000).ok).toBe(true);
    expect(limit("auth:1", 2, 1000).ok).toBe(true);
    const blocked = limit("auth:1", 2, 1000);
    expect(blocked.ok).toBe(false);
    t = 2_200;
    expect(limit("auth:1", 2, 1000).ok).toBe(true);
  });
});
