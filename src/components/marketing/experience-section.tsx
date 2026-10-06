import Link from "next/link";
import { Headphones, Bookmark, RotateCcw, ChartNoAxesColumn } from "lucide-react";

const items = [
  {
    href: "/daily",
    icon: Headphones,
    title: "Listen",
    body: "Every lesson is written to be heard. If audio is still being prepared, we say so — nothing broken.",
  },
  {
    href: "/login?next=/bookmarks",
    icon: Bookmark,
    title: "Save",
    body: "Keep a lesson for an evening when you have more quiet. Sign in so it follows you.",
  },
  {
    href: "/dashboard",
    icon: RotateCcw,
    title: "Resume",
    body: "Return to the paragraph you left. Guests keep a local place; members sync after sign-in.",
  },
  {
    href: "/dashboard",
    icon: ChartNoAxesColumn,
    title: "Progress",
    body: "A streak is only a reminder to come back. It is not a score.",
  },
];

export function ExperienceSection() {
  return (
    <section aria-labelledby="experience-heading" className="bg-forest text-surface">
      <div className="mx-auto max-w-content px-5 py-16 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-copper-soft uppercase">
          The practice
        </p>
        <h2 id="experience-heading" className="mt-3 text-3xl text-surface sm:text-4xl">
          Listen, save, resume, and keep a quiet record
        </h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.title} className="border-t border-surface/15 pt-6">
              <item.icon className="size-5 text-copper" aria-hidden="true" />
              <h3 className="mt-3 font-serif text-2xl text-surface">{item.title}</h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-surface/80">{item.body}</p>
              <Link
                href={item.href}
                className="mt-4 inline-block text-sm text-copper-soft underline-offset-4 hover:underline"
              >
                Continue
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
