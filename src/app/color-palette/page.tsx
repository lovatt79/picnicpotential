import { createClient } from "@/lib/supabase/server";
import ColorPaletteGrid from "./color-palette-grid";

export const metadata = {
  title: "Color Palette | Picnic Potential",
  description: "Browse our color palette options for your perfect picnic setup.",
};

export default async function ColorPalettePage() {
  const supabase = await createClient();

  const { data: paletteImages } = await supabase
    .from("color_palette_images")
    .select("*, media:image_id(id, url, original_filename, alt_text, width, height)")
    .eq("is_published", true)
    .order("sort_order");

  const images = (paletteImages ?? [])
    .filter((img: any) => img.media)
    .map((img: any) => ({
      url: img.media.url,
      alt: img.media.alt_text || img.media.original_filename || "Color palette",
    }));

  return (
    <main>
      {/* Hero */}
      <section className="bg-sage py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            Color Palette
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mx-auto">
            Browse our curated color palettes to find the perfect combination for your event.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {images.length > 0 ? (
          <ColorPaletteGrid images={images} />
        ) : (
          <div className="text-center py-16">
            <p className="text-warm-gray text-lg">
              Color palette images coming soon!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
