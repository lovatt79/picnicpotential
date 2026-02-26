import { createClient } from "@/lib/supabase/server";
import ColorPaletteManager from "./color-palette-manager";

export default async function AdminColorPalettePage() {
  const supabase = await createClient();

  const { data: paletteImages } = await supabase
    .from("color_palette_images")
    .select("*, media:image_id(id, url, original_filename, alt_text, width, height)")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Color Palette</h1>
          <p className="text-warm-gray mt-1">
            Manage the color palette image gallery
          </p>
        </div>
      </div>

      <ColorPaletteManager initialImages={paletteImages ?? []} />
    </div>
  );
}
