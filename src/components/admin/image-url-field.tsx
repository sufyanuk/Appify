"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/actions/uploads";
import { Field, Input, errorProps } from "@/components/ui/field";
import { FoodImage } from "@/components/ui/food-image";

const MAX_SIDE = 1600; // px — plenty for menu cards, keeps uploads small

/**
 * Resize and re-encode a photo in the browser (JPEG, ≤1600px), so large phone
 * photos upload quickly and fit the server's size limit.
 */
async function shrinkPhoto(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.fillStyle = "#ffffff"; // transparent PNGs get a white background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("encode failed"))), "image/jpeg", 0.85),
  );
}

/** Photo field: upload from the computer, or paste a link. Live preview. */
export function ImageUrlField({ defaultValue, errors }: { defaultValue: string; errors?: string[] }) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewSrc = /^https?:\/\/|^\//.test(url.trim()) ? url.trim() : "";

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    setUploading(true);
    try {
      let blob: Blob;
      try {
        blob = await shrinkPhoto(file);
      } catch {
        setUploadError("This photo format isn't supported by your browser. Please use a JPG or PNG.");
        return;
      }
      const data = new FormData();
      data.append("file", new File([blob], "photo.jpg", { type: "image/jpeg" }));
      const result = await uploadImage(data);
      if (result.ok) setUrl(result.url);
      else setUploadError(result.error);
    } catch {
      setUploadError("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Field
      label="Photo"
      htmlFor="image"
      hint="Upload a photo from your computer, or paste a link to one. Leave empty for a placeholder."
      errors={uploadError ? [uploadError] : errors}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <FoodImage src={previewSrc} alt="Preview" className="h-24 w-32 shrink-0 rounded-xl text-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              className="sr-only"
              id="image-upload"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <label
              htmlFor="image-upload"
              aria-disabled={uploading}
              className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-stone-700 ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              {uploading ? "Uploading…" : "Upload from computer"}
            </label>
            {previewSrc && !uploading && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="h-10 rounded-full px-3 text-sm font-medium text-muted hover:bg-stone-100 hover:text-ink"
              >
                Remove photo
              </button>
            )}
          </div>
          <Input
            id="image"
            name="image"
            type="text"
            inputMode="url"
            placeholder="…or paste an image link (https://…)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Image link"
            {...errorProps("image", uploadError ? [uploadError] : errors)}
          />
        </div>
      </div>
    </Field>
  );
}
