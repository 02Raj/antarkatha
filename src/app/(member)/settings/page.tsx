import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Notice } from "@/components/ui/feedback";
import { getViewer } from "@/lib/auth/viewer";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const viewer = await getViewer();
  return (
    <Container width="reading" className="py-16">
      <SectionHeading
        as="h1"
        eyebrow="Account"
        title="Settings"
        description="Language, email, and reading preferences will be editable here in Phase 4."
      />
      <Notice className="mt-8">
        Signed in as {viewer?.email ?? viewer?.displayName ?? "a member"}. Role is stored on the
        server and cannot be changed from this page.
      </Notice>
    </Container>
  );
}
