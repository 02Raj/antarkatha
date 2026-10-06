import { z } from "zod";

const nonEmpty = z.string().trim().min(1).max(8000);

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    text: z.string().trim().min(1).max(200),
    level: z.enum(["h2", "h3"]).default("h2"),
  }),
  z.object({ type: z.literal("paragraph"), text: nonEmpty }),
  z.object({
    type: z.literal("quote"),
    text: nonEmpty,
    attribution: z.string().trim().max(200).optional(),
  }),
  z.object({
    type: z.literal("verse"),
    lines: z.array(z.string().trim().min(1).max(400)).min(1).max(24),
    note: z.string().trim().max(400).optional(),
  }),
  z.object({ type: z.literal("translation"), text: nonEmpty }),
  z.object({
    type: z.literal("callout"),
    text: nonEmpty,
    tone: z.enum(["note", "warning"]).default("note"),
  }),
  z.object({ type: z.literal("divider") }),
  z.object({ type: z.literal("reflection"), prompt: z.string().trim().min(1).max(600) }),
  z.object({
    type: z.literal("practice"),
    title: z.string().trim().min(1).max(120).default("One practice"),
    text: nonEmpty,
  }),
  z.object({ type: z.literal("source-note"), text: nonEmpty }),
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const contentBlocksSchema = z.array(contentBlockSchema).max(80);

export function parseContentBlocks(input: unknown): ContentBlock[] {
  if (!Array.isArray(input)) return [];
  return input
    .flatMap((item) => {
      const parsed = contentBlockSchema.safeParse(item);
      return parsed.success ? [parsed.data] : [];
    })
    .slice(0, 80);
}

/** Extract searchable plain text. Never used as HTML. */
export function blocksToPlainText(blocks: ContentBlock[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
        case "quote":
        case "translation":
        case "callout":
        case "source-note":
          return block.text;
        case "verse":
          return block.lines.join(" ");
        case "reflection":
          return block.prompt;
        case "practice":
          return `${block.title} ${block.text}`;
        case "divider":
          return "";
      }
    })
    .filter(Boolean)
    .join(" ");
}
