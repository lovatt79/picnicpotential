"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "./useAutosave";
import SortableRow, { DragOverlayRow } from "./SortableRow";
import type { SortableOptionsTableProps, OptionItem, ColumnDef } from "./types";

export default function SortableOptionsTable({
  tableName,
  title,
  subtitle,
  columns,
  addButtonLabel,
  addFormTitle,
  deleteConfirmMessage,
  backLink = "/admin/form-options",
}: SortableOptionsTableProps) {
  const supabase = createClient();
  const [items, setItems] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { saveField, saveImmediate, flushAll, saveStatus } =
    useAutosave(tableName);

  // Build default values for new form from column defs
  const buildDefaults = useCallback(() => {
    const defaults: Record<string, any> = {
      is_active: true,
    };
    for (const col of columns) {
      if (col.defaultValue !== undefined) {
        defaults[col.key] = col.defaultValue;
      } else if (col.type === "toggle") {
        defaults[col.key] = false;
      } else if (col.type === "number") {
        defaults[col.key] = col.nullable ? null : 0;
      } else if (col.type === "select" && col.options?.length) {
        defaults[col.key] = col.options[0].value;
      } else {
        defaults[col.key] = "";
      }
    }
    return defaults;
  }, [columns]);

  const [newForm, setNewForm] = useState<Record<string, any>>(buildDefaults);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data } = await supabase
      .from(tableName)
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data || []) as OptionItem[]);
    setLoading(false);
  }

  // ─── Field change handler ────────────────────────────────

  const handleFieldChange = useCallback(
    (itemId: string, key: string, value: any, immediate = false) => {
      // Update local state immediately (optimistic)
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, [key]: value } : item
        )
      );
      // Schedule or immediately save
      if (immediate) {
        saveImmediate(itemId, { [key]: value });
      } else {
        saveField(itemId, { [key]: value });
      }
    },
    [saveField, saveImmediate]
  );

  // ─── DnD handlers ────────────────────────────────────────

  const handleDragStart = async (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    await flushAll();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);

    // Update local state with new sort_order values
    const updated = reordered.map((item, i) => ({ ...item, sort_order: i }));
    setItems(updated);

    // Persist to DB
    for (let i = 0; i < updated.length; i++) {
      await supabase
        .from(tableName)
        .update({ sort_order: i })
        .eq("id", updated[i].id);
    }
  };

  // ─── CRUD ─────────────────────────────────────────────────

  async function handleCreate() {
    const payload: Record<string, any> = {
      ...newForm,
      sort_order: items.length,
    };

    // Convert empty strings to null for nullable fields
    for (const col of columns) {
      if (col.nullable && payload[col.key] === "") {
        payload[col.key] = null;
      }
    }

    await supabase.from(tableName).insert(payload);
    setNewForm(buildDefaults());
    setShowNewForm(false);
    loadItems();
  }

  async function handleDelete(id: string) {
    if (!confirm(deleteConfirmMessage || "Delete this item?")) return;
    await supabase.from(tableName).delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // ─── Helpers ──────────────────────────────────────────────

  const isCreateDisabled = columns
    .filter((c) => c.required)
    .some((c) => !newForm[c.key]);

  const activeItem = activeId
    ? items.find((i) => i.id === activeId) || null
    : null;

  // ─── Render ───────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href={backLink}
          className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Form Options
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">{title}</h1>
        <p className="text-warm-gray mt-1">{subtitle}</p>
      </div>

      {/* Add New Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          {showNewForm ? "Cancel" : addButtonLabel}
        </button>
      </div>

      {/* New Form */}
      {showNewForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-medium text-charcoal mb-4">{addFormTitle}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {columns
              .filter((col) => col.type !== "toggle")
              .map((col) => (
                <NewFormField
                  key={col.key}
                  col={col}
                  value={newForm[col.key]}
                  onChange={(v) =>
                    setNewForm((prev) => ({ ...prev, [col.key]: v }))
                  }
                />
              ))}
          </div>
          <div className="mt-4 flex items-center gap-6">
            <label className="flex items-center gap-3">
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newForm.is_active ?? true}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
              </div>
              <span className="text-sm text-charcoal">Active</span>
            </label>
            {columns
              .filter((col) => col.type === "toggle")
              .map((col) => (
                <label key={col.key} className="flex items-center gap-3">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!newForm[col.key]}
                      onChange={(e) =>
                        setNewForm((prev) => ({
                          ...prev,
                          [col.key]: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        col.toggleColor
                          ? `peer-checked:${col.toggleColor}`
                          : "peer-checked:bg-sage"
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm text-charcoal">{col.header}</span>
                </label>
              ))}
          </div>
          <div className="mt-4">
            <button
              onClick={handleCreate}
              disabled={isCreateDisabled}
              className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Column Headers */}
      <div className="mb-2">
        <div className="flex items-center gap-2 px-3 py-1">
          <div className="shrink-0 w-4" /> {/* drag handle spacer */}
          {columns.map((col) => (
            <div
              key={col.key}
              className={
                col.key === "label"
                  ? "flex-1 min-w-0"
                  : col.type === "toggle"
                  ? `shrink-0 ${col.width || "w-16"}`
                  : `shrink-0 ${col.width || (col.type === "select" ? "w-28" : col.type === "number" ? "w-20" : "w-32")}`
              }
            >
              <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">
                {col.header}
              </span>
            </div>
          ))}
          <div className="shrink-0 w-16">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">
              Active
            </span>
          </div>
          <div className="shrink-0 w-6" /> {/* status spacer */}
          <div className="shrink-0 w-4" /> {/* delete spacer */}
        </div>
      </div>

      {/* Sortable List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {items.map((item) => (
              <SortableRow
                key={item.id}
                item={item}
                columns={columns}
                onFieldChange={handleFieldChange}
                onDelete={handleDelete}
                saveStatus={saveStatus.get(item.id) || "idle"}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? <DragOverlayRow item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm mt-4">
          <p className="text-warm-gray">
            No items yet. Click &ldquo;{addButtonLabel}&rdquo; to add one.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── New Form Field ──────────────────────────────────────────

function NewFormField({
  col,
  value,
  onChange,
}: {
  col: ColumnDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const inputClass =
    "w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold";

  if (col.type === "select") {
    return (
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          {col.header}
        </label>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {col.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (col.type === "number") {
    return (
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          {col.header}
          {col.required && " *"}
        </label>
        <input
          type="number"
          step={col.step || "1"}
          value={col.nullable ? (value ?? "") : (value ?? 0)}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" && col.nullable) {
              onChange(null);
            } else {
              onChange(col.step === "0.01" ? parseFloat(v) : parseInt(v));
            }
          }}
          placeholder={col.placeholder}
          className={inputClass}
        />
      </div>
    );
  }

  // text
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1">
        {col.header}
        {col.required && " *"}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={col.placeholder}
        className={inputClass}
      />
    </div>
  );
}
