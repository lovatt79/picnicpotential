import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BuilderPageRenderer from "@/components/builder/BuilderPageRenderer";
import type { BuilderPage } from "@/lib/builder-types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BuilderPreviewPage({ params }: Props) {
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

  return (
    <>
      {/* Draft banner */}
      {!page.is_published && (
        <div className="bg-gold text-charcoal text-center py-2 text-sm font-medium">
          Draft Preview — This page is not published yet
        </div>
      )}
      <BuilderPageRenderer page={page as BuilderPage} />
    </>
  );
}
