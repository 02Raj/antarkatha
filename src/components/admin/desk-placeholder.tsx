import { Container, SectionHeading } from "@/components/ui/layout";
import { Notice } from "@/components/ui/feedback";

export function AdminDeskPlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <Container className="py-12">
      <SectionHeading as="h1" eyebrow="Admin" title={title} description={note} />
      <Notice className="mt-8 max-w-reading">
        CRUD for this desk arrives in Phase 5. Publishing rules already exist in the database:
        source fields and an approved review are required before a lesson can go live.
      </Notice>
    </Container>
  );
}
