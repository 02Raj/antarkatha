import { createBrowserClient } from "@supabase/ssr";
import { publicEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types/database";

export function createBrowserSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient<Database>(publicEnv.supabaseUrl!, publicEnv.supabaseAnonKey!);
}
