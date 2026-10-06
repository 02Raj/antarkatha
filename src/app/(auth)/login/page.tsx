import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { Container, SectionHeading } from "@/components/ui/layout";
import { isSupabaseConfigured } from "@/lib/env";
import { safeInternalPath } from "@/lib/auth/paths";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

const errorCopy: Record<string, string> = {
  auth: "That sign-in link was invalid or has expired. Try again.",
  config: "Authentication is not configured on this instance yet.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <Container width="reading" className="flex flex-1 flex-col justify-center py-10">
      <SectionHeading
        as="h1"
        eyebrow="Your practice"
        title="Welcome back"
        description="Sign in to save your place, keep a streak, and return to what you were reading."
        className="mb-8"
      />
      <AuthForm
        mode="login"
        nextPath={safeInternalPath(params.next)}
        configured={isSupabaseConfigured()}
        initialError={params.error ? errorCopy[params.error] : undefined}
      />
    </Container>
  );
}
