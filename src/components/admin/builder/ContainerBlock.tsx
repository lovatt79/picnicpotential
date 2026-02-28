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
import type {
  BuilderContainer,
  BuilderRow,
  BuilderColumn,
  BuilderElement,
  ColumnLayout,
  ContainerBgColor,
} from "@/lib/builder-types";
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

const BG_COLORS: { value: ContainerBgColor; label: string; preview: string }[] = [
  { value: "", label: "None", preview: "bg-white border border-gray-200" },
  { value: "white", label: "White", preview: "bg-white border border-gray-200" },
  { value: "sage", label: "Sage", preview: "bg-sage" },
  { value: "sage-light", label: "Sage Light", preview: "bg-sage-light/30" },
  { value: "charcoal", label: "Charcoal", preview: "bg-charcoal" },
  { value: "gold-light", label: "Gold Light", preview: "bg-gold-light" },
];

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

  // ─── Row helpers ─────────────────────────────────────────

  const updateRow = (rowIndex: number, updatedRow: BuilderRow) => {
    const newRows = container.rows.map((r, i) => (i === rowIndex ? updatedRow : r));
    onUpdate({ ...container, rows: newRows });
  };

  const handleRowLayoutChange = (rowIndex: number, layout: ColumnLayout) => {
    const row = container.rows[rowIndex];
    const currentColumns = row.columns;
    let newColumns: BuilderColumn[];

    if (layout > currentColumns.length) {
      newColumns = [...currentColumns];
      for (let i = currentColumns.length; i < layout; i++) {
        newColumns.push({ id: crypto.randomUUID(), elements: [] });
      }
    } else if (layout < currentColumns.length) {
      const keptColumns = currentColumns.slice(0, layout);
      const removedColumns = currentColumns.slice(layout);
      const orphanedElements = removedColumns.flatMap((col) => col.elements);
      if (orphanedElements.length > 0 && keptColumns.length > 0) {
        keptColumns[keptColumns.length - 1] = {
          ...keptColumns[keptColumns.length - 1],
          elements: [...keptColumns[keptColumns.length - 1].elements, ...orphanedElements],
        };
      }
      newColumns = keptColumns;
    } else {
      newColumns = currentColumns;
    }

    updateRow(rowIndex, { ...row, columnLayout: layout, columns: newColumns });
  };

  const handleUpdateRowColumnElements = (
    rowIndex: number,
    columnIndex: number,
    elements: BuilderElement[]
  ) => {
    const row = container.rows[rowIndex];
    const newColumns = row.columns.map((col, i) =>
      i === columnIndex ? { ...col, elements } : col
    );
    updateRow(rowIndex, { ...row, columns: newColumns });
  };

  const handleAddRow = () => {
    const newRow: BuilderRow = {
      id: crypto.randomUUID(),
      columnLayout: 1,
      columns: [{ id: crypto.randomUUID(), elements: [] }],
    };
    onUpdate({ ...container, rows: [...container.rows, newRow] });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (container.rows.length <= 1) return;
    onUpdate({ ...container, rows: container.rows.filter((_, i) => i !== rowIndex) });
  };

  const handleLabelChange = (label: string) => {
    onUpdate({ ...container, label });
  };

  const handleBgColorChange = (bgColor: ContainerBgColor) => {
    onUpdate({ ...container, bgColor });
  };

  // ─── Element DnD (scoped per row) ─────────────────────
  const [activeElement, setActiveElement] = useState<BuilderElement | null>(null);

  const elementSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // These helpers work across all rows in the container
  const findColumnForElement = (elementId: string): { rowIndex: number; colIndex: number } | null => {
    for (let ri = 0; ri < container.rows.length; ri++) {
      for (let ci = 0; ci < container.rows[ri].columns.length; ci++) {
        if (container.rows[ri].columns[ci].elements.some((el) => el.id === elementId)) {
          return { rowIndex: ri, colIndex: ci };
        }
      }
    }
    return null;
  };

  const findColumnById = (columnId: string): { rowIndex: number; colIndex: number } | null => {
    for (let ri = 0; ri < container.rows.length; ri++) {
      const ci = container.rows[ri].columns.findIndex((col) => col.id === columnId);
      if (ci !== -1) return { rowIndex: ri, colIndex: ci };
    }
    return null;
  };

  const handleElementDragStart = (event: DragStartEvent) => {
    const elementId = event.active.id as string;
    for (const row of container.rows) {
      for (const col of row.columns) {
        const el = col.elements.find((e) => e.id === elementId);
        if (el) {
          setActiveElement(el);
          return;
        }
      }
    }
  };

  const handleElementDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activePos = findColumnForElement(activeId);
    if (!activePos) return;

    // Determine target column
    let targetPos = findColumnById(overId);
    if (!targetPos) {
      targetPos = findColumnForElement(overId);
    }
    if (!targetPos) return;
    if (activePos.rowIndex === targetPos.rowIndex && activePos.colIndex === targetPos.colIndex) return;

    // Move element to different column (possibly different row)
    const element = container.rows[activePos.rowIndex].columns[activePos.colIndex].elements.find(
      (el) => el.id === activeId
    );
    if (!element) return;

    const newRows = container.rows.map((row, ri) => ({
      ...row,
      columns: row.columns.map((col, ci) => {
        if (ri === activePos.rowIndex && ci === activePos.colIndex) {
          return { ...col, elements: col.elements.filter((el) => el.id !== activeId) };
        }
        if (ri === targetPos!.rowIndex && ci === targetPos!.colIndex) {
          return { ...col, elements: [...col.elements, element] };
        }
        return col;
      }),
    }));
    onUpdate({ ...container, rows: newRows });
  };

  const handleElementDragEnd = (event: DragEndEvent) => {
    setActiveElement(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activePos = findColumnForElement(activeId);
    if (!activePos) return;

    // Skip if dropped on a column (not an element)
    if (findColumnById(overId)) return;

    // Reorder within same column
    const col = container.rows[activePos.rowIndex].columns[activePos.colIndex];
    const oldIndex = col.elements.findIndex((el) => el.id === activeId);
    const newIndex = col.elements.findIndex((el) => el.id === overId);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reordered = arrayMove(col.elements, oldIndex, newIndex);
      const newRows = container.rows.map((row, ri) => ({
        ...row,
        columns: row.columns.map((c, ci) =>
          ri === activePos.rowIndex && ci === activePos.colIndex
            ? { ...c, elements: reordered }
            : c
        ),
      }));
      onUpdate({ ...container, rows: newRows });
    }
  };

  const [showBgPicker, setShowBgPicker] = useState(false);

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

        {/* Background color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowBgPicker(!showBgPicker)}
            title="Background Color"
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-500 hover:text-charcoal rounded transition-colors"
          >
            <span
              className={`w-4 h-4 rounded border border-gray-300 ${
                BG_COLORS.find((c) => c.value === (container.bgColor || ""))?.preview || ""
              }`}
            />
            <span className="hidden sm:inline">BG</span>
          </button>
          {showBgPicker && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 flex gap-1.5">
              {BG_COLORS.map((c) => (
                <button
                  key={c.value || "none"}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    handleBgColorChange(c.value);
                    setShowBgPicker(false);
                  }}
                  className={`w-7 h-7 rounded border-2 transition-transform hover:scale-110 ${c.preview} ${
                    (container.bgColor || "") === c.value ? "border-charcoal scale-110" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

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

      {/* Rows with element-level DnD */}
      <DndContext
        sensors={elementSensors}
        collisionDetection={closestCenter}
        onDragStart={handleElementDragStart}
        onDragOver={handleElementDragOver}
        onDragEnd={handleElementDragEnd}
      >
        <div className="divide-y divide-gray-100">
          {container.rows.map((row, rowIndex) => (
            <div key={row.id} className="relative">
              {/* Row header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  Row {rowIndex + 1}
                </span>
                <div className="flex items-center gap-2">
                  <ColumnLayoutPicker
                    value={row.columnLayout}
                    onChange={(layout) => handleRowLayoutChange(rowIndex, layout)}
                  />
                  {container.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove row"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Columns grid */}
              <div className={`grid ${columnGridClass[row.columnLayout]} gap-3 px-4 pb-3`}>
                {row.columns.map((column, colIndex) => (
                  <ColumnDropZone
                    key={column.id}
                    column={column}
                    columnIndex={colIndex}
                    onUpdateElements={(elements) =>
                      handleUpdateRowColumnElements(rowIndex, colIndex, elements)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeElement ? <ElementCardOverlay element={activeElement} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Add row button */}
      <div className="px-4 pb-3">
        <button
          type="button"
          onClick={handleAddRow}
          className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:text-charcoal hover:border-gold transition-colors"
        >
          + Add Row
        </button>
      </div>
    </div>
  );
}

// Drag overlay version
export function ContainerBlockOverlay({ container }: { container: BuilderContainer }) {
  const elementCount = container.rows.reduce(
    (total, row) => total + row.columns.reduce((t, col) => t + col.elements.length, 0),
    0
  );
  const rowCount = container.rows.length;

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
          {rowCount} row{rowCount !== 1 ? "s" : ""}, {elementCount} element{elementCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
