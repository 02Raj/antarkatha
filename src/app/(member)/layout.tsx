import { redirect } from "next/navigation";
import { defaultSiteSettings } from "@/config/site";
import { SiteShell } from "@/components/layout/site-shell";
import { getViewer } from "@/lib/auth/viewer";

export const dynamic = "force-dynamic";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login?next=/dashboard");
  return <SiteShell settings={defaultSiteSettings}>{children}</SiteShell>;
}
