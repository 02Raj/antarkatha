import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { Container, SectionHeading } from "@/components/ui/layout";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Container width="reading" className="flex flex-1 flex-col justify-center py-10">
      <SectionHeading
        as="h1"
        eyebrow="Account"
        title="Choose a new password"
        description="You arrived here from a reset link. Set a password you can remember without writing it on the lesson page."
        className="mb-8"
      />
      <AuthForm mode="reset" configured={isSupabaseConfigured()} />
    </Container>
  );
}
