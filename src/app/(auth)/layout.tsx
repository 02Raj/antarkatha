import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { defaultSiteSettings } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-reading items-center justify-between px-5 py-6">
        <Link href="/" aria-label={`${defaultSiteSettings.brandName} home`}>
          <Logo brandName={defaultSiteSettings.brandName} />
        </Link>
        <Link href="/" className="text-sm text-ink-muted hover:text-ink">
          Back to the reading
        </Link>
      </header>
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
