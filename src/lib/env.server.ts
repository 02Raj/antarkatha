import "server-only";
import { z } from "zod";

const blankToUndefined = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: blankToUndefined,
  SUPABASE_SERVICE_ROLE_KEY: blankToUndefined,
  RAZORPAY_KEY_ID: blankToUndefined,
  RAZORPAY_KEY_SECRET: blankToUndefined,
  RAZORPAY_WEBHOOK_SECRET: blankToUndefined,
  RESEND_API_KEY: blankToUndefined,
  EMAIL_FROM: blankToUndefined,
  CRON_SECRET: blankToUndefined,
});

export type ServerEnv = z.infer<typeof serverSchema>;

export function readServerEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  return serverSchema.parse(source);
}

export function isProductionRuntime(env: ServerEnv = readServerEnv()) {
  return env.NODE_ENV === "production" || env.VERCEL_ENV === "production";
}

export function isRazorpayConfigured(env: ServerEnv = readServerEnv()) {
  return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.RAZORPAY_WEBHOOK_SECRET);
}

/** Mock checkout exists only for local development and can never run in production. */
export function isMockCheckoutAllowed(env: ServerEnv = readServerEnv()) {
  return !isProductionRuntime(env) && !isRazorpayConfigured(env);
}

export function isEmailConfigured(env: ServerEnv = readServerEnv()) {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}
