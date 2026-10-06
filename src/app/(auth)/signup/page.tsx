import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { Container, SectionHeading } from "@/components/ui/layout";
import { isSupabaseConfigured } from "@/lib/env";
import { safeInternalPath } from "@/lib/auth/paths";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <Container width="reading" className="flex flex-1 flex-col justify-center py-10">
      <SectionHeading
        as="h1"
        eyebrow="Begin"
        title="Create your place here"
        description="Email and password, or a magic link. Google is available when that provider is enabled on the project."
        className="mb-8"
      />
      <AuthForm
        mode="signup"
        nextPath={safeInternalPath(params.next)}
        configured={isSupabaseConfigured()}
      />
    </Container>
  );
}
