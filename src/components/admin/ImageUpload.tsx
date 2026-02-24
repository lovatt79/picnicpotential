"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import MediaPickerModal from "./MediaPickerModal";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageUploaded: (url: string, mediaId: string) => void;
  label: string;
  aspectRatio?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  label,
  aspectRatio = "16/9",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
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

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl, mediaData.id);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageUploaded("", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMediaSelect = (items: Array<{ id: string; url: string }>) => {
    if (items.length > 0) {
      const item = items[0];
      setPreviewUrl(item.url);
      onImageUploaded(item.url, item.id);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-charcoal">
        {label}
      </label>

      {previewUrl ? (
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0">
            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-gold hover:text-gold-dark font-medium"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="text-sm text-gold hover:text-gold-dark font-medium"
            >
              Library
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-charcoal hover:border-gold hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => setShowMediaPicker(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-charcoal hover:border-gold hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose from Library
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {uploading && (
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            Uploading...
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        multiple={false}
      />
    </div>
  );
}
