import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { parseExploreFilters } from "@/lib/catalog/filter";
import { listCollections, listTopics, searchLessons } from "@/lib/catalog/queries";
import { SearchAndFilters, Pagination } from "@/components/catalog/search-and-filters";
import { LessonCard } from "@/components/catalog/lesson-card";
import { Container, SectionHeading } from "@/components/ui/layout";
import { EmptyState } from "@/components/ui/feedback";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Explore the library",
  description:
    "Search short, source-aware lessons by collection, life situation, length, and access.",
  path: "/explore",
});

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseExploreFilters(params);
  const [{ data: collections }, { data: topics }, results] = await Promise.all([
    listCollections(),
    listTopics(),
    searchLessons(filters),
  ]);

  return (
    <Container className="py-14">
      <SectionHeading
        as="h1"
        eyebrow="Library"
        title="Find a lesson for this hour"
        description="Search titles and summaries. Filters stay in the address bar, so you can share a view."
      />
      <div className="mt-10">
        <SearchAndFilters filters={filters} collections={collections} topics={topics} />
      </div>
      <p className="mt-8 text-sm text-ink-muted">
        {results.total} {results.total === 1 ? "lesson" : "lessons"}
        {results.source === "demo" ? " · demo catalogue" : ""}
      </p>
      {results.items.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="Nothing in this corner of the library"
          description="Clear a filter, or begin with today’s open lesson."
          action={
            <Link href="/daily" className={buttonVariants()}>
              Today’s reading
            </Link>
          }
        />
      ) : (
        <ul className="mt-8 grid gap-4 lg:grid-cols-2">
          {results.items.map((lesson, index) => (
            <li key={lesson.id}>
              <LessonCard lesson={lesson} variant={index === 0 ? "featured" : "standard"} />
            </li>
          ))}
        </ul>
      )}
      <Pagination page={results.page} totalPages={results.totalPages} filters={filters} />
    </Container>
  );
}
