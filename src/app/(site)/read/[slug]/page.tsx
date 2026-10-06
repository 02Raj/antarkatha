import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { getLessonBySlug } from "@/lib/catalog/queries";
import { PublicLesson } from "@/components/reader/public-lesson";
import { notFound } from "next/navigation";
import { JsonLd } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { lesson } = await getLessonBySlug(slug);
  if (!lesson) return pageMetadata({ title: "Lesson", description: "", path: `/read/${slug}` });
  return pageMetadata({
    title: lesson.seoTitle ?? lesson.title,
    description: lesson.seoDescription ?? lesson.summary,
    path: `/read/${slug}`,
  });
}

export default async function ReadPage({ params }: Props) {
  const { slug } = await params;
  const { lesson, neighbours, canReadFull } = await getLessonBySlug(slug);
  if (!lesson) notFound();
  const index = neighbours.findIndex((item) => item.slug === lesson.slug);
  const previousSlug = neighbours[index - 1]?.slug;
  const nextSlug = neighbours[index + 1]?.slug;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: lesson.title,
          description: lesson.summary,
          url: absoluteUrl(`/read/${lesson.slug}`),
          inLanguage: "en-IN",
          isAccessibleForFree: lesson.accessTier === "free" || Boolean(canReadFull),
        }}
      />
      <PublicLesson
        lesson={lesson}
        canReadFull={Boolean(canReadFull)}
        previousSlug={previousSlug}
        nextSlug={nextSlug}
      />
    </>
  );
}
