import { defaultSiteSettings } from "@/config/site";
import { SiteShell } from "@/components/layout/site-shell";
import { getSiteSettingsLive } from "@/lib/catalog/queries";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettingsLive().catch(() => defaultSiteSettings);
  return <SiteShell settings={settings}>{children}</SiteShell>;
}
