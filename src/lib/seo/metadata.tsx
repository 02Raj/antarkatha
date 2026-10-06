import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { defaultSiteSettings } from "@/config/site";

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes("AntarKatha")
    ? title
    : `${title} · ${defaultSiteSettings.brandName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: defaultSiteSettings.brandName,
      title: fullTitle,
      description,
      url,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: defaultSiteSettings.brandName,
    url: absoluteUrl("/"),
    description: defaultSiteSettings.description,
    email: defaultSiteSettings.contactEmail,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: defaultSiteSettings.brandName,
    url: absoluteUrl("/"),
    description: defaultSiteSettings.seo.defaultDescription,
  };
}
