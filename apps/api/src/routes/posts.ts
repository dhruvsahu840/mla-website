import { Router } from "express";

import { postSchema } from "@mla/validation";

import { prisma } from "../lib/prisma";

import { ok, created, fail } from "../lib/response";

import {
  requireAuth,
  requireRole,
  AuthedRequest,
} from "../middleware/auth";

const router = Router();

// GET /api/posts - public, published only
router.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Math.min(Number(req.query.pageSize) || 9, 50);
    const category = req.query.category as string | undefined;

    const where = {
      status: "PUBLISHED" as const,
      ...(category ? { category } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),

      prisma.post.count({ where }),
    ]);

    return ok(res, items, "OK", { page, pageSize, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/admin/all - admin list, all statuses (ADMIN + STAFF)
router.get(
  "/admin/all",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Math.min(Number(req.query.pageSize) || 20, 100);

      const [items, total] = await Promise.all([
        prisma.post.findMany({
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),

        prisma.post.count(),
      ]);

      return ok(res, items, "OK", { page, pageSize, total });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/posts/:slug - public single post
router.get("/:slug", async (req, res, next) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: req.params.slug,
        status: "PUBLISHED",
      },
    });

    if (!post) {
      return fail(res, 404, "Post not found");
    }

    return ok(res, post);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts - admin create (ADMIN + STAFF)
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const input = postSchema.parse(req.body);

      const post = await prisma.post.create({
        data: {
          ...input,
          authorId: req.admin!.id,
          publishedAt:
            input.status === "PUBLISHED" ? new Date() : null,
        },
      });

      return created(res, post);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/posts/admin/:id - admin update (ADMIN + STAFF)
router.put(
  "/admin/:id",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      // Convert Express route parameter to a normal string
      const id = String(req.params.id);

      const input = postSchema.partial().parse(req.body);

      const existing = await prisma.post.findUnique({
        where: { id },
      });

      if (!existing) {
        return fail(res, 404, "Post not found");
      }

      const wasPublished = existing.status === "PUBLISHED";
      const willBePublished = input.status === "PUBLISHED";

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...input,
          publishedAt:
            !wasPublished && willBePublished
              ? new Date()
              : existing.publishedAt,
        },
      });

      return ok(res, post, "Post updated");
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/posts/admin/:id - admin delete (ADMIN only)
router.delete(
  "/admin/:id",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      // Convert Express route parameter to a normal string
      const id = String(req.params.id);

      await prisma.post.delete({
        where: { id },
      });

      return ok(res, null, "Post deleted");
    } catch (err) {
      next(err);
    }
  }
);

export default router;