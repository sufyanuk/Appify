"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

const MAX_BYTES = 3.5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"] as const;

/** Check the file's first bytes really are a JPEG, PNG or WebP image. */
function sniff(bytes: Uint8Array): (typeof ALLOWED)[number] | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return "image/webp";
  return null;
}

/** Admin-only: store an uploaded food photo and return its public URL. */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose a photo to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "That photo is too large. Please use one under 3.5 MB." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = sniff(bytes);
  if (!mimeType) {
    return { ok: false, error: "Please upload a JPG, PNG or WebP photo." };
  }

  try {
    const image = await db.uploadedImage.create({
      data: { mimeType, size: bytes.length, data: Buffer.from(bytes) },
      select: { id: true },
    });
    return { ok: true, url: `/api/images/${image.id}` };
  } catch (error) {
    console.error("uploadImage failed", error);
    return { ok: false, error: "Could not save the photo. Please try again." };
  }
}
