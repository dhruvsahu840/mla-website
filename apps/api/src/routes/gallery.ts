
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { ok, created, fail } from "../lib/response";
import {
  requireAuth,
  requireRole,
  AuthedRequest,
} from "../middleware/auth";

const router = Router();

// Public: gallery albums with their photos
router.get("/albums", async (_req, res, next) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: { orderBy: { createdAt: "desc" } },
        _count: { select: { items: true } },
      },
    });

    return ok(res, albums);
  } catch (err) {
    next(err);
  }
});

// Public: latest photos for the homepage
router.get("/latest", async (req, res, next) => {
  try {
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      30
    );

    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        album: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return ok(res, items);
  } catch (err) {
    next(err);
  }
});

// Admin: create an album
router.post(
  "/albums",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const title =
        typeof req.body.title === "string"
          ? req.body.title.trim()
          : "";

      const slug =
        typeof req.body.slug === "string"
          ? req.body.slug.trim()
          : "";

      const category =
        typeof req.body.category === "string"
          ? req.body.category.trim()
          : "";

      if (!title || !slug) {
        return fail(res, 400, "Album title and slug are required");
      }

      const existing = await prisma.galleryAlbum.findUnique({
        where: { slug },
      });

      if (existing) {
        return fail(res, 409, "This album slug already exists");
      }

      const album = await prisma.galleryAlbum.create({
        data: {
          title,
          slug,
          category: category || null,
        },
      });

      return created(res, album);
    } catch (err) {
      next(err);
    }
  }
);

// Admin: add an already-uploaded Cloudinary image to an album
router.post(
  "/albums/:albumId/items",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const albumId = String(req.params.albumId);
      const url =
        typeof req.body.url === "string"
          ? req.body.url.trim()
          : "";
      const caption =
        typeof req.body.caption === "string"
          ? req.body.caption.trim()
          : "";

      if (!url || !/^https:\/\/res\.cloudinary\.com\//i.test(url)) {
        return fail(res, 400, "A valid Cloudinary image URL is required");
      }

      const album = await prisma.galleryAlbum.findUnique({
        where: { id: albumId },
      });

      if (!album) {
        return fail(res, 404, "Gallery album not found");
      }

      const item = await prisma.$transaction(async (tx) => {
        const createdItem = await tx.galleryItem.create({
          data: {
            albumId,
            url,
            type: "image",
            caption: caption || null,
          },
        });

        if (!album.coverImage) {
          await tx.galleryAlbum.update({
            where: { id: albumId },
            data: { coverImage: url },
          });
        }

        return createdItem;
      });

      return created(res, item);
    } catch (err) {
      next(err);
    }
  }
);

// Admin: delete a photo from the gallery
router.delete(
  "/items/:id",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      const id = String(req.params.id);

      const item = await prisma.galleryItem.findUnique({
        where: { id },
      });

      if (!item) {
        return fail(res, 404, "Gallery photo not found");
      }

      await prisma.$transaction(async (tx) => {
        await tx.galleryItem.delete({ where: { id } });

        const album = await tx.galleryAlbum.findUnique({
          where: { id: item.albumId },
          include: {
            items: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        if (album?.coverImage === item.url) {
          await tx.galleryAlbum.update({
            where: { id: item.albumId },
            data: { coverImage: album.items[0]?.url ?? null },
          });
        }
      });

      return ok(res, null, "Gallery photo deleted");
    } catch (err) {
      next(err);
    }
  }
);

// Admin: delete an album and its photos
router.delete(
  "/albums/:id",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      const id = String(req.params.id);

      const album = await prisma.galleryAlbum.findUnique({
        where: { id },
      });

      if (!album) {
        return fail(res, 404, "Gallery album not found");
      }

      await prisma.galleryAlbum.delete({ where: { id } });

      return ok(res, null, "Gallery album deleted");
    } catch (err) {
      next(err);
    }
  }
);

export default router;
