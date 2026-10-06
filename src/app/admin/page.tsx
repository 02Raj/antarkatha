import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/layout";
import { getViewer } from "@/lib/auth/viewer";
import { adminDesks } from "@/config/admin-desks";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminHomePage() {
  const viewer = await getViewer();
  return (
    <Container className="py-12">
      <SectionHeading
        as="h1"
        eyebrow="Editorial desk"
        title={`Hello, ${viewer?.displayName ?? "editor"}`}
        description="A working CMS will land in Phase 5. The rooms below are reserved so the information architecture stays stable."
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(adminDesks).map(([slug, desk]) => (
          <li key={slug}>
            <Link
              href={`/admin/${slug}`}
              className="hairline block rounded-lg border bg-surface px-5 py-4 transition-colors hover:border-forest"
            >
              <p className="font-serif text-xl text-ink">{desk.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{desk.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
