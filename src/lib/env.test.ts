import { describe, expect, it } from "vitest";
import { isSupabaseConfigured, readPublicEnv } from "./env";
import {
  isMockCheckoutAllowed,
  isProductionRuntime,
  isRazorpayConfigured,
  readServerEnv,
} from "./env.server";

describe("public env", () => {
  it("falls back to localhost and treats blanks as missing", () => {
    const env = readPublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "  ",
    });
    expect(env.appUrl).toBe("http://localhost:3000");
    expect(isSupabaseConfigured(env)).toBe(false);
  });

  it("strips trailing slashes and detects supabase config", () => {
    const env = readPublicEnv({
      NEXT_PUBLIC_APP_URL: "https://antarkatha.example/",
      NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
    });
    expect(env.appUrl).toBe("https://antarkatha.example");
    expect(isSupabaseConfigured(env)).toBe(true);
  });

  it("accepts the publishable key when the anon key is absent", () => {
    const env = readPublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
    });
    expect(isSupabaseConfigured(env)).toBe(true);
    expect(env.supabaseAnonKey).toBe("sb_publishable_example");
  });
});

describe("server env guards", () => {
  const razorpay = {
    RAZORPAY_KEY_ID: "rzp_test_x",
    RAZORPAY_KEY_SECRET: "secret",
    RAZORPAY_WEBHOOK_SECRET: "whsec",
  };

  it("allows mock checkout only in development without razorpay keys", () => {
    expect(isMockCheckoutAllowed(readServerEnv({ NODE_ENV: "development" }))).toBe(true);
    expect(isMockCheckoutAllowed(readServerEnv({ NODE_ENV: "development", ...razorpay }))).toBe(
      false,
    );
  });

  it("never allows mock checkout in production, even without keys", () => {
    expect(isMockCheckoutAllowed(readServerEnv({ NODE_ENV: "production" }))).toBe(false);
    expect(
      isMockCheckoutAllowed(readServerEnv({ NODE_ENV: "development", VERCEL_ENV: "production" })),
    ).toBe(false);
    expect(isProductionRuntime(readServerEnv({ NODE_ENV: "test", VERCEL_ENV: "production" }))).toBe(
      true,
    );
  });

  it("requires all three razorpay secrets", () => {
    expect(isRazorpayConfigured(readServerEnv({ RAZORPAY_KEY_ID: "x" }))).toBe(false);
    expect(isRazorpayConfigured(readServerEnv(razorpay))).toBe(true);
  });
});
