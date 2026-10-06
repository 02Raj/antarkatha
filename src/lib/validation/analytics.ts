import { z } from "zod";

export const analyticsEventNames = [
  "page_view",
  "lesson_open",
  "audio_start",
  "audio_complete",
  "lesson_complete",
  "bookmark_add",
  "signup",
  "checkout_start",
] as const;

const scalar = z.union([z.string().max(120), z.number(), z.boolean(), z.null()]);

export const analyticsEventSchema = z.object({
  eventName: z.enum(analyticsEventNames),
  anonymousId: z.string().trim().min(8).max(80).optional(),
  contentId: z.uuid().optional(),
  properties: z
    .record(z.string().max(40), scalar)
    .optional()
    .refine((value) => !value || Object.keys(value).length <= 12, "Too many properties"),
});

const forbiddenPropertyKeys = new Set(["body", "html", "content", "passage", "email", "password"]);

export function sanitizeAnalyticsProperties(
  properties: Record<string, z.infer<typeof scalar>> | undefined,
) {
  if (!properties) return {};
  return Object.fromEntries(
    Object.entries(properties).filter(([key]) => !forbiddenPropertyKeys.has(key.toLowerCase())),
  );
}
