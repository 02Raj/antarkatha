"use client";

import * as React from "react";
import Link from "next/link";
import type { CatalogLesson, CatalogTopic } from "@/lib/catalog/types";
import { LessonCard } from "@/components/catalog/lesson-card";
import { cn } from "@/lib/utils";

export function TopicSelector({
  topics,
  lessons,
}: {
  topics: CatalogTopic[];
  lessons: CatalogLesson[];
}) {
  const [active, setActive] = React.useState(topics[0]?.slug ?? "");
  const matches = lessons.filter((lesson) => lesson.topicSlugs.includes(active)).slice(0, 2);
  const topic = topics.find((item) => item.slug === active);

  return (
    <section
      aria-labelledby="navigate-heading"
      className="mx-auto max-w-content px-5 py-16 sm:px-8"
    >
      <p className="eyebrow">What are you navigating?</p>
      <h2 id="navigate-heading" className="mt-3 max-w-2xl text-3xl sm:text-4xl">
        Name the weather of the day. We will meet you there.
      </h2>
      <p className="mt-4 max-w-xl text-ink-muted">
        These are ordinary human situations, not diagnoses. Choose one to see a lesson that sits
        beside it.
      </p>
      <div className="mt-8 flex flex-wrap gap-2" role="radiogroup" aria-label="Situation">
        {topics.map((item) => {
          const selected = item.slug === active;
          return (
            <button
              key={item.slug}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setActive(item.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                selected
                  ? "border-forest bg-forest text-surface"
                  : "border-copper/80 bg-surface text-ink-soft hover:border-forest",
              )}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      {topic ? <p className="mt-6 max-w-reading text-ink-soft">{topic.description}</p> : null}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {matches.length ? (
          matches.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
        ) : (
          <p className="text-ink-muted">No published lessons for this theme yet.</p>
        )}
      </div>
      {topic ? (
        <p className="mt-6">
          <Link href={`/topics/${topic.slug}`} className="link-quiet text-forest">
            All lessons on {topic.title}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
