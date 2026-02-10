"use client";

import { useState } from "react";
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
import type { SeatingOption } from "@/lib/supabase/types";

function SortableItem({ item, onDelete }: { item: SeatingOption; onDelete: (id: string) => void }) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-charcoal truncate">{item.title}</h3>
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              item.is_published
                ? "bg-sage text-charcoal"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {item.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-sm text-warm-gray truncate mt-1">
          {item.description?.substring(0, 100) || "No description"}...
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/admin/seating/${item.id}`}
          className="p-2 text-gray-400 hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function SeatingList({ initialItems }: { initialItems: SeatingOption[] }) {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((s) => s.id === active.id);
      const newIndex = items.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);

      for (let i = 0; i < newOrder.length; i++) {
        await supabase.from("seating_options").update({ sort_order: i }).eq("id", newOrder[i].id);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this seating option?")) return;
    const { error } = await supabase.from("seating_options").delete().eq("id", id);
    if (!error) {
      setItems(items.filter((s) => s.id !== id));
      router.refresh();
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <h3 className="font-serif text-xl text-charcoal mb-2">No seating options yet</h3>
        <p className="text-warm-gray mb-6">Get started by adding your first seating option</p>
        <Link href="/admin/seating/new" className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors">
          Add Seating Option
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-warm-gray mb-4">Drag and drop to reorder</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
