"use client";

import { useState, useEffect } from "react";
import type {
  BuilderElement,
  ElementType,
  TitleElement,
  TextElement,
  ImageElement,
  CodeElement,
  GalleryElement,
  GalleryImage,
  GalleryLayout,
  GalleryColumns,
} from "@/lib/builder-types";
import ImageUpload from "@/components/admin/ImageUpload";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import RichTextEditor from "./RichTextEditor";

interface ElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (element: BuilderElement) => void;
  editingElement?: BuilderElement | null;
}

const elementTypes: { value: ElementType; label: string; icon: string }[] = [
  { value: "title", label: "Title", icon: "T" },
  { value: "text", label: "Text", icon: "Aa" },
  { value: "image", label: "Image", icon: "Img" },
  { value: "gallery", label: "Gallery", icon: "GI" },
  { value: "code", label: "Code", icon: "</>" },
];

export default function ElementModal({
  isOpen,
  onClose,
  onSave,
  editingElement,
}: ElementModalProps) {
  const [type, setType] = useState<ElementType>("title");

  // Title fields
  const [titleText, setTitleText] = useState("");
  const [titleLevel, setTitleLevel] = useState<"h1" | "h2" | "h3" | "h4">("h2");

  // Text fields
  const [textContent, setTextContent] = useState("");

  // Image fields
  const [imageId, setImageId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState("");

  // Code fields
  const [codeContent, setCodeContent] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");

  // Gallery fields
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLayout, setGalleryLayout] = useState<GalleryLayout>("grid");
  const [galleryColumns, setGalleryColumns] = useState<GalleryColumns>(3);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (editingElement) {
      setType(editingElement.type);
      switch (editingElement.type) {
        case "title":
          setTitleText(editingElement.text);
          setTitleLevel(editingElement.level);
          break;
        case "text":
          setTextContent(editingElement.text);
          break;
        case "image":
          setImageId(editingElement.image_id);
          setImageUrl(editingElement.image_url);
          setImageAlt(editingElement.alt);
          break;
        case "code":
          setCodeContent(editingElement.code);
          setCodeLanguage(editingElement.language);
          break;
        case "gallery":
          setGalleryImages(editingElement.images);
          setGalleryLayout(editingElement.layout);
          setGalleryColumns(editingElement.columns);
          break;
      }
    } else {
      // Reset all fields
      setType("title");
      setTitleText("");
      setTitleLevel("h2");
      setTextContent("");
      setImageId(null);
      setImageUrl(null);
      setImageAlt("");
      setCodeContent("");
      setCodeLanguage("");
      setGalleryImages([]);
      setGalleryLayout("grid");
      setGalleryColumns(3);
    }
  }, [editingElement, isOpen]);

  const handleSave = () => {
    const id = editingElement?.id || crypto.randomUUID();

    let element: BuilderElement;

    switch (type) {
      case "title":
        if (!titleText.trim()) return;
        element = { id, type: "title", text: titleText.trim(), level: titleLevel } as TitleElement;
        break;
      case "text": {
        const stripped = textContent.replace(/<[^>]*>/g, "").trim();
        if (!stripped) return;
        element = { id, type: "text", text: textContent } as TextElement;
        break;
      }
      case "image":
        if (!imageUrl) return;
        element = { id, type: "image", image_id: imageId, image_url: imageUrl, alt: imageAlt.trim() } as ImageElement;
        break;
      case "code":
        if (!codeContent.trim()) return;
        element = { id, type: "code", code: codeContent, language: codeLanguage.trim() } as CodeElement;
        break;
      case "gallery":
        if (galleryImages.length === 0) return;
        element = { id, type: "gallery", images: galleryImages, layout: galleryLayout, columns: galleryColumns } as GalleryElement;
        break;
    }

    onSave(element);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="px-6 py-4 border-b">
          <h3 className="font-serif text-xl text-charcoal">
            {editingElement ? "Edit Element" : "Add Element"}
          </h3>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Type selector — only for new elements */}
          {!editingElement && (
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Element Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {elementTypes.map((et) => (
                  <button
                    key={et.value}
                    type="button"
                    onClick={() => setType(et.value)}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      type === et.value
                        ? "bg-gold/20 text-charcoal border-2 border-gold"
                        : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <div className="text-xs font-mono mb-1">{et.icon}</div>
                    {et.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type-specific fields */}
          {type === "title" && (
            <>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Heading Level
                </label>
                <div className="flex gap-2">
                  {(["h1", "h2", "h3", "h4"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setTitleLevel(level)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        titleLevel === level
                          ? "bg-charcoal text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Title Text
                </label>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter heading text..."
                />
              </div>
            </>
          )}

          {type === "text" && (
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Text Content
              </label>
              <RichTextEditor
                content={textContent}
                onChange={setTextContent}
              />
            </div>
          )}

          {type === "image" && (
            <>
              <ImageUpload
                currentImageUrl={imageUrl}
                onImageUploaded={(url, id) => {
                  setImageUrl(url || null);
                  setImageId(id || null);
                }}
                label="Image"
              />
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Alt Text <span className="text-warm-gray font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Describe the image..."
                />
              </div>
            </>
          )}

          {type === "code" && (
            <>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Language <span className="text-warm-gray font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="e.g. html, css, javascript"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Code
                </label>
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-mono text-sm"
                  placeholder="Paste your code here..."
                />
              </div>
            </>
          )}

          {type === "gallery" && (
            <>
              {/* Layout picker */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Layout
                </label>
                <div className="flex gap-2">
                  {(["grid", "carousel"] as const).map((layout) => (
                    <button
                      key={layout}
                      type="button"
                      onClick={() => setGalleryLayout(layout)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        galleryLayout === layout
                          ? "bg-charcoal text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {layout === "grid" ? "Grid" : "Carousel"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column selector (grid only) */}
              {galleryLayout === "grid" && (
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Columns
                  </label>
                  <div className="flex gap-2">
                    {([1, 2, 3, 4] as const).map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => setGalleryColumns(cols)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          galleryColumns === cols
                            ? "bg-charcoal text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {cols}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Images list */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Images ({galleryImages.length})
                </label>

                {galleryImages.length > 0 && (
                  <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                    {galleryImages.map((img, idx) => (
                      <div key={img.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                        <img
                          src={img.image_url}
                          alt={img.alt}
                          className="w-12 h-12 object-cover rounded shrink-0"
                        />
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => {
                            const updated = [...galleryImages];
                            updated[idx] = { ...updated[idx], alt: e.target.value };
                            setGalleryImages(updated);
                          }}
                          placeholder="Alt text..."
                          className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-gold focus:border-transparent"
                        />
                        {/* Move up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const updated = [...galleryImages];
                            [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                            setGalleryImages(updated);
                          }}
                          className="p-1 text-gray-400 hover:text-charcoal disabled:opacity-30"
                          title="Move up"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        {/* Move down */}
                        <button
                          type="button"
                          disabled={idx === galleryImages.length - 1}
                          onClick={() => {
                            const updated = [...galleryImages];
                            [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                            setGalleryImages(updated);
                          }}
                          className="p-1 text-gray-400 hover:text-charcoal disabled:opacity-30"
                          title="Move down"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryImages(galleryImages.filter((_, i) => i !== idx));
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Remove"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowGalleryPicker(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gold hover:text-charcoal transition-colors"
                >
                  + Add Images from Library
                </button>
              </div>

              <MediaPickerModal
                isOpen={showGalleryPicker}
                onClose={() => setShowGalleryPicker(false)}
                onSelect={(selectedItems) => {
                  const newImages: GalleryImage[] = selectedItems.map((item) => ({
                    id: crypto.randomUUID(),
                    image_id: item.id,
                    image_url: item.url,
                    alt: item.alt_text || "",
                  }));
                  setGalleryImages((prev) => [...prev, ...newImages]);
                }}
                multiple={true}
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium bg-charcoal text-white rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
          >
            {editingElement ? "Save Changes" : "Add Element"}
          </button>
        </div>
      </div>
    </div>
  );
}
