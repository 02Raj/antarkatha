import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .pipe(z.url().optional());

const optionalKey = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalKey,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalKey,
});

export type PublicEnv = {
  appUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

/**
 * NEXT_PUBLIC_* values must be referenced literally so Next.js can inline them
 * into the browser bundle.
 */
export function readPublicEnv(
  source: Record<string, string | undefined> = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
): PublicEnv {
  const parsed = publicSchema.safeParse(source);
  const data: Partial<z.infer<typeof publicSchema>> = parsed.success ? parsed.data : {};
  return {
    appUrl: (data.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
    supabaseUrl: data.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey:
      data.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export const publicEnv = readPublicEnv();

export function isSupabaseConfigured(env: PublicEnv = publicEnv) {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
