import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { EmptyState, Notice, Skeleton } from "@/components/ui/feedback";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InwardCircles, LampMark, LeafLine, Ornament, RiverLine } from "@/components/motifs";
import { LogoMark } from "@/components/brand/logo";

export const metadata: Metadata = { title: "Style guide", robots: { index: false, follow: false } };

const swatches = [
  ["paper", "#F6F0E3"],
  ["surface", "#FFFDF8"],
  ["ink", "#1C1915"],
  ["ink-muted", "#6B6257"],
  ["saffron", "#B85C27"],
  ["saffron-ink", "#9A4A1E"],
  ["forest", "#23483A"],
  ["copper", "#C9A678"],
  ["danger", "#A13D3D"],
] as const;

/** Development-only reference of tokens and primitives. */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Container className="space-y-16 py-16">
      <SectionHeading as="h1" eyebrow="Foundation" title="AntarKatha style guide" />

      <section className="space-y-4">
        <h2 className="text-2xl">Colour</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map(([name, hex]) => (
            <li key={name} className="hairline overflow-hidden rounded-lg border bg-surface">
              <div className="h-16" style={{ background: hex }} />
              <p className="px-3 py-2 text-sm">
                {name} <span className="text-ink-muted">{hex}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Type</h2>
        <p className="text-display">Ancient wisdom, made clear.</p>
        <p className="prose-reading max-w-reading">
          Reading text is set in an editorial serif at a generous measure, so a lesson feels like a
          page rather than a feed.
        </p>
        <p className="eyebrow">Eyebrow label</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Marks & motifs</h2>
        <div className="flex flex-wrap items-center gap-8 text-forest-deep">
          <LogoMark className="size-16" />
          <LogoMark className="size-8" />
          <LogoMark className="size-4" />
          <InwardCircles className="size-24" />
          <LeafLine className="size-14" />
          <LampMark className="size-14" />
        </div>
        <RiverLine className="h-10 w-full" />
        <Ornament />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Controls</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="link">Link</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="saffron">Premium</Badge>
          <Badge tone="forest">Free</Badge>
          <StatusBadge status="published" />
          <StatusBadge status="draft" />
          <StatusBadge status="source_review_pending" />
        </div>
        <div className="grid max-w-xl gap-5">
          <Field id="sg-name" label="Display name" hint="Shown on your dashboard only." required>
            {(aria) => <Input {...aria} placeholder="Your name" />}
          </Field>
          <Field id="sg-email" label="Email" error="Enter a valid email address.">
            {(aria) => <Input {...aria} type="email" defaultValue="not-an-email" />}
          </Field>
          <Field id="sg-topic" label="Topic">
            {(aria) => (
              <Select {...aria} defaultValue="purpose">
                <option value="purpose">Purpose</option>
                <option value="grief">Grief</option>
              </Select>
            )}
          </Field>
          <Field id="sg-msg" label="Message">
            {(aria) => <Textarea {...aria} />}
          </Field>
        </div>
      </section>

      <section className="max-w-xl space-y-4">
        <h2 className="text-2xl">Feedback</h2>
        <Notice title="Source review pending">This lesson cannot be published yet.</Notice>
        <Notice tone="warning">Demo adaptation — verify before publishing.</Notice>
        <Notice tone="danger">Payment could not be verified.</Notice>
        <Skeleton className="h-6 w-2/3" />
        <EmptyState
          title="Nothing saved yet"
          description="Bookmark a lesson and it will wait for you here."
          action={<Button variant="outline">Explore the library</Button>}
        />
      </section>

      <section className="max-w-reading">
        <h2 className="mb-2 text-2xl">Accordion</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>Is this a translation?</AccordionTrigger>
            <AccordionContent>
              No — lessons are adaptations, and each names its source.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </Container>
  );
}
