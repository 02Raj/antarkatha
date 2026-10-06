import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero } from "@/components/marketing/editorial-hero";
import { TopicSelector } from "@/components/marketing/topic-selector";
import { LessonPreview } from "@/components/marketing/lesson-preview";
import { ThreeLayers } from "@/components/marketing/three-layers";
import { ExperienceSection } from "@/components/marketing/experience-section";
import { SourceTrustPanel } from "@/components/marketing/source-trust-panel";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { FinalCta } from "@/components/marketing/final-cta";
import { CollectionCard } from "@/components/catalog/collection-card";
import { JsonLd, organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo/metadata";
import {
  listCollections,
  listLessons,
  listPlans,
  listTopics,
  getDailyLesson,
} from "@/lib/catalog/queries";
import { Container, SectionHeading } from "@/components/ui/layout";

export const metadata: Metadata = pageMetadata({
  title: "Ancient wisdom for the life you are living now",
  description:
    "Read and listen to short, source-aware lessons from the Gita, Upanishads, Mahabharata and Ramayana.",
  path: "/",
});

export default async function HomePage() {
  const [{ data: topics }, { data: lessons }, { data: collections }, { data: plans }, daily] =
    await Promise.all([
      listTopics(),
      listLessons(),
      listCollections(),
      listPlans(),
      getDailyLesson(),
    ]);

  const counts = new Map<string, number>();
  for (const lesson of lessons) {
    counts.set(lesson.collectionSlug, (counts.get(lesson.collectionSlug) ?? 0) + 1);
  }

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <EditorialHero topics={topics.map((topic) => ({ slug: topic.slug, title: topic.title }))} />
      <TopicSelector topics={topics} lessons={lessons} />
      <LessonPreview lesson={daily.data.lesson} />
      <ThreeLayers />
      <section
        aria-labelledby="collections-heading"
        className="mx-auto max-w-content px-5 py-16 sm:px-8"
      >
        <SectionHeading
          id="collections-heading"
          eyebrow="The library"
          title="Four doors, one practice"
          description="Start with a collection if you already know the text you want to sit with."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              lessonCount={counts.get(collection.slug) ?? 0}
              layout={index === 0 ? "wide" : "regular"}
            />
          ))}
        </div>
      </section>
      <ExperienceSection />
      <SourceTrustPanel />
      <section
        aria-labelledby="pricing-preview"
        className="mx-auto max-w-content px-5 py-16 sm:px-8"
      >
        <SectionHeading
          id="pricing-preview"
          eyebrow="Membership"
          title="Open daily. Deeper if you stay."
          description="Launch prices, editable from the editorial desk. Nothing here pretends a payment has succeeded."
        />
        <div className="mt-10">
          <PricingCards plans={plans} />
        </div>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="link-quiet text-forest">
            Full pricing notes
          </Link>
        </p>
      </section>
      <Container className="py-8">
        <SectionHeading eyebrow="Questions" title="Before you begin" />
        <div className="mt-8">
          <FAQAccordion />
        </div>
      </Container>
      <FinalCta />
    </>
  );
}
