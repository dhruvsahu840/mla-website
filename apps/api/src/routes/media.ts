import { Router } from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary";

import {
  requireAuth,
  requireRole,
  AuthedRequest,
} from "../middleware/auth";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

// Keep Cloudinary connection test
router.get("/test", async (_req, res, next) => {
  try {
    const result = await cloudinary.api.ping();

    return res.json({
      success: true,
      message: "Cloudinary connection successful",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/media/upload
router.post(
  "/upload",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  upload.single("file"),
  async (
  req: AuthedRequest & { file?: Express.Multer.File },
  res,
  next
) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const isVideo = req.file.mimetype.startsWith("video/");
      const isImage = req.file.mimetype.startsWith("image/");

      if (!isImage && !isVideo) {
        return res.status(400).json({
          success: false,
          message: "Only image and video files are allowed",
        });
      }

      const resourceType = isVideo ? "video" : "image";

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "mla-website/events",
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file!.buffer);
      });

      return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          type: isVideo ? "VIDEO" : "IMAGE",
          width: result.width ?? null,
          height: result.height ?? null,
          format: result.format ?? null,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;