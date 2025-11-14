import { Request, Response } from "express";
import { storagePut } from "../storage";
import { randomBytes } from "crypto";
import type { Multer } from "multer";

export async function handleFileUpload(req: Request & { file?: Express.Multer.File }, res: Response) {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const fileType = req.body.type as string;
    const file = req.file;

    // Validate file type
    if (!["image", "audio"].includes(fileType)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    // Validate file size
    const maxSize = fileType === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({ error: "File size exceeds limit" });
    }

    // Generate unique filename with random suffix
    const randomSuffix = randomBytes(8).toString("hex");
    const fileExtension = file.originalname?.split(".").pop() || "bin";
    const fileName = `${fileType}s/${Date.now()}-${randomSuffix}.${fileExtension}`;

    // Upload to S3
    const { url } = await storagePut(fileName, file.buffer || Buffer.from([]), file.mimetype || "application/octet-stream");

    return res.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
