"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { BuilderContainer, BuilderColumn, BuilderElement, ColumnLayout } from "@/lib/builder-types";
import ColumnLayoutPicker from "./ColumnLayoutPicker";
import ColumnDropZone from "./ColumnDropZone";
import { ElementCardOverlay } from "./ElementCard";

interface ContainerBlockProps {
  container: BuilderContainer;
  onUpdate: (container: BuilderContainer) => void;
  onDelete: () => void;
}

const columnGridClass: Record<ColumnLayout, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default function ContainerBlock({
  container,
  onUpdate,
  onDelete,
}: ContainerBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: container.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleLayoutChange = (layout: ColumnLayout) => {
    const currentColumns = container.columns;
    let newColumns: BuilderColumn[];

    if (layout > currentColumns.length) {
      // Add new empty columns
      newColumns = [...currentColumns];
      for (let i = currentColumns.length; i < layout; i++) {
        newColumns.push({ id: crypto.randomUUID(), elements: [] });
      }
    } else if (layout < currentColumns.length) {
      // Move elements from removed columns into the last kept column
      const keptColumns = currentColumns.slice(0, layout);
      const removedColumns = currentColumns.slice(layout);
      const orphanedElements = removedColumns.flatMap((col) => col.elements);

      if (orphanedElements.length > 0 && keptColumns.length > 0) {
        keptColumns[keptColumns.length - 1] = {
          ...keptColumns[keptColumns.length - 1],
          elements: [
            ...keptColumns[keptColumns.length - 1].elements,
            ...orphanedElements,
          ],
        };
      }
      newColumns = keptColumns;
    } else {
      newColumns = currentColumns;
    }

    onUpdate({ ...container, columnLayout: layout, columns: newColumns });
  };

  const handleUpdateColumnElements = (columnIndex: number, elements: BuilderElement[]) => {
    const newColumns = container.columns.map((col, i) =>
      i === columnIndex ? { ...col, elements } : col
    );
    onUpdate({ ...container, columns: newColumns });
  };

  const handleLabelChange = (label: string) => {
    onUpdate({ ...container, label });
  };

  // ─── Element DnD ────────────────────────────────────────
  const [activeElement, setActiveElement] = useState<BuilderElement | null>(null);

  const elementSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findColumnForElement = (elementId: string): number => {
    return container.columns.findIndex((col) =>
      col.elements.some((el) => el.id === elementId)
    );
  };

  const handleElementDragStart = (event: DragStartEvent) => {
    const elementId = event.active.id as string;
    for (const col of container.columns) {
      const el = col.elements.find((e) => e.id === elementId);
      if (el) {
        setActiveElement(el);
        break;
      }
    }
  };

  const handleElementDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColIndex = findColumnForElement(activeId);
    if (activeColIndex === -1) return;

    // Determine target column
    let targetColIndex = container.columns.findIndex((col) => col.id === overId);
    if (targetColIndex === -1) {
      targetColIndex = findColumnForElement(overId);
    }
    if (targetColIndex === -1 || activeColIndex === targetColIndex) return;

    // Move element to different column
    const element = container.columns[activeColIndex].elements.find(
      (el) => el.id === activeId
    );
    if (!element) return;

    const newColumns = container.columns.map((col, i) => {
      if (i === activeColIndex) {
        return { ...col, elements: col.elements.filter((el) => el.id !== activeId) };
      }
      if (i === targetColIndex) {
        return { ...col, elements: [...col.elements, element] };
      }
      return col;
    });
    onUpdate({ ...container, columns: newColumns });
  };

  const handleElementDragEnd = (event: DragEndEvent) => {
    setActiveElement(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const colIndex = findColumnForElement(activeId);
    if (colIndex === -1) return;

    // Skip if dropped on a column (not an element)
    if (container.columns.some((col) => col.id === overId)) return;

    // Reorder within same column
    const col = container.columns[colIndex];
    const oldIndex = col.elements.findIndex((el) => el.id === activeId);
    const newIndex = col.elements.findIndex((el) => el.id === overId);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reordered = arrayMove(col.elements, oldIndex, newIndex);
      const newColumns = container.columns.map((c, i) =>
        i === colIndex ? { ...c, elements: reordered } : c
      );
      onUpdate({ ...container, columns: newColumns });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      {/* Container header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Label */}
        <input
          type="text"
          value={container.label || ""}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="Container label (optional)"
          className="flex-1 text-sm text-charcoal bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300"
        />

        {/* Layout picker */}
        <ColumnLayoutPicker
          value={container.columnLayout}
          onChange={handleLayoutChange}
        />

        {/* Delete */}
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors shrink-0"
          title="Delete container"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Columns grid with element-level DnD */}
      <DndContext
        sensors={elementSensors}
        collisionDetection={closestCenter}
        onDragStart={handleElementDragStart}
        onDragOver={handleElementDragOver}
        onDragEnd={handleElementDragEnd}
      >
        <div className={`grid ${columnGridClass[container.columnLayout]} gap-3 p-4`}>
          {container.columns.map((column, colIndex) => (
            <ColumnDropZone
              key={column.id}
              column={column}
              columnIndex={colIndex}
              onUpdateElements={(elements) =>
                handleUpdateColumnElements(colIndex, elements)
              }
            />
          ))}
        </div>

        <DragOverlay>
          {activeElement ? <ElementCardOverlay element={activeElement} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Drag overlay version
export function ContainerBlockOverlay({ container }: { container: BuilderContainer }) {
  const elementCount = container.columns.reduce(
    (total, col) => total + col.elements.length,
    0
  );

  return (
    <div className="bg-white rounded-xl border-2 border-gold p-4 shadow-xl flex items-center gap-3">
      <div className="text-gold">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <div>
        <span className="text-sm font-medium text-charcoal">
          {container.label || "Container"}
        </span>
        <span className="text-xs text-gray-400 ml-2">
          {container.columnLayout} col{container.columnLayout !== 1 ? "s" : ""}, {elementCount} element{elementCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
