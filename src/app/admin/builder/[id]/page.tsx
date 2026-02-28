import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PageBuilderEditor from "./page-builder-editor";
import type { BuilderPage } from "@/lib/builder-types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BuilderEditorPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("builder_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (!page) {
    notFound();
  }

  // Resolve hero image URL if set
  let heroImageUrl: string | null = null;
  if (page.hero_image_id) {
    const { data: media } = await supabase
      .from("media")
      .select("url")
      .eq("id", page.hero_image_id)
      .single();
    heroImageUrl = media?.url || null;
  }

  return <PageBuilderEditor page={page as BuilderPage} initialHeroImageUrl={heroImageUrl} />;
}
