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
import type { BuilderPage, BuilderContainer, BuilderColumn } from "@/lib/builder-types";
import ContainerBlock, { ContainerBlockOverlay } from "@/components/admin/builder/ContainerBlock";
import ImageUpload from "@/components/admin/ImageUpload";

// ─── Helpers ──────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function createEmptyContainer(): BuilderContainer {
  return {
    id: crypto.randomUUID(),
    columnLayout: 1,
    columns: [{ id: crypto.randomUUID(), elements: [] }],
  };
}

// ─── Tabs ─────────────────────────────────────────────────

const tabs = [
  { key: "settings", label: "Settings" },
  { key: "content", label: "Content Builder" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

// ─── Main Component ───────────────────────────────────────

export default function PageBuilderEditor({
  page,
  initialHeroImageUrl,
}: {
  page: BuilderPage;
  initialHeroImageUrl?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabKey>("content");

  // Settings state
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [metaDescription, setMetaDescription] = useState(page.meta_description || "");
  const [isPublished, setIsPublished] = useState(page.is_published);
  const [heroImageId, setHeroImageId] = useState<string | null>(page.hero_image_id);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(initialHeroImageUrl || null);
  const [heroSubtitle, setHeroSubtitle] = useState(page.hero_subtitle || "");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // Content state
  const [containers, setContainers] = useState<BuilderContainer[]>(page.content || []);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentMessage, setContentMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // DnD state
  const [activeContainerId, setActiveContainerId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ─── Settings handlers ──────────────────────────────────

  const handleSaveSettings = async () => {
    if (!title.trim() || !slug.trim()) return;
    setSettingsSaving(true);
    setSettingsMessage(null);

    const { error } = await supabase
      .from("builder_pages")
      .update({
        title: title.trim(),
        slug: slug.trim(),
        meta_description: metaDescription.trim() || null,
        hero_image_id: heroImageId || null,
        hero_subtitle: heroSubtitle.trim() || null,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq("id", page.id);

    if (error) {
      if (error.code === "23505") {
        setSettingsMessage("A page with this slug already exists.");
      } else {
        setSettingsMessage(error.message);
      }
    } else {
      setSettingsMessage("Settings saved!");
      setTimeout(() => setSettingsMessage(null), 3000);
    }
    setSettingsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page? This cannot be undone.")) return;
    const { error } = await supabase.from("builder_pages").delete().eq("id", page.id);
    if (!error) {
      router.push("/admin/builder");
    }
  };

  // ─── Content handlers ───────────────────────────────────

  const updateContainers = (newContainers: BuilderContainer[]) => {
    setContainers(newContainers);
    setHasUnsavedChanges(true);
  };

  const handleAddContainer = () => {
    updateContainers([...containers, createEmptyContainer()]);
  };

  const handleUpdateContainer = (index: number, container: BuilderContainer) => {
    updateContainers(containers.map((c, i) => (i === index ? container : c)));
  };

  const handleDeleteContainer = (index: number) => {
    if (containers[index].columns.some((col) => col.elements.length > 0)) {
      if (!confirm("This container has elements. Delete it?")) return;
    }
    updateContainers(containers.filter((_, i) => i !== index));
  };

  const handleSaveContent = async () => {
    setContentSaving(true);
    setContentMessage(null);

    const { error } = await supabase
      .from("builder_pages")
      .update({
        content: containers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", page.id);

    if (error) {
      setContentMessage(error.message);
    } else {
      setContentMessage("Content saved!");
      setHasUnsavedChanges(false);
      setTimeout(() => setContentMessage(null), 3000);
    }
    setContentSaving(false);
  };

  // ─── Container DnD ─────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveContainerId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveContainerId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = containers.findIndex((c) => c.id === active.id);
    const newIndex = containers.findIndex((c) => c.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      updateContainers(arrayMove(containers, oldIndex, newIndex));
    }
  };

  const activeContainer = activeContainerId
    ? containers.find((c) => c.id === activeContainerId)
    : null;

  // ─── Render ─────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/builder"
            className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-serif text-2xl text-charcoal">{title || "Untitled Page"}</h1>
          {isPublished ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Published</span>
          ) : (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">Draft</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Preview Draft */}
          <Link
            href={`/admin/builder/${page.id}/preview`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </Link>

          {/* View on Site — only when published */}
          {isPublished && (
            <Link
              href={`/${slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Site
            </Link>
          )}

          <button
            onClick={handleDelete}
            className="text-sm text-gray-400 hover:text-red-600 transition-colors"
          >
            Delete Page
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.key
                ? "border-gold text-charcoal"
                : "border-transparent text-gray-500 hover:text-charcoal hover:border-gray-300"
            }`}
          >
            {tab.label}
            {tab.key === "content" && hasUnsavedChanges && (
              <span className="ml-1.5 w-2 h-2 bg-gold rounded-full inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* Tab: Settings */}
      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">URL Slug</label>
            <div className="flex items-center gap-1">
              <span className="text-warm-gray text-sm">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Meta Description <span className="text-warm-gray font-normal">(optional)</span>
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Brief description for search engines"
            />
          </div>

          <div>
            <ImageUpload
              currentImageUrl={heroImageUrl}
              onImageUploaded={(url, id) => {
                setHeroImageUrl(url || null);
                setHeroImageId(id || null);
              }}
              label="Hero Image (optional)"
            />
            <p className="text-xs text-warm-gray mt-1">
              Replaces the green hero section with a background image
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Hero Subtitle <span className="text-warm-gray font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Subtitle text below the page title"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded text-gold focus:ring-gold"
            />
            <span className="text-charcoal font-medium">Published</span>
          </label>

          {settingsMessage && (
            <div className={`p-3 text-sm rounded-lg ${
              settingsMessage.includes("saved") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}>
              {settingsMessage}
            </div>
          )}

          <button
            onClick={handleSaveSettings}
            disabled={settingsSaving || !title.trim() || !slug.trim()}
            className="px-6 py-2.5 bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-40 font-medium"
          >
            {settingsSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}

      {/* Tab: Content Builder */}
      {activeTab === "content" && (
        <div className="space-y-4">
          {/* Save bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveContent}
              disabled={contentSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-40 font-medium"
            >
              {contentSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Content"
              )}
            </button>

            <button
              onClick={handleAddContainer}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Container
            </button>

            {contentMessage && (
              <span className={`text-sm ${
                contentMessage.includes("saved") ? "text-green-600" : "text-red-600"
              }`}>
                {contentMessage}
              </span>
            )}

            {hasUnsavedChanges && !contentMessage && (
              <span className="text-sm text-warm-gray">Unsaved changes</span>
            )}
          </div>

          {/* Containers */}
          {containers.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"
                />
              </svg>
              <h3 className="font-serif text-xl text-charcoal mb-2">Start Building</h3>
              <p className="text-warm-gray mb-6">
                Add containers to start building your page. Each container can have 1-4 columns with elements inside.
              </p>
              <button
                onClick={handleAddContainer}
                className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Container
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={containers.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {containers.map((container, index) => (
                    <ContainerBlock
                      key={container.id}
                      container={container}
                      onUpdate={(updated) => handleUpdateContainer(index, updated)}
                      onDelete={() => handleDeleteContainer(index)}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeContainer ? (
                  <ContainerBlockOverlay container={activeContainer} />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {/* Bottom add container button */}
          {containers.length > 0 && (
            <button
              onClick={handleAddContainer}
              className="w-full py-3 text-sm text-gray-400 hover:text-gold border-2 border-dashed border-gray-200 hover:border-gold/30 rounded-xl transition-colors"
            >
              + Add Container
            </button>
          )}
        </div>
      )}
    </div>
  );
}
