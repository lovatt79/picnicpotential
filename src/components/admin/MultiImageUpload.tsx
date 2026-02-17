"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface MultiImageUploadProps {
  onImagesUploaded: (images: Array<{ url: string; mediaId: string }>) => void;
  label: string;
  maxSizeMB?: number;
}

export default function MultiImageUpload({
  onImagesUploaded,
  label,
  maxSizeMB = 5,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate all files first
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setError(`${file.name} is not an image file`);
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setError(`${file.name} exceeds ${maxSizeMB}MB`);
        return;
      }
    }

    setError(null);
    setUploading(true);

    try {
      const uploadedImages: Array<{ url: string; mediaId: string }> = [];

      // Upload files one by one
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadProgress(`Uploading ${i + 1} of ${fileArray.length}...`);

        // Create a unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        // Get image dimensions
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Save to media table
        const { data: mediaData, error: mediaError } = await supabase
          .from("media")
          .insert({
            filename: fileName,
            original_filename: file.name,
            url: publicUrl,
            mime_type: file.type,
            size_bytes: file.size,
            width: img.width,
            height: img.height,
          })
          .select()
          .single();

        if (mediaError) {
          throw mediaError;
        }

        uploadedImages.push({ url: publicUrl, mediaId: mediaData.id });
      }

      // Notify parent of all uploaded images
      onImagesUploaded(uploadedImages);
      setUploadProgress("");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading images:", err);
      setError(err instanceof Error ? err.message : "Failed to upload images");
      setUploadProgress("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-charcoal">
        {label}
      </label>

      <div
        className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-gold transition-colors cursor-pointer"
        style={{ aspectRatio: "21/9" }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-600 font-medium mb-1">
            Click to upload multiple images or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to {maxSizeMB}MB each
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {uploading && (
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            {uploadProgress}
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
