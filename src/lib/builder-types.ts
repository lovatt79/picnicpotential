// ─── Element Types ───────────────────────────────────────

export type ElementType = "title" | "text" | "image" | "code" | "gallery";

export type GalleryLayout = "grid" | "carousel";
export type GalleryColumns = 1 | 2 | 3 | 4;

export interface TitleElement {
  id: string;
  type: "title";
  level: "h1" | "h2" | "h3" | "h4";
  text: string;
}

export interface TextElement {
  id: string;
  type: "text";
  text: string;
}

export interface ImageElement {
  id: string;
  type: "image";
  image_id: string | null;
  image_url: string | null;
  alt: string;
}

export interface CodeElement {
  id: string;
  type: "code";
  code: string;
  language: string;
}

export interface GalleryImage {
  id: string;
  image_id: string | null;
  image_url: string;
  alt: string;
}

export interface GalleryElement {
  id: string;
  type: "gallery";
  images: GalleryImage[];
  layout: GalleryLayout;
  columns: GalleryColumns;
}

export type BuilderElement = TitleElement | TextElement | ImageElement | CodeElement | GalleryElement;

// ─── Column ──────────────────────────────────────────────

export interface BuilderColumn {
  id: string;
  elements: BuilderElement[];
}

// ─── Row ─────────────────────────────────────────────────

export type ColumnLayout = 1 | 2 | 3 | 4;

export interface BuilderRow {
  id: string;
  columnLayout: ColumnLayout;
  columns: BuilderColumn[];
}

// ─── Container ───────────────────────────────────────────

export type ContainerBgColor = "" | "white" | "sage" | "sage-light" | "charcoal" | "gold-light";

export interface BuilderContainer {
  id: string;
  rows: BuilderRow[];
  label?: string;
  bgColor?: ContainerBgColor;
  // Legacy fields (pre-rows format) — kept for backward compat
  columns?: BuilderColumn[];
  columnLayout?: ColumnLayout;
}

/** Convert a container from legacy (columnLayout/columns) to new (rows) format */
export function normalizeContainer(container: BuilderContainer): BuilderContainer {
  if (container.rows && container.rows.length > 0) {
    return container;
  }
  const row: BuilderRow = {
    id: crypto.randomUUID(),
    columnLayout: container.columnLayout || 1,
    columns: container.columns || [{ id: crypto.randomUUID(), elements: [] }],
  };
  return {
    id: container.id,
    rows: [row],
    label: container.label,
    bgColor: container.bgColor || "",
  };
}

// ─── Page ────────────────────────────────────────────────

export interface BuilderPage {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  hero_image_id: string | null;
  hero_subtitle: string | null;
  content: BuilderContainer[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
