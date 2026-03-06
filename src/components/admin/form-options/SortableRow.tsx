"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ColumnDef, OptionItem, SaveStatus } from "./types";

interface SortableRowProps {
  item: OptionItem;
  columns: ColumnDef[];
  onFieldChange: (
    itemId: string,
    key: string,
    value: any,
    immediate?: boolean
  ) => void;
  onDelete: (id: string) => void;
  saveStatus: SaveStatus;
}

export default function SortableRow({
  item,
  columns,
  onFieldChange,
  onDelete,
  saveStatus,
}: SortableRowProps) {
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
      className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 px-3 py-2 hover:border-gray-200 transition-colors"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-charcoal shrink-0 transition-colors touch-none"
        aria-label="Drag to reorder"
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
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>

      {/* Editable cells */}
      {columns.map((col) => {
        const value = item[col.key];

        if (col.type === "toggle") {
          const colorMap: Record<string, string> = {
            "bg-green-500": "#22c55e",
            "bg-amber-500": "#f59e0b",
            "bg-blue-500": "#3b82f6",
            "bg-purple-500": "#a855f7",
            "bg-red-500": "#ef4444",
          };
          const checkedColor = col.toggleColor ? colorMap[col.toggleColor] || "#9caf88" : "#9caf88";
          return (
            <div key={col.key} className={`shrink-0 ${col.width || "w-16"}`}>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) =>
                    onFieldChange(item.id, col.key, e.target.checked, true)
                  }
                  className="sr-only peer"
                />
                <div
                  className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                  style={{ backgroundColor: value ? checkedColor : "#e5e7eb" }}
                ></div>
              </label>
            </div>
          );
        }

        if (col.type === "select") {
          return (
            <div key={col.key} className={`shrink-0 ${col.width || "w-28"}`}>
              <select
                value={value ?? col.defaultValue ?? ""}
                onChange={(e) =>
                  onFieldChange(item.id, col.key, e.target.value, true)
                }
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gold bg-transparent"
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
            <div key={col.key} className={`shrink-0 ${col.width || "w-20"}`}>
              <input
                type="number"
                step={col.step || "1"}
                value={col.nullable ? (value ?? "") : (value ?? 0)}
                onChange={(e) => {
                  const v = e.target.value;
                  const parsed =
                    col.step === "0.01" ? parseFloat(v) : parseInt(v);
                  onFieldChange(
                    item.id,
                    col.key,
                    v === "" && col.nullable ? null : parsed
                  );
                }}
                placeholder={col.placeholder}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          );
        }

        // text
        return (
          <div
            key={col.key}
            className={
              col.key === "label"
                ? "flex-1 min-w-0"
                : `shrink-0 ${col.width || "w-32"}`
            }
          >
            <input
              type="text"
              value={value ?? ""}
              onChange={(e) =>
                onFieldChange(item.id, col.key, e.target.value || null)
              }
              placeholder={col.placeholder}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        );
      })}

      {/* Active toggle */}
      <div className="shrink-0 w-16">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={item.is_active}
            onChange={(e) =>
              onFieldChange(item.id, "is_active", e.target.checked, true)
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sage"></div>
        </label>
      </div>

      {/* Save status */}
      <div className="shrink-0 w-6 flex items-center justify-center">
        {saveStatus === "saving" && (
          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gold" />
        )}
        {saveStatus === "saved" && (
          <svg
            className="w-3.5 h-3.5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {saveStatus === "error" && (
          <svg
            className="w-3.5 h-3.5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(item.id)}
        className="shrink-0 p-1 text-gray-300 hover:text-red-600 transition-colors"
        title="Delete"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

// Overlay shown during drag
export function DragOverlayRow({ item }: { item: OptionItem }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-lg border-2 border-gold px-3 py-2 shadow-lg">
      <div className="text-gold shrink-0">
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
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>
      <span className="text-sm font-medium text-charcoal truncate">
        {item.label}
      </span>
    </div>
  );
}
