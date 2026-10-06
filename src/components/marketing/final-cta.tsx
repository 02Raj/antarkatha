import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta" className="mx-auto max-w-content px-5 py-20 sm:px-8">
      <div className="rounded-xl bg-paper-deep px-6 py-12 text-center sm:px-12">
        <p className="eyebrow">Begin where you are</p>
        <h2 id="final-cta" className="mx-auto mt-4 max-w-2xl text-3xl sm:text-5xl">
          Five quiet minutes. A named source. One practice for the day.
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/daily" className={buttonVariants({ size: "lg" })}>
            Begin today’s reading
          </Link>
          <Link href="/explore" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Browse the library
          </Link>
        </div>
      </div>
    </section>
  );
}
