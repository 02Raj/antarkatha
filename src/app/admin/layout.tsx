import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { defaultSiteSettings } from "@/config/site";
import { getViewer } from "@/lib/auth/viewer";
import { buttonVariants } from "@/components/ui/button";
import { InwardCircles } from "@/components/motifs";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login?next=/admin");
  if (!viewer.isStaff) {
    return (
      <main id="main" className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="flex max-w-md flex-col items-center text-center">
          <InwardCircles className="size-20" />
          <h1 className="mt-6 text-3xl">This desk is for editors</h1>
          <p className="mt-3 text-ink-muted">
            Your account can read and listen. Publishing lives with the editorial team.
          </p>
          <Link href="/dashboard" className={`${buttonVariants()} mt-8`}>
            Back to your practice
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="hairline border-b bg-surface/80">
        <div className="mx-auto flex h-14 max-w-content items-center justify-between px-5">
          <Link href="/admin" aria-label="Admin home">
            <Logo brandName={defaultSiteSettings.brandName} />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="link-quiet text-ink-muted">
              View site
            </Link>
            <Link href="/admin/content" className="link-quiet">
              Content
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
