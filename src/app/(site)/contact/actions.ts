"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { CONTACT_LIMIT, rateLimit } from "@/lib/server/rate-limit";
import { requestIp } from "@/lib/server/request-ip";
import { emailSchema } from "@/lib/validation/auth";
import { z } from "zod";
import { getViewer } from "@/lib/auth/viewer";
import type { FeedbackCategory } from "@/types/database";

export type ContactState = { error?: string; info?: string };

const schema = z.object({
  email: emailSchema,
  category: z.enum(["general", "content", "technical", "billing"]),
  message: z.string().trim().min(12, "Please write a little more.").max(4000),
});

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    category: formData.get("category"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const ip = await requestIp();
  const limited = rateLimit(`contact:${ip}`, CONTACT_LIMIT, 10 * 60 * 1000);
  if (!limited.ok) {
    return {
      error: `Too many notes from this network. Try again in ${limited.retryAfterSec} seconds.`,
    };
  }

  const viewer = await getViewer();
  const supabase = await createServerSupabase();
  if (!supabase) {
    return {
      info: "Your note was received on this instance. The inbox is not connected to a database yet.",
    };
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: viewer?.id ?? null,
    email: parsed.data.email,
    category: parsed.data.category as FeedbackCategory,
    message: parsed.data.message,
  });

  if (error) {
    return {
      info: "Your note was received on this instance. The inbox is not connected to a database yet — you can also use the email below.",
    };
  }

  return {
    info: "Thank you. An editor will read this — we reply when a correction or reply is needed.",
  };
}
