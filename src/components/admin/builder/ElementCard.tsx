"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BuilderElement } from "@/lib/builder-types";

const typeLabels: Record<string, { label: string; color: string }> = {
  title: { label: "Title", color: "bg-blue-100 text-blue-700" },
  text: { label: "Text", color: "bg-green-100 text-green-700" },
  image: { label: "Image", color: "bg-purple-100 text-purple-700" },
  code: { label: "Code", color: "bg-orange-100 text-orange-700" },
};

function getPreview(element: BuilderElement): string {
  switch (element.type) {
    case "title":
      return element.text || "Untitled";
    case "text":
      return element.text.substring(0, 80) + (element.text.length > 80 ? "..." : "");
    case "image":
      return element.alt || "Image";
    case "code":
      return element.code.substring(0, 60) + (element.code.length > 60 ? "..." : "");
  }
}

export default function ElementCard({
  element,
  onEdit,
  onDelete,
}: {
  element: BuilderElement;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const { label, color } = typeLabels[element.type] || { label: element.type, color: "bg-gray-100 text-gray-700" };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 p-2.5 flex items-center gap-2"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Type badge */}
      <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded shrink-0 ${color}`}>
        {label}
      </span>

      {/* Preview with thumbnail for images */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {element.type === "image" && element.image_url && (
          <img
            src={element.image_url}
            alt=""
            className="w-8 h-8 object-cover rounded shrink-0"
          />
        )}
        <span className="text-xs text-gray-600 truncate">{getPreview(element)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={onEdit}
          className="p-1 text-gray-400 hover:text-charcoal transition-colors"
          title="Edit"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Used by DragOverlay
export function ElementCardOverlay({ element }: { element: BuilderElement }) {
  const { label, color } = typeLabels[element.type] || { label: element.type, color: "bg-gray-100 text-gray-700" };

  return (
    <div className="bg-white rounded-lg border-2 border-gold p-2.5 flex items-center gap-2 shadow-lg">
      <div className="text-gold shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded shrink-0 ${color}`}>
        {label}
      </span>
      <span className="text-xs text-gray-600 truncate">{getPreview(element)}</span>
    </div>
  );
}
