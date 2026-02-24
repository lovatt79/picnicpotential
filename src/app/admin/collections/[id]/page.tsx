"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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
import type { CollectionSection } from "@/lib/supabase/types";

interface ServiceOption {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
}

interface PartnerOption {
  id: string;
  name: string;
  category: string;
  is_published: boolean;
}

interface AssignedItem {
  item_type: "service" | "partner";
  service_id: string | null;
  partner_id: string | null;
  custom_title: string;
  custom_description: string;
  is_coming_soon: boolean;
  sort_order: number;
  section_id: string | null;
  display_name: string;
  display_detail: string;
}

// ─── Sortable Collection Item ──────────────────────────────

function SortableCollectionItem({
  item,
  onRemove,
  onToggleComingSoon,
}: {
  item: AssignedItem;
  onRemove: () => void;
  onToggleComingSoon: () => void;
}) {
  const itemId = `${item.item_type}-${item.service_id || item.partner_id}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

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
          <h3 className="font-medium text-charcoal truncate text-sm">{item.display_name}</h3>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded shrink-0 ${
              item.item_type === "partner"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {item.item_type === "partner" ? "Partner" : "Service"}
          </span>
          {item.is_coming_soon && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-gold/20 text-gold-dark shrink-0">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-xs text-warm-gray truncate mt-0.5">
          {item.item_type === "service"
            ? `/services/${item.display_detail}`
            : item.display_detail}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggleComingSoon}
          className={`p-1.5 transition-colors ${
            item.is_coming_soon
              ? "text-gold hover:text-gold-dark"
              : "text-gray-400 hover:text-charcoal"
          }`}
          title={item.is_coming_soon ? "Remove Coming Soon" : "Mark Coming Soon"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Drag Overlay Item ──────────────────────────────────────

function DragOverlayItem({ item }: { item: AssignedItem }) {
  return (
    <div className="bg-white rounded-lg border-2 border-gold p-3 flex items-center gap-3 shadow-lg">
      <div className="text-gold shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-charcoal truncate text-sm">{item.display_name}</h3>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded shrink-0 ${
              item.item_type === "partner"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {item.item_type === "partner" ? "Partner" : "Service"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Droppable Section Container ────────────────────────────

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

// ─── Section Modal ──────────────────────────────────────────

function SectionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; is_published: boolean }) => void;
  initialData?: { title: string; description: string; is_published: boolean };
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
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
          <label className="block text-sm font-medium text-charcoal mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="e.g. Picnic Services"
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

// ─── Main Component ─────────────────────────────────────────

export default function EditCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Collection fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [heroImageId, setHeroImageId] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Sections
  const [sections, setSections] = useState<CollectionSection[]>([]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<CollectionSection | null>(null);

  // Items
  const [allServices, setAllServices] = useState<ServiceOption[]>([]);
  const [allPartners, setAllPartners] = useState<PartnerOption[]>([]);
  const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([]);
  const [pickerTab, setPickerTab] = useState<"services" | "partners">("services");

  // DnD state
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadData = useCallback(async () => {
    setLoading(true);

    // Load collection
    const { data: collection, error: collError } = await supabase
      .from("collection_pages")
      .select("*")
      .eq("id", params.id)
      .single();

    if (collError || !collection) {
      router.push("/admin/collections");
      return;
    }

    setTitle(collection.title);
    setSlug(collection.slug);
    setDescription(collection.description || "");
    setHeroSubtitle(collection.hero_subtitle || "");
    setMetaDescription(collection.meta_description || "");
    setIsPublished(collection.is_published);
    setSortOrder(collection.sort_order || 0);
    setHeroImageId(collection.hero_image_id || null);

    // Load hero image URL
    if (collection.hero_image_id) {
      const { data: imgData } = await supabase
        .from("media")
        .select("url")
        .eq("id", collection.hero_image_id)
        .single();
      if (imgData) setHeroImageUrl(imgData.url);
    }

    // Load sections for this collection
    const { data: sectionData } = await supabase
      .from("collection_sections")
      .select("*")
      .eq("collection_page_id", params.id)
      .order("sort_order");
    setSections(sectionData || []);

    // Load ALL services
    const { data: services } = await supabase
      .from("services")
      .select("id, title, slug, is_published")
      .order("sort_order");
    setAllServices(services || []);

    // Load all published partners
    const { data: partners } = await supabase
      .from("vendor_partners")
      .select("id, name, category, is_published")
      .eq("is_published", true)
      .order("sort_order");
    setAllPartners(partners || []);

    // Load assigned items with joins
    const { data: items } = await supabase
      .from("collection_page_items")
      .select("*, service:services(id, title, slug, is_published), partner:vendor_partners(id, name, category)")
      .eq("collection_page_id", params.id)
      .order("sort_order");

    if (items) {
      setAssignedItems(
        items.map((item: {
          item_type: string;
          service_id: string | null;
          partner_id: string | null;
          custom_title: string | null;
          custom_description: string | null;
          is_coming_soon: boolean;
          sort_order: number;
          section_id: string | null;
          service: { id: string; title: string; slug: string; is_published: boolean } | null;
          partner: { id: string; name: string; category: string } | null;
        }) => ({
          item_type: (item.item_type || "service") as "service" | "partner",
          service_id: item.service_id,
          partner_id: item.partner_id,
          custom_title: item.custom_title || "",
          custom_description: item.custom_description || "",
          is_coming_soon: item.is_coming_soon,
          sort_order: item.sort_order,
          section_id: item.section_id || null,
          display_name: item.item_type === "partner"
            ? item.partner?.name || "Unknown Partner"
            : item.service?.title || "Unknown Service",
          display_detail: item.item_type === "partner"
            ? item.partner?.category || ""
            : item.service?.slug || "",
        }))
      );
    }

    setLoading(false);
  }, [params.id, router, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Item helpers ──────────────────────────────────────

  const getItemId = (item: AssignedItem) =>
    `${item.item_type}-${item.service_id || item.partner_id}`;

  const getItemsForSection = useCallback(
    (sectionId: string | null) =>
      assignedItems
        .filter((item) => item.section_id === sectionId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [assignedItems]
  );

  const findSectionForItem = useCallback(
    (itemId: string) => {
      const item = assignedItems.find((i) => getItemId(i) === itemId);
      return item?.section_id ?? null;
    },
    [assignedItems]
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

    // Determine target section
    let targetSectionId: string | null;
    const isOverSection = overId === "uncategorized" || sections.some((s) => s.id === overId);
    if (isOverSection) {
      targetSectionId = overId === "uncategorized" ? null : overId;
    } else {
      targetSectionId = findSectionForItem(overId);
    }

    const currentSectionId = findSectionForItem(activeItemId);

    // Move to different section
    if (currentSectionId !== targetSectionId) {
      setAssignedItems((prev) =>
        prev.map((item) =>
          getItemId(item) === activeItemId
            ? { ...item, section_id: targetSectionId }
            : item
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeItemId = active.id as string;
    const overId = over.id as string;
    const activeItem = assignedItems.find((i) => getItemId(i) === activeItemId);
    if (!activeItem) return;

    const currentSectionId = activeItem.section_id;

    // Handle reordering within the same section
    const isOverSection = overId === "uncategorized" || sections.some((s) => s.id === overId);
    if (!isOverSection && active.id !== over.id) {
      const sectionItems = getItemsForSection(currentSectionId);
      const oldIndex = sectionItems.findIndex((i) => getItemId(i) === activeItemId);
      const newIndex = sectionItems.findIndex((i) => getItemId(i) === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(sectionItems, oldIndex, newIndex);
        setAssignedItems((prev) => {
          const otherItems = prev.filter((i) => i.section_id !== currentSectionId);
          return [...otherItems, ...reordered.map((i, idx) => ({ ...i, sort_order: idx }))];
        });
      }
    }
  };

  // ─── Item CRUD ────────────────────────────────────────

  const toggleService = (service: ServiceOption) => {
    const isAssigned = assignedItems.some(
      (s) => s.item_type === "service" && s.service_id === service.id
    );
    if (isAssigned) {
      setAssignedItems((prev) =>
        prev.filter(
          (s) => !(s.item_type === "service" && s.service_id === service.id)
        )
      );
    } else {
      setAssignedItems((prev) => [
        ...prev,
        {
          item_type: "service",
          service_id: service.id,
          partner_id: null,
          custom_title: "",
          custom_description: "",
          is_coming_soon: !service.is_published,
          sort_order: prev.filter((i) => i.section_id === null).length,
          section_id: null,
          display_name: service.title,
          display_detail: service.slug,
        },
      ]);
    }
  };

  const togglePartner = (partner: PartnerOption) => {
    const isAssigned = assignedItems.some(
      (s) => s.item_type === "partner" && s.partner_id === partner.id
    );
    if (isAssigned) {
      setAssignedItems((prev) =>
        prev.filter(
          (s) => !(s.item_type === "partner" && s.partner_id === partner.id)
        )
      );
    } else {
      setAssignedItems((prev) => [
        ...prev,
        {
          item_type: "partner",
          service_id: null,
          partner_id: partner.id,
          custom_title: "",
          custom_description: "",
          is_coming_soon: false,
          sort_order: prev.filter((i) => i.section_id === null).length,
          section_id: null,
          display_name: partner.name,
          display_detail: partner.category,
        },
      ]);
    }
  };

  const removeItem = (itemId: string) => {
    setAssignedItems((prev) => prev.filter((i) => getItemId(i) !== itemId));
  };

  const toggleComingSoon = (itemId: string) => {
    setAssignedItems((prev) =>
      prev.map((i) =>
        getItemId(i) === itemId ? { ...i, is_coming_soon: !i.is_coming_soon } : i
      )
    );
  };

  // ─── Section CRUD ─────────────────────────────────────

  const handleAddSection = async (data: { title: string; description: string; is_published: boolean }) => {
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.sort_order)) + 1 : 0;
    const { data: newSection, error } = await supabase
      .from("collection_sections")
      .insert({
        collection_page_id: params.id as string,
        title: data.title,
        description: data.description || null,
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

  const handleEditSection = async (data: { title: string; description: string; is_published: boolean }) => {
    if (!editingSection) return;
    const { error } = await supabase
      .from("collection_sections")
      .update({
        title: data.title,
        description: data.description || null,
        is_published: data.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingSection.id);

    if (!error) {
      setSections(sections.map((s) =>
        s.id === editingSection.id ? { ...s, ...data } : s
      ));
    }
    setEditingSection(null);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section? Items in it will become uncategorized.")) return;
    const { error } = await supabase.from("collection_sections").delete().eq("id", sectionId);
    if (!error) {
      setSections(sections.filter((s) => s.id !== sectionId));
      setAssignedItems(
        assignedItems.map((i) => (i.section_id === sectionId ? { ...i, section_id: null } : i))
      );
    }
  };

  const handleMoveSectionUp = async (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    newSections.forEach((s, i) => (s.sort_order = i));
    setSections(newSections);
    for (const s of newSections) {
      await supabase.from("collection_sections").update({ sort_order: s.sort_order }).eq("id", s.id);
    }
  };

  const handleMoveSectionDown = async (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    newSections.forEach((s, i) => (s.sort_order = i));
    setSections(newSections);
    for (const s of newSections) {
      await supabase.from("collection_sections").update({ sort_order: s.sort_order }).eq("id", s.id);
    }
  };

  // ─── Save / Delete ────────────────────────────────────

  const handleImageUpload = (url: string, mediaId: string) => {
    setHeroImageUrl(url);
    setHeroImageId(mediaId || null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    // Update collection_pages
    const { error: updateError } = await supabase
      .from("collection_pages")
      .update({
        title,
        slug,
        description: description || null,
        hero_subtitle: heroSubtitle || null,
        meta_description: metaDescription || null,
        hero_image_id: heroImageId,
        is_published: isPublished,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    // Sync collection_page_items: delete all existing, then insert fresh
    const { error: deleteError } = await supabase
      .from("collection_page_items")
      .delete()
      .eq("collection_page_id", params.id as string);

    if (deleteError) {
      setError("Error syncing items: " + deleteError.message);
      setSaving(false);
      return;
    }

    if (assignedItems.length > 0) {
      // Recalculate sort_order per section
      const itemsBySection = new Map<string | null, AssignedItem[]>();
      for (const item of assignedItems) {
        const key = item.section_id;
        if (!itemsBySection.has(key)) itemsBySection.set(key, []);
        itemsBySection.get(key)!.push(item);
      }

      const itemsToInsert: Array<{
        collection_page_id: string;
        item_type: string;
        service_id: string | null;
        partner_id: string | null;
        custom_title: string | null;
        custom_description: string | null;
        is_coming_soon: boolean;
        sort_order: number;
        section_id: string | null;
      }> = [];

      for (const [sectionId, sectionItems] of itemsBySection) {
        sectionItems
          .sort((a, b) => a.sort_order - b.sort_order)
          .forEach((item, index) => {
            itemsToInsert.push({
              collection_page_id: params.id as string,
              item_type: item.item_type,
              service_id: item.item_type === "service" ? item.service_id : null,
              partner_id: item.item_type === "partner" ? item.partner_id : null,
              custom_title: item.custom_title || null,
              custom_description: item.custom_description || null,
              is_coming_soon: item.is_coming_soon,
              sort_order: index,
              section_id: sectionId || null,
            });
          });
      }

      const { error: insertError } = await supabase
        .from("collection_page_items")
        .insert(itemsToInsert);

      if (insertError) {
        setError("Error saving items: " + insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setSuccessMsg("Collection saved successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this collection? This cannot be undone."
      )
    )
      return;

    const { error: delError } = await supabase
      .from("collection_pages")
      .delete()
      .eq("id", params.id as string);

    if (delError) {
      setError("Error deleting collection: " + delError.message);
    } else {
      router.push("/admin/collections");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  const activeItem = activeId
    ? assignedItems.find((i) => getItemId(i) === activeId)
    : null;
  const uncategorizedItems = getItemsForSection(null);
  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/collections"
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Collections
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-charcoal">
              Edit Collection: {title}
            </h1>
            <p className="text-warm-gray mt-1">
              Manage settings, sections, and assign services & partners
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Site
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMsg}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column: Collection settings + Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-charcoal">Collection Details</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">URL Slug *</label>
              <div className="flex items-center">
                <span className="text-warm-gray text-sm mr-2">/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="Shown below the hero section"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Hero Subtitle</label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="Shown below the title in the hero"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder="SEO description for search engines"
              />
            </div>

            <div>
              <ImageUpload
                label="Hero Image"
                onImageUploaded={handleImageUpload}
                currentImageUrl={heroImageUrl || undefined}
                aspectRatio="21/9"
              />
              <p className="text-xs text-warm-gray mt-1">
                Optional background image for the hero section
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                </label>
                <span className="text-sm text-charcoal">Published</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-charcoal">Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Items with Sections & DnD */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">
                Items ({assignedItems.length})
              </h2>
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

            <p className="text-sm text-warm-gray mb-4">
              Drag items between sections to organize them. Use the panel on the right to add services or partners.
            </p>

            {assignedItems.length === 0 && sections.length === 0 ? (
              <p className="text-warm-gray text-sm py-4">
                No items assigned yet. Use the panel on the right to add
                services or partners, and create sections to organize them.
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-6">
                  {/* Uncategorized Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <h3 className="text-sm font-semibold text-warm-gray uppercase tracking-wide">
                        Uncategorized
                      </h3>
                      <span className="text-xs text-gray-400">({uncategorizedItems.length})</span>
                    </div>
                    <DroppableSection id="uncategorized">
                      <SortableContext
                        items={uncategorizedItems.map((i) => getItemId(i))}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {uncategorizedItems.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-3">
                              Drag items here to uncategorize them
                            </p>
                          ) : (
                            uncategorizedItems.map((item) => (
                              <SortableCollectionItem
                                key={getItemId(item)}
                                item={item}
                                onRemove={() => removeItem(getItemId(item))}
                                onToggleComingSoon={() => toggleComingSoon(getItemId(item))}
                              />
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
                          <h3 className="text-sm font-semibold text-charcoal">
                            {section.title}
                          </h3>
                          {!section.is_published && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                              Draft
                            </span>
                          )}
                          <span className="text-xs text-gray-400">({sectionItems.length})</span>
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
                            items={sectionItems.map((i) => getItemId(i))}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {sectionItems.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-3">
                                  Drag items here to add them to this section
                                </p>
                              ) : (
                                sectionItems.map((item) => (
                                  <SortableCollectionItem
                                    key={getItemId(item)}
                                    item={item}
                                    onRemove={() => removeItem(getItemId(item))}
                                    onToggleComingSoon={() => toggleComingSoon(getItemId(item))}
                                  />
                                ))
                              )}
                            </div>
                          </SortableContext>
                        </DroppableSection>
                      </div>
                    );
                  })}
                </div>

                <DragOverlay>
                  {activeItem ? <DragOverlayItem item={activeItem} /> : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>

        {/* Right column: Picker & actions */}
        <div className="space-y-6">
          {/* Save / Delete actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-charcoal text-white px-6 py-3 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50 font-medium"
            >
              {saving ? "Saving..." : "Save Collection"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full border border-red-300 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Delete Collection
            </button>
          </div>

          {/* Item Picker with Tabs */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Add Items</h2>

            {/* Tab bar */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                type="button"
                onClick={() => setPickerTab("services")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  pickerTab === "services"
                    ? "border-gold text-charcoal"
                    : "border-transparent text-warm-gray hover:text-charcoal"
                }`}
              >
                Services ({allServices.length})
              </button>
              <button
                type="button"
                onClick={() => setPickerTab("partners")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  pickerTab === "partners"
                    ? "border-gold text-charcoal"
                    : "border-transparent text-warm-gray hover:text-charcoal"
                }`}
              >
                Partners ({allPartners.length})
              </button>
            </div>

            {/* Services Tab */}
            {pickerTab === "services" && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allServices.map((service) => {
                  const isAssigned = assignedItems.some(
                    (s) => s.item_type === "service" && s.service_id === service.id
                  );
                  return (
                    <label
                      key={service.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isAssigned
                          ? "bg-sage-light/30 border border-sage/30"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => toggleService(service)}
                        className="rounded border-gray-300 text-gold focus:ring-gold"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {service.title}
                          {!service.is_published && (
                            <span className="ml-2 inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-gray-200 text-gray-600 rounded">
                              Draft
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-warm-gray truncate">/{service.slug}</p>
                      </div>
                    </label>
                  );
                })}
                {allServices.length === 0 && (
                  <p className="text-warm-gray text-sm">No services found.</p>
                )}
              </div>
            )}

            {/* Partners Tab */}
            {pickerTab === "partners" && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allPartners.map((partner) => {
                  const isAssigned = assignedItems.some(
                    (s) => s.item_type === "partner" && s.partner_id === partner.id
                  );
                  return (
                    <label
                      key={partner.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isAssigned
                          ? "bg-purple-50 border border-purple-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => togglePartner(partner)}
                        className="rounded border-gray-300 text-gold focus:ring-gold"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {partner.name}
                        </p>
                        <p className="text-xs text-warm-gray truncate">{partner.category}</p>
                      </div>
                    </label>
                  );
                })}
                {allPartners.length === 0 && (
                  <p className="text-warm-gray text-sm">No published partners found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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
                is_published: editingSection.is_published,
              }
            : undefined
        }
      />
    </div>
  );
}
