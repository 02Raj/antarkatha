import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";
import { getTopicBySlug } from "@/lib/catalog/queries";
import { Container, SectionHeading } from "@/components/ui/layout";
import { LessonCard } from "@/components/catalog/lesson-card";
import { Notice } from "@/components/ui/feedback";

type Props = { params: Promise<{ slug: string }> };

const careTopics = new Set(["anxiety", "grief", "anger"]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { topic } = await getTopicBySlug(slug);
  if (!topic) return pageMetadata({ title: "Topic", description: "", path: `/topics/${slug}` });
  return pageMetadata({
    title: topic.title,
    description: topic.description,
    path: `/topics/${slug}`,
  });
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const { topic, lessons } = await getTopicBySlug(slug);
  if (!topic) notFound();

  return (
    <Container className="py-14">
      <SectionHeading
        as="h1"
        eyebrow="Life situation"
        title={topic.title}
        description={topic.description}
      />
      {careTopics.has(topic.slug) ? (
        <Notice className="mt-8 max-w-reading">
          This page names an ordinary human weather. It is not medical or mental-health treatment.
        </Notice>
      ) : null}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </Container>
  );
}
