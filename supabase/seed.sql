-- Demo seed. Clearly labelled adaptations — not translations, no invented citations.
-- Applied on `supabase db reset`. Safe to re-run only on an empty public schema.

insert into public.collections (
  id, slug, title, short_title, description, introduction, language, status, cover_config, sort_order,
  seo_title, seo_description
) values
  (
    '00000000-0000-4000-8000-000000000001',
    'bhagavad-gita',
    'Bhagavad Gita',
    'Gita',
    'Short lessons from the Gita’s conversation on duty, attention, and inner steadiness — adapted for a modern day, never presented as a translation.',
    'The Gita is a dialogue on a battlefield that is also a mind. These demo lessons stay with one image at a time, name their limits, and end with a practice you can keep.',
    'en',
    'published',
    '{"motif":"chariot-line","accent":"saffron"}'::jsonb,
    1,
    'Bhagavad Gita — short lessons',
    'Read and listen to short, source-aware Gita lessons for everyday life.'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'upanishads',
    'Upanishads',
    'Upanishads',
    'Quiet inquiries from the Upanishadic tradition: self-knowledge, attention, and what remains when names fall away.',
    'The Upanishads ask more than they answer. Demo lessons here stay short, refuse invented verse numbers, and invite one honest sitting.',
    'en',
    'published',
    '{"motif":"inward-circles","accent":"forest"}'::jsonb,
    2,
    'Upanishads — short inquiries',
    'Approachable Upanishadic lessons with clear adaptation notes.'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'mahabharata',
    'Mahabharata',
    'Mahabharata',
    'Narrative lessons from the Mahabharata’s ethical weather: kinship, speech, and the cost of a hard choice.',
    'These stories are vast. We take one scene, say that it is a paraphrase, and look for a usable question — not a verdict on history.',
    'en',
    'published',
    '{"motif":"river","accent":"copper"}'::jsonb,
    3,
    'Mahabharata — narrative lessons',
    'Short Mahabharata-inspired lessons on choice, speech, and leadership.'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'ramayana',
    'Ramayana',
    'Ramayana',
    'Lessons from the Ramayana’s concern with promise, exile, and governing the self.',
    'Demo readings treat the epic as a living narrative tradition, not a proof-text. Locators stay generic until an editor verifies them.',
    'en',
    'published',
    '{"motif":"leaf","accent":"forest"}'::jsonb,
    4,
    'Ramayana — lessons in promise',
    'Short Ramayana-inspired lessons on discipline, loyalty, and self-rule.'
  );

insert into public.topics (id, slug, title, description, icon_key, sort_order) values
  ('00000000-0000-4000-8000-000000000101', 'anxiety', 'Anxiety', 'When the mind will not sit, and the day feels too loud.', 'ripple', 1),
  ('00000000-0000-4000-8000-000000000102', 'purpose', 'Purpose', 'Work, calling, and the quieter question of what is worth doing.', 'lamp', 2),
  ('00000000-0000-4000-8000-000000000103', 'discipline', 'Discipline', 'Keeping a small promise to yourself when nobody is watching.', 'rule', 3),
  ('00000000-0000-4000-8000-000000000104', 'relationships', 'Relationships', 'Speech, loyalty, and the courage to stay in the room.', 'two-lines', 4),
  ('00000000-0000-4000-8000-000000000105', 'anger', 'Anger', 'Heat that arrives dressed as clarity.', 'flame', 5),
  ('00000000-0000-4000-8000-000000000106', 'grief', 'Grief', 'What we do with a name that is no longer in the house.', 'circle', 6),
  ('00000000-0000-4000-8000-000000000107', 'leadership', 'Leadership', 'Holding a decision that will cost someone, including you.', 'spine', 7);

-- Three fully readable free demos (generic locators, approved, published).
insert into public.content_items (
  id, slug, title, subtitle, summary, collection_id, language, type, difficulty, access_tier,
  reading_minutes, body, preview_blocks, source_title, source_locator, adaptation_note,
  review_status, status, published_at, sort_order, seo_title, seo_description
) values
(
  '00000000-0000-4000-8000-000000000201',
  'when-the-mind-will-not-sit',
  'When the mind will not sit still',
  'A Gita-inspired pause for a racing morning',
  'Arjuna cannot lift his bow; you cannot start the day. This demo sits with that freeze without claiming a verse number.',
  '00000000-0000-4000-8000-000000000001',
  'en', 'lesson', 'introductory', 'free', 6,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"A warrior stands between two families and finds that his arms will not obey him. The scene is old. The feeling is ordinary: a full inbox, a hard conversation, a body that will not begin."},
    {"type":"heading","text":"The passage / story","level":"h2"},
    {"type":"paragraph","text":"In the Gita’s opening movement, skill is not missing. What is missing is a mind that can stay. Krishna does not first hand over a technique. He asks Arjuna to see the field as it is — including the panic."},
    {"type":"quote","text":"You are not asked to become someone calmer before you begin. You are asked to tell the truth about this trembling, and then take the next honest action.","attribution":"Demo paraphrase — not a translation"},
    {"type":"heading","text":"Simple meaning","level":"h2"},
    {"type":"paragraph","text":"Anxiety often pretends it is information about the whole future. The Gita’s counsel, in this adaptation, is narrower: name the shaking, return to the one duty that is actually in your hands, and let the rest of the battlefield wait."},
    {"type":"heading","text":"Why it matters today","level":"h2"},
    {"type":"paragraph","text":"A busy professional rarely needs more advice. They need a way to re-enter the hour they are in. Steadiness here is not a mood. It is a decision to stop rehearsing seven outcomes."},
    {"type":"reflection","prompt":"Where, this morning, did you refuse to begin because you wanted certainty first?"},
    {"type":"practice","title":"One practice","text":"Sit for three minutes. Feel both feet. Name one task that is actually yours today. Begin only that. Leave the rest unnamed until you are done."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing. No verse number is claimed. This is not a translation of the Bhagavad Gita."}
  ]$json$::jsonb,
  $json$[
    {"type":"paragraph","text":"A warrior stands between two families and finds that his arms will not obey him. The scene is old. The feeling is ordinary: a full inbox, a hard conversation, a body that will not begin."}
  ]$json$::jsonb,
  'Bhagavad Gita (demo adaptation)',
  'Editorial placeholder — opening battlefield dialogue; no verse number claimed',
  'Demo adaptation — verify before publishing. Paraphrase for product demonstration only.',
  'approved', 'published', now(), 1,
  'When the mind will not sit still',
  'A short Gita-inspired lesson on beginning the day when anxiety is loud.'
),
(
  '00000000-0000-4000-8000-000000000202',
  'the-question-that-turns-inward',
  'The question that turns inward',
  'An Upanishadic inquiry for people who are always looking outward',
  'Two birds on one tree: one eats, one watches. A demo of self-inquiry that refuses to invent a citation.',
  '00000000-0000-4000-8000-000000000002',
  'en', 'lesson', 'introductory', 'free', 5,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"Much of a working life is spent tasting — news, praise, comparison. The Upanishads keep returning to a quieter companion: the one who watches the tasting."},
    {"type":"heading","text":"The passage / story","level":"h2"},
    {"type":"paragraph","text":"A well-known image in the Upanishadic tradition places two birds on a single tree. One pecks at the fruit. The other is still, not because it is bored, but because it is complete."},
    {"type":"verse","lines":["One bird eats, and is tossed by every flavour.","The other is near, unhungry, seeing the whole tree."],"note":"Original English paraphrase for this demo. Not a translation."},
    {"type":"heading","text":"Simple meaning","level":"h2"},
    {"type":"paragraph","text":"You are not only the stream of wants. There is also a capacity to notice the want without immediately obeying it. That noticing is not a personality type. It is trainable attention."},
    {"type":"heading","text":"Why it matters today","level":"h2"},
    {"type":"paragraph","text":"Purpose is often hunted in titles. This lesson asks a prior question: who is the one hunting? If that watcher is ignored, every new role will taste the same."},
    {"type":"reflection","prompt":"When did you last catch yourself in the middle of reaching — and pause long enough to see the reaching itself?"},
    {"type":"practice","title":"One practice","text":"Once today, before you pick up your phone, feel the urge as a sensation. Wait ten breaths. Then choose."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing. The two-birds image is traditional; this locator is generic and non-authoritative."}
  ]$json$::jsonb,
  $json$[
    {"type":"paragraph","text":"A well-known image in the Upanishadic tradition places two birds on a single tree. One pecks at the fruit. The other is still."}
  ]$json$::jsonb,
  'Upanishads (demo adaptation)',
  'Editorial placeholder — two-birds image in the Upanishadic tradition; no verse number claimed',
  'Demo adaptation — verify before publishing. Paraphrase for product demonstration only.',
  'approved', 'published', now(), 1,
  'The question that turns inward',
  'A short Upanishadic lesson on attention and purpose.'
),
(
  '00000000-0000-4000-8000-000000000203',
  'keeping-a-promise-when-it-costs',
  'Keeping a promise when it costs you',
  'A Ramayana-inspired reading on discipline that is not harshness',
  'A word given in ease is tested in inconvenience. This demo stays with that test.',
  '00000000-0000-4000-8000-000000000004',
  'en', 'lesson', 'introductory', 'free', 6,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"The Ramayana returns, again and again, to speech that binds. A promise is not a mood. It is a public fact you now have to live with."},
    {"type":"heading","text":"The passage / story","level":"h2"},
    {"type":"paragraph","text":"In the narrative tradition, a king’s word — and later Rama’s acceptance of exile — turns a household inside out. Whether you read it as history or poem, the ethical pressure is the same: can a person remain aligned with what they said when the cost arrives?"},
    {"type":"callout","tone":"note","text":"This is a demo telling. It does not assign a kanda or verse. Treat it as a prompt, not a citation."},
    {"type":"heading","text":"Simple meaning","level":"h2"},
    {"type":"paragraph","text":"Discipline is often sold as intensity. Here it is closer to fidelity: doing the small thing you already agreed to, without a speech about your virtue."},
    {"type":"heading","text":"Why it matters today","level":"h2"},
    {"type":"paragraph","text":"Calendars fill with half-promises. The lesson is not to promise more. It is to make fewer, clearer commitments, and then keep them when they become inconvenient."},
    {"type":"reflection","prompt":"Which promise of yours is currently being quietly renegotiated because it became inconvenient?"},
    {"type":"practice","title":"One practice","text":"Choose one small kept-promise for the next 24 hours — a walk, a call, a bedtime. Tell no one. Keep it."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing. Ramayana narrative tradition; no canto number claimed."}
  ]$json$::jsonb,
  $json$[
    {"type":"paragraph","text":"The Ramayana returns, again and again, to speech that binds. A promise is not a mood. It is a public fact you now have to live with."}
  ]$json$::jsonb,
  'Ramayana (demo adaptation)',
  'Editorial placeholder — promise and exile in the Ramayana narrative tradition; no canto claimed',
  'Demo adaptation — verify before publishing. Paraphrase for product demonstration only.',
  'approved', 'published', now(), 1,
  'Keeping a promise when it costs you',
  'A short Ramayana-inspired lesson on discipline and fidelity.'
);

-- Seven concise premium previews (published, approved, generic locators).
insert into public.content_items (
  id, slug, title, subtitle, summary, collection_id, language, type, difficulty, access_tier,
  reading_minutes, body, preview_blocks, source_title, source_locator, adaptation_note,
  review_status, status, published_at, sort_order, seo_title, seo_description
) values
(
  '00000000-0000-4000-8000-000000000204',
  'the-weight-of-a-hard-decision',
  'The weight of a hard decision',
  'Mahabharata — leadership preview',
  'A preview: choosing when every option will hurt someone. Full lesson reserved for members.',
  '00000000-0000-4000-8000-000000000003',
  'en', 'lesson', 'familiar', 'premium', 7,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"The Mahabharata does not offer clean victories. Leadership, in these pages, is the willingness to stay with a decision after the applause has gone."},
    {"type":"paragraph","text":"The full lesson unfolds the scene, the meaning, and a practice for people who manage other people’s work."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing. No verse or parva number claimed."}
  ]$json$::jsonb,
  $json$[
    {"type":"paragraph","text":"The Mahabharata does not offer clean victories. Leadership, in these pages, is the willingness to stay with a decision after the applause has gone."}
  ]$json$::jsonb,
  'Mahabharata (demo adaptation)',
  'Editorial placeholder — counsel before a costly choice; no parva number claimed',
  'Demo adaptation — verify before publishing.',
  'approved', 'published', now(), 1,
  'The weight of a hard decision',
  'A Mahabharata-inspired preview on leadership and costly choice.'
),
(
  '00000000-0000-4000-8000-000000000205',
  'heat-that-looks-like-clarity',
  'Heat that looks like clarity',
  'Gita — anger preview',
  'Anger often arrives wearing the costume of insight. A short premium preview.',
  '00000000-0000-4000-8000-000000000001',
  'en', 'lesson', 'introductory', 'premium', 5,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"The Gita treats anger as a sequence: a want, a snag, a story, a fire. This demo names the sequence without quoting a numbered verse."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing."}
  ]$json$::jsonb,
  $json$[{"type":"paragraph","text":"The Gita treats anger as a sequence: a want, a snag, a story, a fire."}]$json$::jsonb,
  'Bhagavad Gita (demo adaptation)',
  'Editorial placeholder — teaching on krodha as a chain of mind; no verse claimed',
  'Demo adaptation — verify before publishing.',
  'approved', 'published', now(), 2,
  'Heat that looks like clarity',
  'A Gita-inspired preview on anger.'
),
(
  '00000000-0000-4000-8000-000000000206',
  'work-without-clinging-to-the-scoreboard',
  'Work without clinging to the scoreboard',
  'Gita — purpose preview',
  'Action without bargaining with the result. Premium preview.',
  '00000000-0000-4000-8000-000000000001',
  'en', 'lesson', 'familiar', 'premium', 6,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"A famous Gita teaching distinguishes the work that is yours from the fruit you cannot command. This demo refuses to invent a verse number for that teaching."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing."}
  ]$json$::jsonb,
  $json$[{"type":"paragraph","text":"A famous Gita teaching distinguishes the work that is yours from the fruit you cannot command."}]$json$::jsonb,
  'Bhagavad Gita (demo adaptation)',
  'Editorial placeholder — teaching on action and fruit; no verse claimed',
  'Demo adaptation — verify before publishing.',
  'approved', 'published', now(), 3,
  'Work without clinging to the scoreboard',
  'A Gita-inspired preview on purpose and results.'
),
(
  '00000000-0000-4000-8000-000000000207',
  'what-remains-when-a-name-is-gone',
  'What remains when a name is gone',
  'Upanishads — grief preview',
  'Grief as a teacher of what we thought we owned. Premium preview.',
  '00000000-0000-4000-8000-000000000002',
  'en', 'lesson', 'familiar', 'premium', 6,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"Some Upanishadic dialogues sit beside death without rushing to console. This demo does the same, and does not claim a hymn number."},
    {"type":"callout","tone":"note","text":"This is not medical or mental-health treatment. If you are in acute distress, seek appropriate human help."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing."}
  ]$json$::jsonb,
  $json$[{"type":"paragraph","text":"Some Upanishadic dialogues sit beside death without rushing to console."}]$json$::jsonb,
  'Upanishads (demo adaptation)',
  'Editorial placeholder — inquiry beside mortality; no verse claimed',
  'Demo adaptation — verify before publishing.',
  'approved', 'published', now(), 2,
  'What remains when a name is gone',
  'An Upanishadic preview on grief and impermanence.'
),
(
  '00000000-0000-4000-8000-000000000208',
  'speaking-when-silence-would-be-easier',
  'Speaking when silence would be easier',
  'Mahabharata — relationships preview',
  'Truth-telling that is not cruelty. Premium preview.',
  '00000000-0000-4000-8000-000000000003',
  'en', 'lesson', 'introductory', 'premium', 5,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"The epic is full of speeches that arrive too late, and silences that cost too much. This demo asks when a relationship needs a true sentence."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing."}
  ]$json$::jsonb,
  $json$[{"type":"paragraph","text":"The epic is full of speeches that arrive too late, and silences that cost too much."}]$json$::jsonb,
  'Mahabharata (demo adaptation)',
  'Editorial placeholder — counsel and speech in kinship; no parva claimed',
  'Demo adaptation — verify before publishing.',
  'approved', 'published', now(), 2,
  'Speaking when silence would be easier',
  'A Mahabharata-inspired preview on speech in relationships.'
),
(
  '00000000-0000-4000-8000-000000000209',
  'ruling-the-self-before-the-city',
  'Ruling the self before the city',
  'Ramayana — leadership preview',
  'Self-rule as the first jurisdiction. Premium preview.',
  '00000000-0000-4000-8000-000000000004',
  'en', 'lesson', 'familiar', 'premium', 6,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"Before any throne in the story, there is a person who must govern appetite, fatigue, and pride. This demo stays with that inner city."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing."}
  ]$json$::jsonb,
  $json$[{"type":"paragraph","text":"Before any throne in the story, there is a person who must govern appetite, fatigue, and pride."}]$json$::jsonb,
  'Ramayana (demo adaptation)',
  'Editorial placeholder — self-rule in the Ramayana narrative tradition; no canto claimed',
  'Demo adaptation — verify before publishing.',
  'approved', 'published', now(), 2,
  'Ruling the self before the city',
  'A Ramayana-inspired preview on leadership as self-rule.'
),
(
  '00000000-0000-4000-8000-000000000210',
  'small-practice-on-an-ordinary-morning',
  'A small practice on an ordinary morning',
  'Gita — discipline preview',
  'Abhyasa without theatre. Premium preview.',
  '00000000-0000-4000-8000-000000000001',
  'en', 'lesson', 'introductory', 'premium', 4,
  $json$[
    {"type":"heading","text":"Context","level":"h2"},
    {"type":"paragraph","text":"The Gita’s word for practice is closer to returning than to performing. This demo treats an ordinary morning as enough of a field."},
    {"type":"source-note","text":"Demo adaptation — verify before publishing."}
  ]$json$::jsonb,
  $json$[{"type":"paragraph","text":"The Gita’s word for practice is closer to returning than to performing."}]$json$::jsonb,
  'Bhagavad Gita (demo adaptation)',
  'Editorial placeholder — teaching on abhyasa; no verse claimed',
  'Demo adaptation — verify before publishing.',
  'approved', 'published', now(), 4,
  'A small practice on an ordinary morning',
  'A Gita-inspired preview on daily discipline.'
);

insert into public.content_topics (content_id, topic_id) values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000101'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000102'),
  ('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000103'),
  ('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000107'),
  ('00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000105'),
  ('00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000102'),
  ('00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000106'),
  ('00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000104'),
  ('00000000-0000-4000-8000-000000000209', '00000000-0000-4000-8000-000000000107'),
  ('00000000-0000-4000-8000-000000000210', '00000000-0000-4000-8000-000000000103');

insert into public.daily_features (feature_date, content_id, timezone, active)
values ((timezone('Asia/Kolkata', now()))::date, '00000000-0000-4000-8000-000000000201', 'Asia/Kolkata', true);

insert into public.plans (id, code, name, description, billing_interval, price_paise, currency, active, features, sort_order)
values
  (
    '00000000-0000-4000-8000-000000000301',
    'free',
    'Free',
    'Today’s lesson, selected previews, bookmarks, and a short progress history.',
    null,
    0,
    'INR',
    true,
    '["Daily free lesson","Selected collection previews","Bookmarks","Limited progress history"]'::jsonb,
    1
  ),
  (
    '00000000-0000-4000-8000-000000000302',
    'founding_monthly',
    'Founding Member',
    'The complete reading and listening library, full progress, streaks, and new releases.',
    'month',
    9900,
    'INR',
    true,
    '["Complete library","Progress and streaks","New releases","Read and listen"]'::jsonb,
    2
  ),
  (
    '00000000-0000-4000-8000-000000000303',
    'annual',
    'Annual',
    'The same complete access, billed once a year.',
    'year',
    79900,
    'INR',
    true,
    '["Everything in Founding Member","Best value","Billed yearly"]'::jsonb,
    3
  );

insert into public.site_settings (key, value) values
  ('brand', '{"brandName":"AntarKatha","tagline":"Ancient wisdom, made clear for everyday life.","contactEmail":"hello@example.com","announcement":"A five-minute pause for a clearer day."}'::jsonb),
  ('seo', '{"titleTemplate":"%s · AntarKatha","defaultTitle":"AntarKatha — Ancient wisdom for the life you are living now","defaultDescription":"Read and listen to short, clear lessons from Indian scriptures, with sources noted and a practice for the day."}'::jsonb),
  ('navigation', '{"primaryNav":[{"label":"Explore","href":"/explore"},{"label":"Daily Wisdom","href":"/daily"},{"label":"Pricing","href":"/pricing"},{"label":"About","href":"/about"}],"social":[]}'::jsonb),
  ('editorial', '{"sourcePolicy":"Adaptations are labelled. Verse numbers, translators, and Sanskrit quotations are never invented. Unpublished items remain in Source review pending."}'::jsonb);
