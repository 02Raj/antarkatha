export const adminDesks = {
  content: { title: "Lessons", note: "Create, review, publish, and archive lessons." },
  collections: { title: "Collections", note: "Gita, Upanishads, epics, and later series." },
  topics: { title: "Topics", note: "Life situations used for discovery." },
  media: { title: "Media", note: "Motifs and protected audio uploads." },
  users: { title: "People", note: "Promote editors. Only admins assign roles." },
  orders: { title: "Orders", note: "Inspect payments without exposing secrets." },
  feedback: { title: "Inbox", note: "Reader notes with internal status." },
  analytics: { title: "Pulse", note: "Signups, completions, audio starts." },
  settings: { title: "Site settings", note: "Name, prices, navigation, SEO defaults." },
} as const;

export type AdminDeskSlug = keyof typeof adminDesks;
