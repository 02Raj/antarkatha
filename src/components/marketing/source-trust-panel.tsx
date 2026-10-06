import Link from "next/link";

export function SourceTrustPanel() {
  return (
    <section aria-labelledby="trust-heading" className="mx-auto max-w-content px-5 py-16 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="eyebrow">Editorial honesty</p>
          <h2 id="trust-heading" className="mt-3 text-3xl sm:text-4xl">
            We would rather say less than invent a citation
          </h2>
        </div>
        <div className="space-y-4 text-[1.02rem] leading-relaxed text-ink-soft">
          <p>
            Every lesson names the tradition it sits in, and whether the prose is an adaptation. We
            do not invent verse numbers, translators, or Sanskrit quotations to look authoritative.
          </p>
          <p>
            If a source locator has not been reviewed, the item stays unpublished. Demo lessons in
            this library are labelled as demo adaptations.
          </p>
          <p>
            <Link href="/about" className="link-quiet text-forest">
              Read the source policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
