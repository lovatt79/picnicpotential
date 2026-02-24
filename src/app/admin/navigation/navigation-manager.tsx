"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import type { NavigationItem } from "@/lib/supabase/types";

// ─── Sortable Nav Item ──────────────────────────────────────

function SortableNavItem({
  item,
  isChild,
  canIndent,
  onEdit,
  onDelete,
  onTogglePublished,
  onIndent,
  onOutdent,
}: {
  item: NavigationItem;
  isChild: boolean;
  canIndent: boolean;
  onEdit: (item: NavigationItem) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (item: NavigationItem) => void;
  onIndent: (item: NavigationItem) => void;
  onOutdent: (item: NavigationItem) => void;
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
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3 ${isChild ? "ml-8" : ""}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-charcoal shrink-0 transition-colors"
        aria-label="Drag to reorder"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Label & href */}
      <div className="flex-1 min-w-0">
        <span className="font-medium text-charcoal text-sm">{item.label}</span>
        <span className="ml-2 text-xs text-warm-gray">{item.href}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Indent button - only for top-level items that can be indented */}
        {!isChild && canIndent && (
          <button
            onClick={() => onIndent(item)}
            className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
            title="Indent (make sub-item)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}

        {/* Outdent button - only for child items */}
        {isChild && (
          <button
            onClick={() => onOutdent(item)}
            className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
            title="Outdent (make top-level)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
          </button>
        )}

        {/* Edit button */}
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        {/* Published toggle */}
        <button
          onClick={() => onTogglePublished(item)}
          className={`p-1.5 transition-colors ${item.is_published ? "text-gold hover:text-gray-400" : "text-gray-300 hover:text-gold"}`}
          title={item.is_published ? "Published (click to hide)" : "Hidden (click to publish)"}
        >
          {item.is_published ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Drag Overlay Item ──────────────────────────────────────

function DragOverlayItem({ item }: { item: NavigationItem }) {
  return (
    <div className="bg-white rounded-xl border-2 border-gold p-3 flex items-center gap-3 shadow-lg">
      <div className="text-gold shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-medium text-charcoal text-sm">{item.label}</span>
        <span className="ml-2 text-xs text-warm-gray">{item.href}</span>
      </div>
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────

function NavItemModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { label: string; href: string; openInNewTab: boolean }) => void;
  initialData: { label: string; href: string; openInNewTab: boolean };
  isEditing: boolean;
}) {
  const [label, setLabel] = useState(initialData.label);
  const [href, setHref] = useState(initialData.href);
  const [openInNewTab, setOpenInNewTab] = useState(initialData.openInNewTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="font-serif text-xl text-charcoal">
          {isEditing ? "Edit Navigation Item" : "Add Navigation Item"}
        </h3>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="e.g. About Us"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">URL</label>
          <input
            type="text"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="e.g. /about or https://example.com"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={openInNewTab}
            onChange={(e) => setOpenInNewTab(e.target.checked)}
            className="rounded text-gold focus:ring-gold"
          />
          <span className="text-charcoal">Open in new tab</span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!label.trim() || !href.trim()) return;
              onSave({ label: label.trim(), href: href.trim(), openInNewTab });
            }}
            disabled={!label.trim() || !href.trim()}
            className="px-4 py-2 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-40"
          >
            {isEditing ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────

export default function NavigationManager({
  initialItems,
}: {
  initialItems: NavigationItem[];
}) {
  const [items, setItems] = useState<NavigationItem[]>(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [modalData, setModalData] = useState({ label: "", href: "", openInNewTab: false });
  const [activeId, setActiveId] = useState<string | null>(null);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ─── Derived data ────────────────────────────────────────

  const topLevelItems = items
    .filter((i) => i.parent_id === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  const getChildren = useCallback(
    (parentId: string) =>
      items
        .filter((i) => i.parent_id === parentId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [items]
  );

  // ─── Drag handlers ──────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeItem = items.find((i) => i.id === active.id);
    const overItem = items.find((i) => i.id === over.id);
    if (!activeItem || !overItem) return;

    // Only reorder within same level (same parent_id)
    if (activeItem.parent_id !== overItem.parent_id) return;

    const parentId = activeItem.parent_id;
    const siblings = parentId === null
      ? topLevelItems
      : getChildren(parentId);

    const oldIndex = siblings.findIndex((i) => i.id === active.id);
    const newIndex = siblings.findIndex((i) => i.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(siblings, oldIndex, newIndex);

    // Update local state
    setItems((prev) => {
      const otherItems = prev.filter((i) => i.parent_id !== parentId);
      return [...otherItems, ...reordered.map((item, i) => ({ ...item, sort_order: i }))];
    });

    // Persist to DB
    for (let i = 0; i < reordered.length; i++) {
      await supabase
        .from("navigation_items")
        .update({ sort_order: i, updated_at: new Date().toISOString() })
        .eq("id", reordered[i].id);
    }
  };

  // ─── Indent / Outdent ────────────────────────────────────

  const handleIndent = async (item: NavigationItem) => {
    // Find the top-level item just above this one
    const index = topLevelItems.findIndex((i) => i.id === item.id);
    if (index <= 0) return;
    const newParent = topLevelItems[index - 1];

    // Get existing children to determine sort order
    const existingChildren = getChildren(newParent.id);
    const newSortOrder = existingChildren.length > 0
      ? Math.max(...existingChildren.map((c) => c.sort_order)) + 1
      : 0;

    const updated = { ...item, parent_id: newParent.id, sort_order: newSortOrder };

    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));

    await supabase
      .from("navigation_items")
      .update({ parent_id: newParent.id, sort_order: newSortOrder, updated_at: new Date().toISOString() })
      .eq("id", item.id);

    // Re-order remaining top-level items
    const remainingTopLevel = items
      .filter((i) => i.parent_id === null && i.id !== item.id)
      .sort((a, b) => a.sort_order - b.sort_order);

    for (let i = 0; i < remainingTopLevel.length; i++) {
      if (remainingTopLevel[i].sort_order !== i) {
        await supabase
          .from("navigation_items")
          .update({ sort_order: i, updated_at: new Date().toISOString() })
          .eq("id", remainingTopLevel[i].id);
      }
    }

    setItems((prev) => {
      const updated2 = prev.map((it) => {
        const idx = remainingTopLevel.findIndex((r) => r.id === it.id);
        if (idx !== -1) return { ...it, sort_order: idx };
        return it;
      });
      return updated2;
    });
  };

  const handleOutdent = async (item: NavigationItem) => {
    // Append to end of top-level items
    const maxSortOrder = topLevelItems.length > 0
      ? Math.max(...topLevelItems.map((i) => i.sort_order)) + 1
      : 0;

    const updated = { ...item, parent_id: null, sort_order: maxSortOrder };

    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));

    await supabase
      .from("navigation_items")
      .update({ parent_id: null, sort_order: maxSortOrder, updated_at: new Date().toISOString() })
      .eq("id", item.id);
  };

  // ─── CRUD ────────────────────────────────────────────────

  const handleAdd = () => {
    setEditingItem(null);
    setModalData({ label: "", href: "", openInNewTab: false });
    setShowModal(true);
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingItem(item);
    setModalData({ label: item.label, href: item.href, openInNewTab: item.open_in_new_tab });
    setShowModal(true);
  };

  const handleSave = async (data: { label: string; href: string; openInNewTab: boolean }) => {
    if (editingItem) {
      // Update existing
      const updated = {
        ...editingItem,
        label: data.label,
        href: data.href,
        open_in_new_tab: data.openInNewTab,
      };

      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));

      await supabase
        .from("navigation_items")
        .update({
          label: data.label,
          href: data.href,
          open_in_new_tab: data.openInNewTab,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingItem.id);
    } else {
      // Add new item at end of top-level
      const maxSortOrder = topLevelItems.length > 0
        ? Math.max(...topLevelItems.map((i) => i.sort_order)) + 1
        : 0;

      const { data: newItem, error } = await supabase
        .from("navigation_items")
        .insert({
          label: data.label,
          href: data.href,
          open_in_new_tab: data.openInNewTab,
          sort_order: maxSortOrder,
          is_published: true,
          parent_id: null,
        })
        .select()
        .single();

      if (!error && newItem) {
        setItems((prev) => [...prev, newItem]);
      }
    }

    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this navigation item?")) return;

    const { error } = await supabase.from("navigation_items").delete().eq("id", id);
    if (!error) {
      // Also remove any children
      setItems((prev) => prev.filter((i) => i.id !== id && i.parent_id !== id));
    }
  };

  const handleTogglePublished = async (item: NavigationItem) => {
    const newPublished = !item.is_published;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_published: newPublished } : i))
    );

    await supabase
      .from("navigation_items")
      .update({ is_published: newPublished, updated_at: new Date().toISOString() })
      .eq("id", item.id);
  };

  // ─── Build sortable IDs list ─────────────────────────────

  // All items in render order for DnD context
  const allSortableIds: string[] = [];
  for (const parent of topLevelItems) {
    allSortableIds.push(parent.id);
    const children = getChildren(parent.id);
    for (const child of children) {
      allSortableIds.push(child.id);
    }
  }

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  // ─── Render ──────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-warm-gray">
          {items.length} item{items.length !== 1 ? "s" : ""} total
        </p>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      {/* Navigation items list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={allSortableIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {topLevelItems.map((item, index) => (
              <div key={item.id}>
                <SortableNavItem
                  item={item}
                  isChild={false}
                  canIndent={index > 0}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePublished={handleTogglePublished}
                  onIndent={handleIndent}
                  onOutdent={handleOutdent}
                />
                {/* Children */}
                {getChildren(item.id).map((child) => (
                  <div key={child.id} className="mt-2">
                    <SortableNavItem
                      item={child}
                      isChild={true}
                      canIndent={false}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePublished={handleTogglePublished}
                      onIndent={handleIndent}
                      onOutdent={handleOutdent}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? <DragOverlayItem item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <h3 className="font-serif text-xl text-charcoal mb-2">No navigation items</h3>
          <p className="text-warm-gray mb-6">Add your first menu item to get started.</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
          >
            Add Navigation Item
          </button>
        </div>
      )}

      {/* Modal */}
      <NavItemModal
        key={editingItem?.id || "new"}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        initialData={modalData}
        isEditing={!!editingItem}
      />
    </div>
  );
}
