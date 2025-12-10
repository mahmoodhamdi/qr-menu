import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF",
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "File too large. Maximum size: 5MB",
      };
    }

    // Ensure upload directory exists
    const uploadPath = path.resolve(UPLOAD_DIR);
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = "webp"; // Convert all to webp for optimization
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const filepath = path.join(uploadPath, filename);

    // Process and optimize image
    const buffer = Buffer.from(await file.arrayBuffer());
    await sharp(buffer)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    return {
      success: true,
      url: `/uploads/${filename}`,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "Failed to upload image",
    };
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    const { unlink } = await import("fs/promises");
    const filename = url.replace("/uploads/", "");
    const filepath = path.join(path.resolve(UPLOAD_DIR), filename);
    await unlink(filepath);
    return true;
  } catch {
    return false;
  }
}
