import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "./auth";

describe("auth validation", () => {
  it("normalises email and requires an 8-character password", () => {
    const ok = signInSchema.parse({ email: "  Ada@Example.com ", password: "abcdefgh" });
    expect(ok.email).toBe("ada@example.com");
    expect(signInSchema.safeParse({ email: "ada@example.com", password: "short" }).success).toBe(
      false,
    );
  });

  it("allows an optional display name on signup", () => {
    const ok = signUpSchema.parse({
      email: "ada@example.com",
      password: "abcdefgh",
      displayName: "Ada",
    });
    expect(ok.displayName).toBe("Ada");
  });
});
