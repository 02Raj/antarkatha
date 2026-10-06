/**
 * In-process rate limiter for a single Node instance.
 * Production at scale should swap this for Redis; the interface stays the same.
 */
export type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

export function createRateLimiter(options?: { now?: () => number }) {
  const buckets = new Map<string, number[]>();
  const now = options?.now ?? Date.now;

  return function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
    const t = now();
    const cutoff = t - windowMs;
    const prev = buckets.get(key) ?? [];
    const recent = prev.filter((stamp) => stamp > cutoff);
    if (recent.length >= limit) {
      const retryAfterSec = Math.max(1, Math.ceil((recent[0]! + windowMs - t) / 1000));
      buckets.set(key, recent);
      return { ok: false, retryAfterSec };
    }
    recent.push(t);
    buckets.set(key, recent);
    return { ok: true };
  };
}

export const rateLimit = createRateLimiter();

export const AUTH_WINDOW_MS = 10 * 60 * 1000;
export const AUTH_LIMIT = 8;
export const CONTACT_LIMIT = 5;
export const ANALYTICS_LIMIT = 40;
