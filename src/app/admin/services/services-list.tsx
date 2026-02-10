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
import type { Service } from "@/lib/supabase/types";

function SortableItem({ service, onDelete }: { service: Service; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

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
          <h3 className="font-medium text-charcoal truncate">{service.title}</h3>
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              service.is_published
                ? "bg-sage text-charcoal"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {service.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-sm text-warm-gray truncate mt-1">
          {service.description || "No description"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/admin/services/${service.id}`}
          className="p-2 text-gray-400 hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Link>
        <button
          onClick={() => onDelete(service.id)}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ServicesList({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((s) => s.id === active.id);
      const newIndex = services.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(services, oldIndex, newIndex);
      setServices(newOrder);

      // Update sort_order in database
      const updates = newOrder.map((service, index) => ({
        id: service.id,
        sort_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("services")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setDeleting(id);
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      alert("Failed to delete service");
      setDeleting(null);
    } else {
      setServices(services.filter((s) => s.id !== id));
      router.refresh();
    }
  };

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-charcoal mb-2">No services yet</h3>
        <p className="text-warm-gray mb-6">Get started by adding your first service</p>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-warm-gray mb-4">
        Drag and drop to reorder services
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={services.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {services.map((service) => (
            <SortableItem
              key={service.id}
              service={service}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
