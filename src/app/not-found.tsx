import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { InwardCircles } from "@/components/motifs";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-5 py-20">
      <div className="flex max-w-md flex-col items-center text-center">
        <Link href="/" aria-label="AntarKatha home" className="mb-10">
          <Logo />
        </Link>
        <InwardCircles className="size-24" />
        <p className="eyebrow mt-8">Page not found</p>
        <h1 className="mt-3 text-4xl text-ink">This path leads nowhere — yet.</h1>
        <p className="mt-4 text-ink-muted">
          The page may have moved, or the lesson may not be published. Today’s reading is always
          open.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/daily" className={buttonVariants()}>
            Go to today’s reading
          </Link>
          <Link href="/explore" className={buttonVariants({ variant: "outline" })}>
            Explore the library
          </Link>
        </div>
      </div>
    </main>
  );
}
