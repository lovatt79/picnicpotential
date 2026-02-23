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
import type { VendorPartner, PartnerSection } from "@/lib/supabase/types";

// ─── Sortable Item ─────────────────────────────────────────

function SortableItem({
  partner,
  onDelete,
}: {
  partner: VendorPartner;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: partner.id });

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

      {/* Logo thumbnail */}
      <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center overflow-hidden shrink-0">
        {partner.logo_url ? (
          <img src={partner.logo_url} alt="" className="w-full h-full object-contain" />
        ) : (
          <span className="text-xs font-serif text-sage-dark">{partner.name.charAt(0)}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-charcoal truncate text-sm">{partner.name}</h3>
          <span
            className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${
              partner.is_published ? "bg-sage text-charcoal" : "bg-gray-200 text-gray-600"
            }`}
          >
            {partner.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-xs text-warm-gray truncate mt-0.5">
          {partner.category}{partner.location ? ` \u2022 ${partner.location}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link
          href={`/admin/partners/${partner.id}`}
          className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={() => onDelete(partner.id)}
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

// ─── Drag Overlay Item (rendered while dragging) ───────────

function DragOverlayItem({ partner }: { partner: VendorPartner }) {
  return (
    <div className="bg-white rounded-lg border-2 border-gold p-3 flex items-center gap-3 shadow-lg">
      <div className="text-gold shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-charcoal truncate text-sm">{partner.name}</h3>
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
  onSave: (data: { title: string; description: string; badge_label: string; badge_style: string; is_published: boolean }) => void;
  initialData?: { title: string; description: string; badge_label: string; badge_style: string; is_published: boolean };
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [badgeLabel, setBadgeLabel] = useState(initialData?.badge_label || "");
  const [badgeStyle, setBadgeStyle] = useState(initialData?.badge_style || "gold");
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="font-serif text-xl text-charcoal">
          {initialData ? "Edit Section" : "Add Section"}
        </h3>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Section Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="e.g. Our VIP Partners"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Description <span className="text-warm-gray font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="Shown as subtitle below section heading on the partners page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Badge Label <span className="text-warm-gray font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={badgeLabel}
            onChange={(e) => setBadgeLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="e.g. VIP Partners"
          />
          <p className="text-xs text-warm-gray mt-1">Short label shown above section title on frontend</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Badge Style</label>
          <select
            value={badgeStyle}
            onChange={(e) => setBadgeStyle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            <option value="gold">Gold</option>
            <option value="sage">Sage</option>
            <option value="cream">Cream</option>
          </select>
        </div>

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
                badge_label: badgeLabel.trim(),
                badge_style: badgeStyle,
                is_published: isPublished,
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

export function PartnersList({
  initialPartners,
  initialSections,
}: {
  initialPartners: VendorPartner[];
  initialSections: PartnerSection[];
}) {
  const [partners, setPartners] = useState(initialPartners);
  const [sections, setSections] = useState(initialSections);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<PartnerSection | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Group partners by section
  const getPartnersForSection = useCallback(
    (sectionId: string | null) =>
      partners
        .filter((p) => p.section_id === sectionId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [partners]
  );

  // Find which section a partner belongs to
  const findSectionForPartner = useCallback(
    (partnerId: string) => {
      const partner = partners.find((p) => p.id === partnerId);
      return partner?.section_id ?? null;
    },
    [partners]
  );

  // ─── Drag handlers ────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activePartnerId = active.id as string;
    const overId = over.id as string;

    // Determine the target section
    let targetSectionId: string | null;

    const isOverSection = overId === "uncategorized" || sections.some((s) => s.id === overId);
    if (isOverSection) {
      targetSectionId = overId === "uncategorized" ? null : overId;
    } else {
      targetSectionId = findSectionForPartner(overId);
    }

    const currentSectionId = findSectionForPartner(activePartnerId);

    // Move to different section
    if (currentSectionId !== targetSectionId) {
      setPartners((prev) =>
        prev.map((p) =>
          p.id === activePartnerId ? { ...p, section_id: targetSectionId } : p
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activePartnerId = active.id as string;
    const overId = over.id as string;
    const activePartner = partners.find((p) => p.id === activePartnerId);
    if (!activePartner) return;

    const currentSectionId = activePartner.section_id;

    // Handle reordering within the same section
    const isOverSection = overId === "uncategorized" || sections.some((s) => s.id === overId);
    if (!isOverSection && active.id !== over.id) {
      const sectionPartners = getPartnersForSection(currentSectionId);
      const oldIndex = sectionPartners.findIndex((p) => p.id === activePartnerId);
      const newIndex = sectionPartners.findIndex((p) => p.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(sectionPartners, oldIndex, newIndex);
        setPartners((prev) => {
          const otherPartners = prev.filter((p) => p.section_id !== currentSectionId);
          return [...otherPartners, ...reordered.map((p, i) => ({ ...p, sort_order: i }))];
        });

        // Update sort_order in DB
        for (let i = 0; i < reordered.length; i++) {
          await supabase
            .from("vendor_partners")
            .update({ sort_order: i })
            .eq("id", reordered[i].id);
        }
      }
    }

    // Persist section change
    const originalPartner = initialPartners.find((p) => p.id === activePartnerId);
    if (originalPartner && originalPartner.section_id !== currentSectionId) {
      await supabase
        .from("vendor_partners")
        .update({ section_id: currentSectionId })
        .eq("id", activePartnerId);

      // Update sort_order for items in the new section
      const newSectionPartners = partners
        .filter((p) => p.section_id === currentSectionId)
        .sort((a, b) => a.sort_order - b.sort_order);
      for (let i = 0; i < newSectionPartners.length; i++) {
        await supabase
          .from("vendor_partners")
          .update({ sort_order: i })
          .eq("id", newSectionPartners[i].id);
      }
    }
  };

  // ─── Partner CRUD ──────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    const { error } = await supabase.from("vendor_partners").delete().eq("id", id);
    if (!error) {
      setPartners(partners.filter((p) => p.id !== id));
      router.refresh();
    }
  };

  // ─── Section CRUD ──────────────────────────────────────

  const handleAddSection = async (data: { title: string; description: string; badge_label: string; badge_style: string; is_published: boolean }) => {
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.sort_order)) + 1 : 0;
    const { data: newSection, error } = await supabase
      .from("partner_sections")
      .insert({
        title: data.title,
        description: data.description || null,
        badge_label: data.badge_label || null,
        badge_style: data.badge_style || "gold",
        is_published: data.is_published,
        sort_order: maxOrder,
      })
      .select()
      .single();

    if (!error && newSection) {
      setSections([...sections, newSection]);
    }
    setShowSectionModal(false);
  };

  const handleEditSection = async (data: { title: string; description: string; badge_label: string; badge_style: string; is_published: boolean }) => {
    if (!editingSection) return;
    const { error } = await supabase
      .from("partner_sections")
      .update({
        title: data.title,
        description: data.description || null,
        badge_label: data.badge_label || null,
        badge_style: data.badge_style || "gold",
        is_published: data.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingSection.id);

    if (!error) {
      setSections(sections.map((s) => (s.id === editingSection.id ? { ...s, ...data } : s)));
    }
    setEditingSection(null);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section? Partners in it will become uncategorized.")) return;
    const { error } = await supabase.from("partner_sections").delete().eq("id", sectionId);
    if (!error) {
      setSections(sections.filter((s) => s.id !== sectionId));
      setPartners(partners.map((p) => (p.section_id === sectionId ? { ...p, section_id: null } : p)));
    }
  };

  const handleMoveSectionUp = async (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections.forEach((s, i) => (s.sort_order = i));
    setSections(newSections);
    for (const s of newSections) {
      await supabase.from("partner_sections").update({ sort_order: s.sort_order }).eq("id", s.id);
    }
  };

  const handleMoveSectionDown = async (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    newSections.forEach((s, i) => (s.sort_order = i));
    setSections(newSections);
    for (const s of newSections) {
      await supabase.from("partner_sections").update({ sort_order: s.sort_order }).eq("id", s.id);
    }
  };

  // ─── Render ────────────────────────────────────────────

  const activePartner = activeId ? partners.find((p) => p.id === activeId) : null;
  const uncategorizedPartners = getPartnersForSection(null);
  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-warm-gray">
          Drag partners between sections to organize them
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
        {/* Uncategorized Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-sm font-semibold text-warm-gray uppercase tracking-wide">
              Uncategorized
            </h3>
            <span className="text-xs text-gray-400">({uncategorizedPartners.length})</span>
          </div>
          <DroppableSection id="uncategorized">
            <SortableContext
              items={uncategorizedPartners.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {uncategorizedPartners.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3">
                    Drag partners here to uncategorize them
                  </p>
                ) : (
                  uncategorizedPartners.map((partner) => (
                    <SortableItem key={partner.id} partner={partner} onDelete={handleDelete} />
                  ))
                )}
              </div>
            </SortableContext>
          </DroppableSection>
        </div>

        {/* Named Sections */}
        {sortedSections.map((section, index) => {
          const sectionPartners = getPartnersForSection(section.id);
          return (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <h3 className="text-sm font-semibold text-charcoal">
                  {section.title}
                </h3>
                {!section.is_published && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                    Draft
                  </span>
                )}
                <span className="text-xs text-gray-400">({sectionPartners.length})</span>
                <div className="flex-1" />

                {/* Section controls */}
                <button
                  onClick={() => handleMoveSectionUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-charcoal disabled:opacity-30 transition-colors"
                  title="Move section up"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMoveSectionDown(index)}
                  disabled={index >= sortedSections.length - 1}
                  className="p-1 text-gray-400 hover:text-charcoal disabled:opacity-30 transition-colors"
                  title="Move section down"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setEditingSection(section)}
                  className="p-1 text-gray-400 hover:text-charcoal transition-colors"
                  title="Edit section"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete section"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <DroppableSection id={section.id}>
                <SortableContext
                  items={sectionPartners.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {sectionPartners.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-3">
                        Drag partners here to add them to this section
                      </p>
                    ) : (
                      sectionPartners.map((partner) => (
                        <SortableItem key={partner.id} partner={partner} onDelete={handleDelete} />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DroppableSection>
            </div>
          );
        })}

        <DragOverlay>
          {activePartner ? <DragOverlayItem partner={activePartner} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Empty state */}
      {partners.length === 0 && sections.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="font-serif text-xl text-charcoal mb-2">No partners yet</h3>
          <p className="text-warm-gray mb-6">Get started by adding a section and your first partner</p>
          <Link
            href="/admin/partners/new"
            className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
          >
            Add Partner
          </Link>
        </div>
      )}

      {/* Section Modals */}
      <SectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        onSave={handleAddSection}
      />
      <SectionModal
        key={editingSection?.id || "new"}
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleEditSection}
        initialData={
          editingSection
            ? {
                title: editingSection.title,
                description: editingSection.description || "",
                badge_label: editingSection.badge_label || "",
                badge_style: editingSection.badge_style || "gold",
                is_published: editingSection.is_published,
              }
            : undefined
        }
      />
    </div>
  );
}
