"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

const PAGE_SIZE = 24;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MediaGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
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

        const results = data || [];
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
    setPage(0);
    setLoading(true);
    fetchMedia(0, search);
  }, [search, fetchMedia]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMedia(nextPage, search, true);
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

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.original_filename}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("images")
        .remove([item.filename]);

      if (storageError) console.error("Storage delete error:", storageError);

      // Delete from media table
      const { error: dbError } = await supabase
        .from("media")
        .delete()
        .eq("id", item.id);

      if (dbError) throw dbError;

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setSelectedItem(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow p-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gold transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className="mx-auto w-12 h-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              Uploading...
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-600">
                Click to upload images
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, WebP up to 10MB each. Multiple files supported.
              </p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading media...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {search ? "No images match your search." : "No images uploaded yet."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                  selectedItem?.id === item.id
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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white truncate">
                    {item.original_filename}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2.5 text-sm font-medium text-charcoal border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Panel */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium text-charcoal truncate pr-4">
                {selectedItem.original_filename}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
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

            {/* Preview */}
            <div className="p-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ maxHeight: "400px" }}
              >
                <img
                  src={selectedItem.url}
                  alt={selectedItem.alt_text || selectedItem.original_filename}
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>
            </div>

            {/* Details */}
            <div className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Dimensions</p>
                  <p className="font-medium text-charcoal">
                    {selectedItem.width && selectedItem.height
                      ? `${selectedItem.width} × ${selectedItem.height}`
                      : "Unknown"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">File Size</p>
                  <p className="font-medium text-charcoal">
                    {formatFileSize(selectedItem.size_bytes)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Uploaded</p>
                  <p className="font-medium text-charcoal">
                    {formatDate(selectedItem.created_at)}
                  </p>
                </div>
              </div>

              {/* URL Copy */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Public URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.url}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 select-all"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={() => copyUrl(selectedItem.url)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      copied
                        ? "bg-green-100 text-green-700"
                        : "bg-charcoal text-white hover:bg-gold hover:text-charcoal"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-2 border-t">
                <button
                  onClick={() => handleDelete(selectedItem)}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Image"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
