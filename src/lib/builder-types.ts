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

// ─── Container ───────────────────────────────────────────

export type ColumnLayout = 1 | 2 | 3 | 4;

export interface BuilderContainer {
  id: string;
  columns: BuilderColumn[];
  columnLayout: ColumnLayout;
  label?: string;
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
