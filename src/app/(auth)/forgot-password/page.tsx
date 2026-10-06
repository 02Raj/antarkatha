import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { Container, SectionHeading } from "@/components/ui/layout";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <Container width="reading" className="flex flex-1 flex-col justify-center py-10">
      <SectionHeading
        as="h1"
        eyebrow="Account"
        title="Reset your password"
        description="We’ll send a link if that email has an account. The message is quiet on purpose."
        className="mb-8"
      />
      <AuthForm mode="forgot" configured={isSupabaseConfigured()} />
    </Container>
  );
}
