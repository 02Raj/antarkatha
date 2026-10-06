import { NextResponse } from "next/server";
import { getLessonBySlug } from "@/lib/catalog/queries";
import { createServerSupabase } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

/** Short-lived redirect to a private audio object. 404 when no file exists. */
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const { lesson, canReadFull } = await getLessonBySlug(slug);
  if (!lesson?.hasAudio) return new NextResponse(null, { status: 404 });
  if (!canReadFull) return new NextResponse(null, { status: 403 });

  const supabase = await createServerSupabase();
  if (!supabase) return new NextResponse(null, { status: 404 });

  const { data } = await supabase
    .from("content_items")
    .select("audio_path")
    .eq("id", lesson.id)
    .maybeSingle();
  if (!data?.audio_path) return new NextResponse(null, { status: 404 });

  const signed = await supabase.storage.from("audio").createSignedUrl(data.audio_path, 60 * 15);
  if (!signed.data?.signedUrl) return new NextResponse(null, { status: 404 });
  return NextResponse.redirect(signed.data.signedUrl);
}
