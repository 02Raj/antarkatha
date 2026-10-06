import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Notice } from "@/components/ui/feedback";
import { getViewer } from "@/lib/auth/viewer";
import { getReaderPreferences } from "@/lib/engagement/queries";
import { PreferencesForm } from "@/components/reader/preferences-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const viewer = await getViewer();
  const prefs = await getReaderPreferences();
  return (
    <Container width="reading" className="py-16">
      <SectionHeading
        as="h1"
        eyebrow="Account"
        title="Settings"
        description="Reading size, page colour, and whether the daily note may be emailed."
      />
      <Notice className="mt-8">
        Signed in as {viewer?.email ?? viewer?.displayName ?? "a member"}. Role is stored on the
        server and cannot be changed from this page.
      </Notice>
      <PreferencesForm prefs={prefs} />
    </Container>
  );
}
