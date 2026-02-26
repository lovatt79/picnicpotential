"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase/client";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

// ─── Types ──────────────────────────────────────────────────

interface MediaData {
  id: string;
  url: string;
  original_filename: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
}

interface PaletteImage {
  id: string;
  image_id: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  media: MediaData | null;
}

// ─── Sortable Card ──────────────────────────────────────────

function SortableCard({
  item,
  onDelete,
}: {
  item: PaletteImage;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
    >
      {item.media ? (
        <img
          src={item.media.url}
          alt={item.media.alt_text || item.media.original_filename}
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      ) : (
        <div className="aspect-[4/3] flex items-center justify-center text-gray-400 text-sm">
          Image not found
        </div>
      )}

      {/* Hover overlay with controls */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-white/90 rounded-lg cursor-grab active:cursor-grabbing text-gray-700 hover:text-charcoal shadow transition-colors"
          title="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 bg-white/90 rounded-lg text-gray-700 hover:text-red-600 shadow transition-colors"
          title="Remove image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Drag Overlay Card ──────────────────────────────────────

function DragOverlayCard({ item }: { item: PaletteImage }) {
  return (
    <div className="rounded-lg overflow-hidden border-2 border-gold shadow-xl bg-white">
      {item.media ? (
        <img
          src={item.media.url}
          alt={item.media.alt_text || item.media.original_filename}
          className="w-48 h-auto object-contain"
        />
      ) : (
        <div className="w-48 aspect-[4/3] flex items-center justify-center text-gray-400 text-sm">
          Image not found
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────

export default function ColorPaletteManager({
  initialImages,
}: {
  initialImages: PaletteImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ─── Drag handlers ─────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(images, oldIndex, newIndex).map((img, i) => ({
      ...img,
      sort_order: i,
    }));

    setImages(reordered);

    // Persist sort order
    for (let i = 0; i < reordered.length; i++) {
      await supabase
        .from("color_palette_images")
        .update({ sort_order: i })
        .eq("id", reordered[i].id);
    }
  };

  // ─── Upload handler ────────────────────────────────────

  const handleUpload = async (uploadedImages: Array<{ url: string; mediaId: string }>) => {
    setSaving(true);
    try {
      const maxOrder = images.length > 0 ? Math.max(...images.map((img) => img.sort_order)) + 1 : 0;

      for (let i = 0; i < uploadedImages.length; i++) {
        const { data, error } = await supabase
          .from("color_palette_images")
          .insert({
            image_id: uploadedImages[i].mediaId,
            sort_order: maxOrder + i,
            is_published: true,
          })
          .select("*, media:image_id(id, url, original_filename, alt_text, width, height)")
          .single();

        if (!error && data) {
          setImages((prev) => [...prev, data as PaletteImage]);
        }
      }
    } catch (err) {
      console.error("Error adding images:", err);
    } finally {
      setSaving(false);
    }
  };

  // ─── Media picker handler ──────────────────────────────

  const handleMediaSelect = async (items: Array<{ id: string; url: string }>) => {
    setSaving(true);
    try {
      const maxOrder = images.length > 0 ? Math.max(...images.map((img) => img.sort_order)) + 1 : 0;

      for (let i = 0; i < items.length; i++) {
        // Check if this image is already in the palette
        const existing = images.find((img) => img.image_id === items[i].id);
        if (existing) continue;

        const { data, error } = await supabase
          .from("color_palette_images")
          .insert({
            image_id: items[i].id,
            sort_order: maxOrder + i,
            is_published: true,
          })
          .select("*, media:image_id(id, url, original_filename, alt_text, width, height)")
          .single();

        if (!error && data) {
          setImages((prev) => [...prev, data as PaletteImage]);
        }
      }
    } catch (err) {
      console.error("Error adding from library:", err);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete handler ────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image from the color palette?")) return;

    const { error } = await supabase
      .from("color_palette_images")
      .delete()
      .eq("id", id);

    if (!error) {
      setImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  // ─── Render ────────────────────────────────────────────

  const activeImage = activeId ? images.find((img) => img.id === activeId) : null;
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <MultiImageUpload
          onImagesUploaded={handleUpload}
          label="Upload Images"
        />

        <button
          type="button"
          onClick={() => setShowMediaPicker(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Add from Library
        </button>

        {saving && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            Saving...
          </div>
        )}
      </div>

      {/* Image Grid */}
      {sortedImages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="font-serif text-xl text-charcoal mb-2">No images yet</h3>
          <p className="text-warm-gray">
            Upload images or add them from your media library to build the color palette gallery.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedImages.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedImages.map((image) => (
                <SortableCard key={image.id} item={image} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeImage ? <DragOverlayCard item={activeImage} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Image count */}
      {sortedImages.length > 0 && (
        <p className="text-sm text-warm-gray">
          {sortedImages.length} image{sortedImages.length !== 1 ? "s" : ""} in palette
        </p>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        multiple={true}
      />
    </div>
  );
}
