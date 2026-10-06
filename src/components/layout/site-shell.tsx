import type { SiteSettings } from "@/config/site";
import { AnnouncementStrip } from "@/components/layout/announcement-strip";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderConnected } from "@/components/layout/site-header-connected";

export function SiteShell({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementStrip message={settings.announcement} />
      <SiteHeaderConnected brandName={settings.brandName} nav={settings.primaryNav} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter
        brandName={settings.brandName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        social={settings.social}
      />
    </>
  );
}
