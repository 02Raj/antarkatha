import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { InwardCircles, LeafLine } from "@/components/motifs";
import { cn } from "@/lib/utils";

type HeroTopic = { slug: string; title: string };

type EditorialHeroProps = {
  topics: HeroTopic[];
};

export function EditorialHero({ topics }: EditorialHeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-content items-center gap-14 px-5 pt-14 pb-20 sm:px-8 md:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-28">
        <div className="motion-safe:animate-fade-up">
          <p className="eyebrow">Read • Listen • Reflect</p>
          <h1 id="hero-title" className="mt-5 text-display text-ink">
            Ancient wisdom for the life you are <em className="text-forest">living now.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            Short lessons from the Gita, the Upanishads, the Mahabharata and the Ramayana — each one
            names the passage it adapts, explains it plainly, and leaves you with one small
            practice. About five minutes, read or heard.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/daily" className={buttonVariants({ size: "lg" })}>
              Begin today’s reading
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/explore" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Explore the library
            </Link>
          </div>
        </div>

        <ManuscriptComposition topics={topics} />
      </div>
    </section>
  );
}

/** Decorative page built from CSS rules and SVG motifs; chips are real links. */
function ManuscriptComposition({ topics }: { topics: HeroTopic[] }) {
  const placements = [
    "left-[4%] top-[8%] -rotate-2",
    "right-[2%] top-[22%] rotate-1",
    "left-[-2%] bottom-[26%] rotate-1",
    "right-[8%] bottom-[8%] -rotate-1",
  ];
  return (
    <div className="relative mx-auto aspect-[4/4.4] w-full max-w-[460px]">
      <div
        aria-hidden="true"
        className="hairline absolute inset-[6%_10%_4%_12%] rotate-[1.5deg] rounded-[14px] border bg-paper-deep"
      />
      <div
        aria-hidden="true"
        className="hairline absolute inset-[3%_12%_7%_9%] overflow-hidden rounded-[14px] border bg-surface"
      >
        <div className="margin-rule absolute inset-y-0 left-10 w-2" />
        <div
          className="absolute inset-[18%_10%_14%_22%]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 25px, color-mix(in oklab, var(--color-copper) 45%, transparent) 25px 26px)",
          }}
        />
        <p className="absolute top-[7%] left-[22%] font-serif text-sm text-ink-muted italic">
          adhyāya · a chapter, a reading
        </p>
        <InwardCircles className="absolute right-[-14%] bottom-[-10%] size-[62%] opacity-90" />
        <LeafLine className="absolute top-[8%] right-[9%] size-10 opacity-80" />
      </div>

      <ul aria-label="Begin with a theme" className="contents">
        {topics.slice(0, placements.length).map((topic, i) => (
          <li key={topic.slug} className={cn("absolute", placements[i])}>
            <Link
              href={`/topics/${topic.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-copper/80 bg-paper px-4 py-2 text-sm text-ink-soft shadow-[0_8px_20px_-16px_rgb(28_25_21/0.6)] transition-colors duration-200 hover:border-forest hover:text-forest"
            >
              <span className="size-1.5 rounded-full bg-saffron" aria-hidden="true" />
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
