"use client";

import { useState, useEffect } from "react";
import type {
  BuilderElement,
  ElementType,
  TitleElement,
  TextElement,
  ImageElement,
  CodeElement,
} from "@/lib/builder-types";
import ImageUpload from "@/components/admin/ImageUpload";

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
      case "text":
        if (!textContent.trim()) return;
        element = { id, type: "text", text: textContent.trim() } as TextElement;
        break;
      case "image":
        if (!imageUrl) return;
        element = { id, type: "image", image_id: imageId, image_url: imageUrl, alt: imageAlt.trim() } as ImageElement;
        break;
      case "code":
        if (!codeContent.trim()) return;
        element = { id, type: "code", code: codeContent, language: codeLanguage.trim() } as CodeElement;
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
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter paragraph text..."
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
