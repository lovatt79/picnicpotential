"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import type { SeatingOption, SeatingSection } from "@/lib/supabase/types";

// ─── Sortable Item ─────────────────────────────────────────

function SortableItem({
  item,
  onDelete,
}: {
  item: SeatingOption;
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
      className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-charcoal truncate text-sm">{item.title}</h3>
          <span
            className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${
              item.is_published ? "bg-sage text-charcoal" : "bg-gray-200 text-gray-600"
            }`}
          >
            {item.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-xs text-warm-gray truncate mt-0.5">
          {item.description?.substring(0, 100) || "No description"}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link
          href={`/admin/seating/${item.id}`}
          className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Drag Overlay Item ─────────────────────────────────────

function DragOverlayItem({ item }: { item: SeatingOption }) {
  return (
    <div className="bg-white rounded-lg border-2 border-gold p-3 flex items-center gap-3 shadow-lg">
      <div className="text-gold shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-charcoal truncate text-sm">{item.title}</h3>
      </div>
    </div>
  );
}

// ─── Droppable Section Container ───────────────────────────

function DroppableSection({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[48px] rounded-lg p-2 transition-colors ${
        isOver ? "bg-gold/10 border-2 border-dashed border-gold" : "bg-gray-50/50"
      }`}
    >
      {children}
    </div>
  );
}

// ─── Section Modal ─────────────────────────────────────────

function SectionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; is_published: boolean; image_url: string | null; image_id: string | null }) => void;
  initialData?: { title: string; description: string; is_published: boolean; image_url: string | null; image_id: string | null };
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [imageId, setImageId] = useState<string | null>(initialData?.image_id || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="font-serif text-xl text-charcoal">
          {initialData ? "Edit Section" : "Add Section"}
        </h3>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="e.g. Premium Seating"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Description <span className="text-warm-gray font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="Shown as subtitle below section heading"
          />
        </div>

        <ImageUpload
          currentImageUrl={imageUrl}
          onImageUploaded={(url, id) => {
            setImageUrl(url || null);
            setImageId(id || null);
          }}
          label="Thumbnail Image"
          aspectRatio="4/3"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded text-gold focus:ring-gold"
          />
          <span className="text-charcoal">Published</span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-charcoal"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!title.trim()) return;
              onSave({
                title: title.trim(),
                description: description.trim(),
                is_published: isPublished,
                image_url: imageUrl,
                image_id: imageId,
              });
            }}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-40"
          >
            {initialData ? "Save Changes" : "Add Section"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────

export function SeatingList({
  initialItems,
  initialSections,
}: {
  initialItems: SeatingOption[];
  initialSections: SeatingSection[];
}) {
  const [items, setItems] = useState(initialItems);
  const [sections, setSections] = useState(initialSections);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<SeatingSection | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getItemsForSection = useCallback(
    (sectionId: string | null) =>
      items
        .filter((s) => s.section_id === sectionId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [items]
  );

  const findSectionForItem = useCallback(
    (itemId: string) => {
      const item = items.find((s) => s.id === itemId);
      return item?.section_id ?? null;
    },
    [items]
  );

  // ─── Drag handlers ────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItemId = active.id as string;
    const overId = over.id as string;

    let targetSectionId: string | null;
    const isOverSection = overId === "uncategorized" || sections.some((s) => s.id === overId);
    if (isOverSection) {
      targetSectionId = overId === "uncategorized" ? null : overId;
    } else {
      targetSectionId = findSectionForItem(overId);
    }

    const currentSectionId = findSectionForItem(activeItemId);

    if (currentSectionId !== targetSectionId) {
      setItems((prev) =>
        prev.map((s) =>
          s.id === activeItemId ? { ...s, section_id: targetSectionId } : s
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeItemId = active.id as string;
    const overId = over.id as string;
    const activeItem = items.find((s) => s.id === activeItemId);
    if (!activeItem) return;

    const currentSectionId = activeItem.section_id;

    const isOverSection = overId === "uncategorized" || sections.some((s) => s.id === overId);
    if (!isOverSection && active.id !== over.id) {
      const sectionItems = getItemsForSection(currentSectionId);
      const oldIndex = sectionItems.findIndex((s) => s.id === activeItemId);
      const newIndex = sectionItems.findIndex((s) => s.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(sectionItems, oldIndex, newIndex);
        setItems((prev) => {
          const otherItems = prev.filter((s) => s.section_id !== currentSectionId);
          return [...otherItems, ...reordered.map((s, i) => ({ ...s, sort_order: i }))];
        });

        for (let i = 0; i < reordered.length; i++) {
          await supabase
            .from("seating_options")
            .update({ sort_order: i })
            .eq("id", reordered[i].id);
        }
      }
    }

    const originalItem = initialItems.find((s) => s.id === activeItemId);
    if (originalItem && originalItem.section_id !== currentSectionId) {
      await supabase
        .from("seating_options")
        .update({ section_id: currentSectionId })
        .eq("id", activeItemId);

      const newSectionItems = items
        .filter((s) => s.section_id === currentSectionId)
        .sort((a, b) => a.sort_order - b.sort_order);
      for (let i = 0; i < newSectionItems.length; i++) {
        await supabase
          .from("seating_options")
          .update({ sort_order: i })
          .eq("id", newSectionItems[i].id);
      }
    }
  };

  // ─── Item CRUD ────────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this seating option?")) return;
    const { error } = await supabase.from("seating_options").delete().eq("id", id);
    if (!error) {
      setItems(items.filter((s) => s.id !== id));
      router.refresh();
    }
  };

  // ─── Section CRUD ─────────────────────────────────────

  const handleAddSection = async (data: { title: string; description: string; is_published: boolean; image_url: string | null; image_id: string | null }) => {
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.sort_order)) + 1 : 0;
    const { data: newSection, error } = await supabase
      .from("seating_sections")
      .insert({
        title: data.title,
        description: data.description || null,
        is_published: data.is_published,
        image_url: data.image_url,
        image_id: data.image_id,
        sort_order: maxOrder,
      })
      .select()
      .single();

    if (!error && newSection) {
      setSections([...sections, newSection]);
    }
    setShowSectionModal(false);
  };

  const handleEditSection = async (data: { title: string; description: string; is_published: boolean; image_url: string | null; image_id: string | null }) => {
    if (!editingSection) return;
    const { error } = await supabase
      .from("seating_sections")
      .update({
        title: data.title,
        description: data.description || null,
        is_published: data.is_published,
        image_url: data.image_url,
        image_id: data.image_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingSection.id);

    if (!error) {
      setSections(sections.map((s) => (s.id === editingSection.id ? { ...s, ...data } : s)));
    }
    setEditingSection(null);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section? Items in it will become uncategorized.")) return;
    const { error } = await supabase.from("seating_sections").delete().eq("id", sectionId);
    if (!error) {
      setSections(sections.filter((s) => s.id !== sectionId));
      setItems(items.map((s) => (s.section_id === sectionId ? { ...s, section_id: null } : s)));
    }
  };

  const handleMoveSectionUp = async (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections.forEach((s, i) => (s.sort_order = i));
    setSections(newSections);
    for (const s of newSections) {
      await supabase.from("seating_sections").update({ sort_order: s.sort_order }).eq("id", s.id);
    }
  };

  const handleMoveSectionDown = async (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    newSections.forEach((s, i) => (s.sort_order = i));
    setSections(newSections);
    for (const s of newSections) {
      await supabase.from("seating_sections").update({ sort_order: s.sort_order }).eq("id", s.id);
    }
  };

  // ─── Render ───────────────────────────────────────────

  const activeItem = activeId ? items.find((s) => s.id === activeId) : null;
  const uncategorizedItems = getItemsForSection(null);
  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-warm-gray">
          Drag items between sections to organize them
        </p>
        <button
          onClick={() => setShowSectionModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Section
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Uncategorized */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-sm font-semibold text-warm-gray uppercase tracking-wide">Uncategorized</h3>
            <span className="text-xs text-gray-400">({uncategorizedItems.length})</span>
          </div>
          <DroppableSection id="uncategorized">
            <SortableContext items={uncategorizedItems.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {uncategorizedItems.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3">Drag items here to uncategorize them</p>
                ) : (
                  uncategorizedItems.map((item) => (
                    <SortableItem key={item.id} item={item} onDelete={handleDelete} />
                  ))
                )}
              </div>
            </SortableContext>
          </DroppableSection>
        </div>

        {/* Named Sections */}
        {sortedSections.map((section, index) => {
          const sectionItems = getItemsForSection(section.id);
          return (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <h3 className="text-sm font-semibold text-charcoal">{section.title}</h3>
                {!section.is_published && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">Draft</span>
                )}
                <span className="text-xs text-gray-400">({sectionItems.length})</span>
                <div className="flex-1" />
                <button onClick={() => handleMoveSectionUp(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-charcoal disabled:opacity-30 transition-colors" title="Move section up">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button onClick={() => handleMoveSectionDown(index)} disabled={index >= sortedSections.length - 1} className="p-1 text-gray-400 hover:text-charcoal disabled:opacity-30 transition-colors" title="Move section down">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <button onClick={() => setEditingSection(section)} className="p-1 text-gray-400 hover:text-charcoal transition-colors" title="Edit section">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDeleteSection(section.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete section">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <DroppableSection id={section.id}>
                <SortableContext items={sectionItems.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {sectionItems.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-3">Drag items here to add them to this section</p>
                    ) : (
                      sectionItems.map((item) => (
                        <SortableItem key={item.id} item={item} onDelete={handleDelete} />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DroppableSection>
            </div>
          );
        })}

        <DragOverlay>
          {activeItem ? <DragOverlayItem item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Empty state */}
      {items.length === 0 && sections.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="font-serif text-xl text-charcoal mb-2">No seating options yet</h3>
          <p className="text-warm-gray mb-6">Get started by adding a section and your first seating option</p>
          <Link href="/admin/seating/new" className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors">
            Add Seating Option
          </Link>
        </div>
      )}

      {/* Section Modals */}
      <SectionModal isOpen={showSectionModal} onClose={() => setShowSectionModal(false)} onSave={handleAddSection} />
      <SectionModal
        key={editingSection?.id || "new"}
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleEditSection}
        initialData={editingSection ? { title: editingSection.title, description: editingSection.description || "", is_published: editingSection.is_published, image_url: editingSection.image_url, image_id: editingSection.image_id } : undefined}
      />
    </div>
  );
}
