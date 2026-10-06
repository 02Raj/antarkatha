import type { ContentBlock } from "@/lib/content/blocks";
import type {
  CatalogCollection,
  CatalogLesson,
  CatalogPlan,
  CatalogTopic,
} from "@/lib/catalog/types";

const h = (text: string): ContentBlock => ({ type: "heading", text, level: "h2" });
const p = (text: string): ContentBlock => ({ type: "paragraph", text });

export const DEMO_COLLECTIONS: CatalogCollection[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "bhagavad-gita",
    title: "Bhagavad Gita",
    shortTitle: "Gita",
    description:
      "Short lessons from the Gita’s conversation on duty, attention, and inner steadiness — adapted for a modern day, never presented as a translation.",
    introduction:
      "The Gita is a dialogue on a battlefield that is also a mind. These demo lessons stay with one image at a time, name their limits, and end with a practice you can keep.",
    sortOrder: 1,
    seoTitle: "Bhagavad Gita — short lessons",
    seoDescription: "Read and listen to short, source-aware Gita lessons for everyday life.",
    coverMotif: "chariot-line",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    slug: "upanishads",
    title: "Upanishads",
    shortTitle: "Upanishads",
    description:
      "Quiet inquiries from the Upanishadic tradition: self-knowledge, attention, and what remains when names fall away.",
    introduction:
      "The Upanishads ask more than they answer. Demo lessons here stay short, refuse invented verse numbers, and invite one honest sitting.",
    sortOrder: 2,
    seoTitle: "Upanishads — short inquiries",
    seoDescription: "Approachable Upanishadic lessons with clear adaptation notes.",
    coverMotif: "inward-circles",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    slug: "mahabharata",
    title: "Mahabharata",
    shortTitle: "Mahabharata",
    description:
      "Narrative lessons from the Mahabharata’s ethical weather: kinship, speech, and the cost of a hard choice.",
    introduction:
      "These stories are vast. We take one scene, say that it is a paraphrase, and look for a usable question — not a verdict on history.",
    sortOrder: 3,
    seoTitle: "Mahabharata — narrative lessons",
    seoDescription: "Short Mahabharata-inspired lessons on choice, speech, and leadership.",
    coverMotif: "river",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    slug: "ramayana",
    title: "Ramayana",
    shortTitle: "Ramayana",
    description: "Lessons from the Ramayana’s concern with promise, exile, and governing the self.",
    introduction:
      "Demo readings treat the epic as a living narrative tradition, not a proof-text. Locators stay generic until an editor verifies them.",
    sortOrder: 4,
    seoTitle: "Ramayana — lessons in promise",
    seoDescription: "Short Ramayana-inspired lessons on discipline, loyalty, and self-rule.",
    coverMotif: "leaf",
  },
];

export const DEMO_TOPICS: CatalogTopic[] = [
  {
    id: "101",
    slug: "anxiety",
    title: "Anxiety",
    description: "When the mind will not sit, and the day feels too loud.",
    iconKey: "ripple",
    sortOrder: 1,
  },
  {
    id: "102",
    slug: "purpose",
    title: "Purpose",
    description: "Work, calling, and the quieter question of what is worth doing.",
    iconKey: "lamp",
    sortOrder: 2,
  },
  {
    id: "103",
    slug: "discipline",
    title: "Discipline",
    description: "Keeping a small promise to yourself when nobody is watching.",
    iconKey: "rule",
    sortOrder: 3,
  },
  {
    id: "104",
    slug: "relationships",
    title: "Relationships",
    description: "Speech, loyalty, and the courage to stay in the room.",
    iconKey: "two-lines",
    sortOrder: 4,
  },
  {
    id: "105",
    slug: "anger",
    title: "Anger",
    description: "Heat that arrives dressed as clarity.",
    iconKey: "flame",
    sortOrder: 5,
  },
  {
    id: "106",
    slug: "grief",
    title: "Grief",
    description: "What we do with a name that is no longer in the house.",
    iconKey: "circle",
    sortOrder: 6,
  },
  {
    id: "107",
    slug: "leadership",
    title: "Leadership",
    description: "Holding a decision that will cost someone, including you.",
    iconKey: "spine",
    sortOrder: 7,
  },
];

function lesson(
  partial: Omit<CatalogLesson, "language" | "type" | "hasAudio" | "previewBlocks"> & {
    preview?: string;
  },
): CatalogLesson {
  const { preview, ...rest } = partial;
  return {
    language: "en",
    type: "lesson",
    hasAudio: false,
    previewBlocks: [p(preview ?? rest.summary)],
    ...rest,
  };
}

const gita = DEMO_COLLECTIONS[0]!;
const upanishads = DEMO_COLLECTIONS[1]!;
const maha = DEMO_COLLECTIONS[2]!;
const ramayana = DEMO_COLLECTIONS[3]!;

export const DEMO_LESSONS: CatalogLesson[] = [
  lesson({
    id: "201",
    slug: "when-the-mind-will-not-sit",
    title: "When the mind will not sit still",
    subtitle: "A Gita-inspired pause for a racing morning",
    summary:
      "Arjuna cannot lift his bow; you cannot start the day. This demo sits with that freeze without claiming a verse number.",
    collectionId: gita.id,
    collectionSlug: gita.slug,
    collectionTitle: gita.title,
    difficulty: "introductory",
    accessTier: "free",
    readingMinutes: 6,
    publishedAt: "2026-10-01T00:00:00.000Z",
    sortOrder: 1,
    topicSlugs: ["anxiety"],
    sourceTitle: "Bhagavad Gita (demo adaptation)",
    sourceLocator: "Editorial placeholder — opening battlefield dialogue; no verse number claimed",
    adaptationNote:
      "Demo adaptation — verify before publishing. Paraphrase for product demonstration only.",
    seoTitle: "When the mind will not sit still",
    seoDescription: "A short Gita-inspired lesson on beginning the day when anxiety is loud.",
    preview:
      "A warrior stands between two families and finds that his arms will not obey him. The scene is old. The feeling is ordinary: a full inbox, a hard conversation, a body that will not begin.",
    body: [
      h("Context"),
      p(
        "A warrior stands between two families and finds that his arms will not obey him. The scene is old. The feeling is ordinary: a full inbox, a hard conversation, a body that will not begin.",
      ),
      h("The passage / story"),
      p(
        "In the Gita’s opening movement, skill is not missing. What is missing is a mind that can stay. Krishna does not first hand over a technique. He asks Arjuna to see the field as it is — including the panic.",
      ),
      {
        type: "quote",
        text: "You are not asked to become someone calmer before you begin. You are asked to tell the truth about this trembling, and then take the next honest action.",
        attribution: "Demo paraphrase — not a translation",
      },
      h("Simple meaning"),
      p(
        "Anxiety often pretends it is information about the whole future. The Gita’s counsel, in this adaptation, is narrower: name the shaking, return to the one duty that is actually in your hands, and let the rest of the battlefield wait.",
      ),
      h("Why it matters today"),
      p(
        "A busy professional rarely needs more advice. They need a way to re-enter the hour they are in. Steadiness here is not a mood. It is a decision to stop rehearsing seven outcomes.",
      ),
      {
        type: "reflection",
        prompt: "Where, this morning, did you refuse to begin because you wanted certainty first?",
      },
      {
        type: "practice",
        title: "One practice",
        text: "Sit for three minutes. Feel both feet. Name one task that is actually yours today. Begin only that. Leave the rest unnamed until you are done.",
      },
      {
        type: "source-note",
        text: "Demo adaptation — verify before publishing. No verse number is claimed. This is not a translation of the Bhagavad Gita.",
      },
    ],
  }),
  lesson({
    id: "202",
    slug: "the-question-that-turns-inward",
    title: "The question that turns inward",
    subtitle: "An Upanishadic inquiry for people who are always looking outward",
    summary:
      "Two birds on one tree: one eats, one watches. A demo of self-inquiry that refuses to invent a citation.",
    collectionId: upanishads.id,
    collectionSlug: upanishads.slug,
    collectionTitle: upanishads.title,
    difficulty: "introductory",
    accessTier: "free",
    readingMinutes: 5,
    publishedAt: "2026-10-02T00:00:00.000Z",
    sortOrder: 1,
    topicSlugs: ["purpose"],
    sourceTitle: "Upanishads (demo adaptation)",
    sourceLocator: "Editorial placeholder — two-birds image; no verse number claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "The question that turns inward",
    seoDescription: "A short Upanishadic lesson on attention and purpose.",
    preview:
      "A well-known image in the Upanishadic tradition places two birds on a single tree. One pecks at the fruit. The other is still.",
    body: [
      h("Context"),
      p(
        "Much of a working life is spent tasting — news, praise, comparison. The Upanishads keep returning to a quieter companion: the one who watches the tasting.",
      ),
      h("The passage / story"),
      p(
        "A well-known image in the Upanishadic tradition places two birds on a single tree. One pecks at the fruit. The other is still, not because it is bored, but because it is complete.",
      ),
      {
        type: "verse",
        lines: [
          "One bird eats, and is tossed by every flavour.",
          "The other is near, unhungry, seeing the whole tree.",
        ],
        note: "Original English paraphrase for this demo. Not a translation.",
      },
      h("Simple meaning"),
      p(
        "You are not only the stream of wants. There is also a capacity to notice the want without immediately obeying it.",
      ),
      h("Why it matters today"),
      p(
        "Purpose is often hunted in titles. This lesson asks a prior question: who is the one hunting?",
      ),
      {
        type: "reflection",
        prompt:
          "When did you last catch yourself in the middle of reaching — and pause long enough to see the reaching itself?",
      },
      {
        type: "practice",
        title: "One practice",
        text: "Once today, before you pick up your phone, feel the urge as a sensation. Wait ten breaths. Then choose.",
      },
      {
        type: "source-note",
        text: "Demo adaptation — verify before publishing. The two-birds image is traditional; this locator is generic and non-authoritative.",
      },
    ],
  }),
  lesson({
    id: "203",
    slug: "keeping-a-promise-when-it-costs",
    title: "Keeping a promise when it costs you",
    subtitle: "A Ramayana-inspired reading on discipline that is not harshness",
    summary: "A word given in ease is tested in inconvenience. This demo stays with that test.",
    collectionId: ramayana.id,
    collectionSlug: ramayana.slug,
    collectionTitle: ramayana.title,
    difficulty: "introductory",
    accessTier: "free",
    readingMinutes: 6,
    publishedAt: "2026-10-03T00:00:00.000Z",
    sortOrder: 1,
    topicSlugs: ["discipline"],
    sourceTitle: "Ramayana (demo adaptation)",
    sourceLocator: "Editorial placeholder — promise and exile; no canto claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "Keeping a promise when it costs you",
    seoDescription: "A short Ramayana-inspired lesson on discipline and fidelity.",
    preview:
      "The Ramayana returns, again and again, to speech that binds. A promise is not a mood. It is a public fact you now have to live with.",
    body: [
      h("Context"),
      p(
        "The Ramayana returns, again and again, to speech that binds. A promise is not a mood. It is a public fact you now have to live with.",
      ),
      h("The passage / story"),
      p(
        "In the narrative tradition, a king’s word — and later Rama’s acceptance of exile — turns a household inside out. Whether you read it as history or poem, the ethical pressure is the same: can a person remain aligned with what they said when the cost arrives?",
      ),
      {
        type: "callout",
        tone: "note",
        text: "This is a demo telling. It does not assign a kanda or verse. Treat it as a prompt, not a citation.",
      },
      h("Simple meaning"),
      p(
        "Discipline is often sold as intensity. Here it is closer to fidelity: doing the small thing you already agreed to, without a speech about your virtue.",
      ),
      h("Why it matters today"),
      p(
        "Calendars fill with half-promises. The lesson is not to promise more. It is to make fewer, clearer commitments, and then keep them when they become inconvenient.",
      ),
      {
        type: "reflection",
        prompt:
          "Which promise of yours is currently being quietly renegotiated because it became inconvenient?",
      },
      {
        type: "practice",
        title: "One practice",
        text: "Choose one small kept-promise for the next 24 hours — a walk, a call, a bedtime. Tell no one. Keep it.",
      },
      {
        type: "source-note",
        text: "Demo adaptation — verify before publishing. Ramayana narrative tradition; no canto number claimed.",
      },
    ],
  }),
  lesson({
    id: "204",
    slug: "the-weight-of-a-hard-decision",
    title: "The weight of a hard decision",
    subtitle: "Mahabharata — leadership preview",
    summary:
      "A preview: choosing when every option will hurt someone. Full lesson reserved for members.",
    collectionId: maha.id,
    collectionSlug: maha.slug,
    collectionTitle: maha.title,
    difficulty: "familiar",
    accessTier: "premium",
    readingMinutes: 7,
    publishedAt: "2026-10-04T00:00:00.000Z",
    sortOrder: 1,
    topicSlugs: ["leadership"],
    sourceTitle: "Mahabharata (demo adaptation)",
    sourceLocator:
      "Editorial placeholder — counsel before a costly choice; no parva number claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "The weight of a hard decision",
    seoDescription: "A Mahabharata-inspired preview on leadership and costly choice.",
    preview:
      "The Mahabharata does not offer clean victories. Leadership, in these pages, is the willingness to stay with a decision after the applause has gone.",
    body: [
      h("Context"),
      p(
        "The Mahabharata does not offer clean victories. Leadership, in these pages, is the willingness to stay with a decision after the applause has gone.",
      ),
      p(
        "The full lesson unfolds the scene, the meaning, and a practice for people who manage other people’s work.",
      ),
      {
        type: "source-note",
        text: "Demo adaptation — verify before publishing. No verse or parva number claimed.",
      },
    ],
  }),
  lesson({
    id: "205",
    slug: "heat-that-looks-like-clarity",
    title: "Heat that looks like clarity",
    subtitle: "Gita — anger preview",
    summary: "Anger often arrives wearing the costume of insight. A short premium preview.",
    collectionId: gita.id,
    collectionSlug: gita.slug,
    collectionTitle: gita.title,
    difficulty: "introductory",
    accessTier: "premium",
    readingMinutes: 5,
    publishedAt: "2026-10-04T00:00:00.000Z",
    sortOrder: 2,
    topicSlugs: ["anger"],
    sourceTitle: "Bhagavad Gita (demo adaptation)",
    sourceLocator:
      "Editorial placeholder — teaching on krodha as a chain of mind; no verse claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "Heat that looks like clarity",
    seoDescription: "A Gita-inspired preview on anger.",
    preview: "The Gita treats anger as a sequence: a want, a snag, a story, a fire.",
    body: [
      h("Context"),
      p(
        "The Gita treats anger as a sequence: a want, a snag, a story, a fire. This demo names the sequence without quoting a numbered verse.",
      ),
      { type: "source-note", text: "Demo adaptation — verify before publishing." },
    ],
  }),
  lesson({
    id: "206",
    slug: "work-without-clinging-to-the-scoreboard",
    title: "Work without clinging to the scoreboard",
    subtitle: "Gita — purpose preview",
    summary: "Action without bargaining with the result. Premium preview.",
    collectionId: gita.id,
    collectionSlug: gita.slug,
    collectionTitle: gita.title,
    difficulty: "familiar",
    accessTier: "premium",
    readingMinutes: 6,
    publishedAt: "2026-10-04T00:00:00.000Z",
    sortOrder: 3,
    topicSlugs: ["purpose"],
    sourceTitle: "Bhagavad Gita (demo adaptation)",
    sourceLocator: "Editorial placeholder — teaching on action and fruit; no verse claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "Work without clinging to the scoreboard",
    seoDescription: "A Gita-inspired preview on purpose and results.",
    preview:
      "A famous Gita teaching distinguishes the work that is yours from the fruit you cannot command.",
    body: [
      h("Context"),
      p(
        "A famous Gita teaching distinguishes the work that is yours from the fruit you cannot command. This demo refuses to invent a verse number for that teaching.",
      ),
      { type: "source-note", text: "Demo adaptation — verify before publishing." },
    ],
  }),
  lesson({
    id: "207",
    slug: "what-remains-when-a-name-is-gone",
    title: "What remains when a name is gone",
    subtitle: "Upanishads — grief preview",
    summary: "Grief as a teacher of what we thought we owned. Premium preview.",
    collectionId: upanishads.id,
    collectionSlug: upanishads.slug,
    collectionTitle: upanishads.title,
    difficulty: "familiar",
    accessTier: "premium",
    readingMinutes: 6,
    publishedAt: "2026-10-04T00:00:00.000Z",
    sortOrder: 2,
    topicSlugs: ["grief"],
    sourceTitle: "Upanishads (demo adaptation)",
    sourceLocator: "Editorial placeholder — inquiry beside mortality; no verse claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "What remains when a name is gone",
    seoDescription: "An Upanishadic preview on grief and impermanence.",
    preview: "Some Upanishadic dialogues sit beside death without rushing to console.",
    body: [
      h("Context"),
      p(
        "Some Upanishadic dialogues sit beside death without rushing to console. This demo does the same, and does not claim a hymn number.",
      ),
      {
        type: "callout",
        tone: "note",
        text: "This is not medical or mental-health treatment. If you are in acute distress, seek appropriate human help.",
      },
      { type: "source-note", text: "Demo adaptation — verify before publishing." },
    ],
  }),
  lesson({
    id: "208",
    slug: "speaking-when-silence-would-be-easier",
    title: "Speaking when silence would be easier",
    subtitle: "Mahabharata — relationships preview",
    summary: "Truth-telling that is not cruelty. Premium preview.",
    collectionId: maha.id,
    collectionSlug: maha.slug,
    collectionTitle: maha.title,
    difficulty: "introductory",
    accessTier: "premium",
    readingMinutes: 5,
    publishedAt: "2026-10-04T00:00:00.000Z",
    sortOrder: 2,
    topicSlugs: ["relationships"],
    sourceTitle: "Mahabharata (demo adaptation)",
    sourceLocator: "Editorial placeholder — counsel and speech in kinship; no parva claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "Speaking when silence would be easier",
    seoDescription: "A Mahabharata-inspired preview on speech in relationships.",
    preview: "The epic is full of speeches that arrive too late, and silences that cost too much.",
    body: [
      h("Context"),
      p(
        "The epic is full of speeches that arrive too late, and silences that cost too much. This demo asks when a relationship needs a true sentence.",
      ),
      { type: "source-note", text: "Demo adaptation — verify before publishing." },
    ],
  }),
  lesson({
    id: "209",
    slug: "ruling-the-self-before-the-city",
    title: "Ruling the self before the city",
    subtitle: "Ramayana — leadership preview",
    summary: "Self-rule as the first jurisdiction. Premium preview.",
    collectionId: ramayana.id,
    collectionSlug: ramayana.slug,
    collectionTitle: ramayana.title,
    difficulty: "familiar",
    accessTier: "premium",
    readingMinutes: 6,
    publishedAt: "2026-10-04T00:00:00.000Z",
    sortOrder: 2,
    topicSlugs: ["leadership"],
    sourceTitle: "Ramayana (demo adaptation)",
    sourceLocator: "Editorial placeholder — self-rule; no canto claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "Ruling the self before the city",
    seoDescription: "A Ramayana-inspired preview on leadership as self-rule.",
    preview:
      "Before any throne in the story, there is a person who must govern appetite, fatigue, and pride.",
    body: [
      h("Context"),
      p(
        "Before any throne in the story, there is a person who must govern appetite, fatigue, and pride. This demo stays with that inner city.",
      ),
      { type: "source-note", text: "Demo adaptation — verify before publishing." },
    ],
  }),
  lesson({
    id: "210",
    slug: "small-practice-on-an-ordinary-morning",
    title: "A small practice on an ordinary morning",
    subtitle: "Gita — discipline preview",
    summary: "Abhyasa without theatre. Premium preview.",
    collectionId: gita.id,
    collectionSlug: gita.slug,
    collectionTitle: gita.title,
    difficulty: "introductory",
    accessTier: "premium",
    readingMinutes: 4,
    publishedAt: "2026-10-05T00:00:00.000Z",
    sortOrder: 4,
    topicSlugs: ["discipline"],
    sourceTitle: "Bhagavad Gita (demo adaptation)",
    sourceLocator: "Editorial placeholder — teaching on abhyasa; no verse claimed",
    adaptationNote: "Demo adaptation — verify before publishing.",
    seoTitle: "A small practice on an ordinary morning",
    seoDescription: "A Gita-inspired preview on daily discipline.",
    preview: "The Gita’s word for practice is closer to returning than to performing.",
    body: [
      h("Context"),
      p(
        "The Gita’s word for practice is closer to returning than to performing. This demo treats an ordinary morning as enough of a field.",
      ),
      { type: "source-note", text: "Demo adaptation — verify before publishing." },
    ],
  }),
];

export const DEMO_PLANS: CatalogPlan[] = [
  {
    id: "301",
    code: "free",
    name: "Free",
    description: "Today’s lesson, selected previews, bookmarks, and a short progress history.",
    billingInterval: null,
    pricePaise: 0,
    currency: "INR",
    features: [
      "Daily free lesson",
      "Selected collection previews",
      "Bookmarks",
      "Limited progress history",
    ],
    sortOrder: 1,
  },
  {
    id: "302",
    code: "founding_monthly",
    name: "Founding Member",
    description:
      "The complete reading and listening library, full progress, streaks, and new releases.",
    billingInterval: "month",
    pricePaise: 9900,
    currency: "INR",
    features: ["Complete library", "Progress and streaks", "New releases", "Read and listen"],
    sortOrder: 2,
  },
  {
    id: "303",
    code: "annual",
    name: "Annual",
    description: "The same complete access, billed once a year.",
    billingInterval: "year",
    pricePaise: 79900,
    currency: "INR",
    features: ["Everything in Founding Member", "Best value", "Billed yearly"],
    sortOrder: 3,
  },
];

export const DEMO_DAILY_SLUG = "when-the-mind-will-not-sit";
