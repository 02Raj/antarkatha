import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";
import { getCollectionBySlug } from "@/lib/catalog/queries";
import { Container, SectionHeading } from "@/components/ui/layout";
import { LessonCard } from "@/components/catalog/lesson-card";
import { JsonLd } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { collection } = await getCollectionBySlug(slug);
  if (!collection)
    return pageMetadata({ title: "Collection", description: "", path: `/collections/${slug}` });
  return pageMetadata({
    title: collection.seoTitle ?? collection.title,
    description: collection.seoDescription ?? collection.description,
    path: `/collections/${slug}`,
  });
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const { collection, lessons } = await getCollectionBySlug(slug);
  if (!collection) notFound();

  return (
    <Container className="py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.title,
          description: collection.description,
          url: absoluteUrl(`/collections/${collection.slug}`),
        }}
      />
      <SectionHeading
        as="h1"
        eyebrow="Collection"
        title={collection.title}
        description={collection.introduction}
      />
      <ol className="mt-12 space-y-4">
        {lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <LessonCard lesson={lesson} variant={index % 3 === 0 ? "featured" : "standard"} />
          </li>
        ))}
      </ol>
    </Container>
  );
}
