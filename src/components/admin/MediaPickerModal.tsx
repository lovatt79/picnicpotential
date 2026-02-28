"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface MediaItem {
  id: string;
  filename: string;
  original_filename: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (items: MediaItem[]) => void;
  multiple?: boolean;
}

const PAGE_SIZE = 24;

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchMedia = useCallback(
    async (pageNum: number, searchQuery: string, append = false) => {
      try {
        let query = supabase
          .from("media")
          .select("*")
          .order("created_at", { ascending: false })
          .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

        if (searchQuery.trim()) {
          query = query.ilike("original_filename", `%${searchQuery.trim()}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        const results = (data || []) as MediaItem[];
        setHasMore(results.length === PAGE_SIZE);

        if (append) {
          setItems((prev) => [...prev, ...results]);
        } else {
          setItems(results);
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (isOpen) {
      setSelected(new Set());
      setSearch("");
      setPage(0);
      setLoading(true);
      fetchMedia(0, "");
    }
  }, [isOpen, fetchMedia]);

  useEffect(() => {
    if (isOpen) {
      setPage(0);
      setLoading(true);
      fetchMedia(0, search);
    }
  }, [search, isOpen, fetchMedia]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMedia(nextPage, search, true);
  }, [page, search, fetchMedia]);

  // Infinite scroll via IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !hasMore || loading) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isOpen, hasMore, loading, loadMore]);

  const toggleSelection = (item: MediaItem) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (multiple) {
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
      } else {
        // Single select mode — toggle or replace
        if (next.has(item.id)) {
          next.clear();
        } else {
          next.clear();
          next.add(item.id);
        }
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selectedItems = items.filter((item) => selected.has(item.id));
    onSelect(selectedItems);
    onClose();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) {
          setUploadError(`${file.name} is not an image file`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          setUploadError(`${file.name} exceeds 10MB limit`);
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(fileName);

        // Get dimensions
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const { error: mediaError } = await supabase.from("media").insert({
          filename: fileName,
          original_filename: file.name,
          url: publicUrl,
          mime_type: file.type,
          size_bytes: file.size,
          width: img.width,
          height: img.height,
        });

        if (mediaError) throw mediaError;

        URL.revokeObjectURL(img.src);
      }

      // Refresh the gallery
      setPage(0);
      fetchMedia(0, search);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-serif text-xl text-charcoal">
            {multiple ? "Select Images" : "Select an Image"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Inline Upload + Search Row */}
          <div className="flex gap-3">
            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 bg-charcoal text-white text-sm font-medium rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload New
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />

            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by filename..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>

          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}

          {/* Image Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading media...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {search
                ? "No images match your search."
                : "No images in your library yet. Upload some!"}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {items.map((item) => {
                  const isSelected = selected.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSelection(item)}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                        isSelected
                          ? "border-gold ring-2 ring-gold/30"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.alt_text || item.original_filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Checkmark overlay */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow">
                          <svg
                            className="w-4 h-4 text-charcoal"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Filename on hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white truncate">
                          {item.original_filename}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500">
            {selected.size > 0
              ? `${selected.size} image${selected.size > 1 ? "s" : ""} selected`
              : multiple
              ? "Select one or more images"
              : "Select an image"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-5 py-2 text-sm font-medium bg-gold text-charcoal rounded-lg hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selected.size > 0
                ? `Select${multiple && selected.size > 1 ? ` (${selected.size})` : ""}`
                : "Select"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
