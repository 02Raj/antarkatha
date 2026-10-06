import { BookOpen, Lightbulb, Footprints } from "lucide-react";

const layers = [
  {
    icon: BookOpen,
    title: "Story / Teaching",
    body: "A short scene or argument, told in contemporary English, with the source named and no invented verse numbers.",
  },
  {
    icon: Lightbulb,
    title: "Meaning",
    body: "What the passage is doing — in plain speech — without flattening it into a slogan.",
  },
  {
    icon: Footprints,
    title: "Practice",
    body: "One small act for the next twenty-four hours. Not a lifestyle. A return.",
  },
];

export function ThreeLayers() {
  return (
    <section aria-labelledby="layers-heading" className="mx-auto max-w-content px-5 py-16 sm:px-8">
      <p className="eyebrow">The shape of a lesson</p>
      <h2 id="layers-heading" className="mt-3 text-3xl sm:text-4xl">
        One lesson, three layers
      </h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-3">
        {layers.map((layer, index) => (
          <li key={layer.title} className="relative pt-2">
            <span className="font-serif text-5xl text-copper/80" aria-hidden="true">
              {index + 1}
            </span>
            <layer.icon className="mt-4 size-5 text-saffron" aria-hidden="true" />
            <h3 className="mt-3 text-2xl">{layer.title}</h3>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-muted">{layer.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
