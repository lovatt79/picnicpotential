"use client";

import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { BuilderColumn, BuilderElement } from "@/lib/builder-types";
import ElementCard from "./ElementCard";
import ElementModal from "./ElementModal";

interface ColumnDropZoneProps {
  column: BuilderColumn;
  columnIndex: number;
  onUpdateElements: (elements: BuilderElement[]) => void;
}

export default function ColumnDropZone({
  column,
  columnIndex,
  onUpdateElements,
}: ColumnDropZoneProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingElement, setEditingElement] = useState<BuilderElement | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleAddElement = (element: BuilderElement) => {
    onUpdateElements([...column.elements, element]);
  };

  const handleEditElement = (element: BuilderElement) => {
    onUpdateElements(
      column.elements.map((el) => (el.id === element.id ? element : el))
    );
  };

  const handleDeleteElement = (elementId: string) => {
    onUpdateElements(column.elements.filter((el) => el.id !== elementId));
  };

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] rounded-lg border-2 border-dashed p-2 transition-colors ${
        isOver ? "border-gold bg-gold/5" : "border-gray-200 bg-gray-50/50"
      }`}
    >
      <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 px-1">
        Column {columnIndex + 1}
      </div>

      <SortableContext
        items={column.elements.map((el) => el.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1.5">
          {column.elements.map((element) => (
            <ElementCard
              key={element.id}
              element={element}
              onEdit={() => {
                setEditingElement(element);
                setShowModal(true);
              }}
              onDelete={() => handleDeleteElement(element.id)}
            />
          ))}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => {
          setEditingElement(null);
          setShowModal(true);
        }}
        className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gold hover:bg-gold/5 rounded-lg transition-colors border border-transparent hover:border-gold/30"
      >
        + Add Element
      </button>

      <ElementModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingElement(null);
        }}
        onSave={editingElement ? handleEditElement : handleAddElement}
        editingElement={editingElement}
      />
    </div>
  );
}
