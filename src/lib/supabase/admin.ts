import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";
import { readServerEnv } from "@/lib/env.server";
import type { Database } from "@/types/database";

/** Service-role client. Import only from server modules. Never send this key to the browser. */
export function createAdminClient() {
  const env = readServerEnv();
  if (!publicEnv.supabaseUrl || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service role is not configured.");
  }
  return createClient<Database>(publicEnv.supabaseUrl, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
