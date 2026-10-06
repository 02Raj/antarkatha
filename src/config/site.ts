/**
 * Fallback site settings. At runtime these are overridden by rows in the
 * `site_settings` table (editable from /admin/settings); these values are used
 * when the database is unavailable or a key has not been set yet.
 */
export type NavItem = { label: string; href: string };

export type SiteSettings = {
  brandName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  announcement: string | null;
  primaryNav: NavItem[];
  social: { label: string; href: string }[];
  seo: { titleTemplate: string; defaultTitle: string; defaultDescription: string };
};

export const defaultSiteSettings: SiteSettings = {
  brandName: "AntarKatha",
  tagline: "Ancient wisdom, made clear for everyday life.",
  description:
    "Short, source-aware lessons from the Bhagavad Gita, Upanishads, Mahabharata and Ramayana — to read, listen to, and carry into your day.",
  contactEmail: "hello@example.com",
  announcement: "A five-minute pause for a clearer day.",
  primaryNav: [
    { label: "Explore", href: "/explore" },
    { label: "Daily Wisdom", href: "/daily" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ],
  social: [],
  seo: {
    titleTemplate: "%s · AntarKatha",
    defaultTitle: "AntarKatha — Ancient wisdom for the life you are living now",
    defaultDescription:
      "Read and listen to short, clear lessons from Indian scriptures, with sources noted and a practice for the day.",
  },
};

export const footerNav: { heading: string; links: NavItem[] }[] = [
  {
    heading: "Read",
    links: [
      { label: "Today’s lesson", href: "/daily" },
      { label: "Explore the library", href: "/explore" },
      { label: "Bhagavad Gita", href: "/collections/bhagavad-gita" },
      { label: "Upanishads", href: "/collections/upanishads" },
    ],
  },
  {
    heading: "AntarKatha",
    links: [
      { label: "About & source policy", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refunds", href: "/refund-policy" },
    ],
  },
];
