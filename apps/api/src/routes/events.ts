import { Router } from "express";

import { eventMediaSchema, eventSchema } from "@mla/validation";

import { prisma } from "../lib/prisma";

import { ok, created, fail } from "../lib/response";

import {
  requireAuth,
  requireRole,
  AuthedRequest,
} from "../middleware/auth";

const router = Router();

type EventMediaInput = {
  type: "IMAGE" | "VIDEO";
  url: string;
  publicId?: string;
  sortOrder?: number;
  caption?: string;
};

// GET /api/events - public, published events only
router.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Math.min(Number(req.query.pageSize) || 20, 50);

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          eventDate: "asc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          media: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      }),

      prisma.event.count({
        where: {
          status: "PUBLISHED",
        },
      }),
    ]);

    return ok(res, items, "OK", {
      page,
      pageSize,
      total,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/admin/all - admin list, all statuses
router.get(
  "/admin/all",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Math.min(Number(req.query.pageSize) || 20, 100);

      const [items, total] = await Promise.all([
        prisma.event.findMany({
          orderBy: {
            eventDate: "desc",
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            media: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        }),

        prisma.event.count(),
      ]);

      return ok(res, items, "OK", {
        page,
        pageSize,
        total,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/events/:slug - public single event
router.get("/:slug", async (req, res, next) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        slug: req.params.slug,
        status: "PUBLISHED",
      },
      include: {
        media: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!event) {
      return fail(res, 404, "Event not found");
    }

    return ok(res, event);
  } catch (err) {
    next(err);
  }
});

// POST /api/events - admin create
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const body = req.body;

      // Validate event fields
      const input = eventSchema
        .omit({ media: true })
        .parse(body);

      // Validate media
      const media: EventMediaInput[] = Array.isArray(body.media)
        ? body.media.map((item: unknown) =>
            eventMediaSchema.parse(item)
          )
        : [];

      const event = await prisma.event.create({
        data: {
          ...input,

          media: {
            create: media.map((item: EventMediaInput, index: number) => ({
              type: item.type,
              url: item.url,
              publicId: item.publicId || null,
              sortOrder: Number(item.sortOrder ?? index),
              caption: item.caption || null,
            })),
          },
        },

        include: {
          media: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

      return created(res, event);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/events/admin/:id - admin update
router.put(
  "/admin/:id",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const id = String(req.params.id);
      const body = req.body;

      // Validate event fields
      const input = eventSchema
        .omit({ media: true })
        .partial()
        .parse(body);

      // Validate media only when supplied
      const media: EventMediaInput[] | null = Array.isArray(body.media)
        ? body.media.map((item: unknown) =>
            eventMediaSchema.parse(item)
          )
        : null;

      const existing = await prisma.event.findUnique({
        where: { id },
      });

      if (!existing) {
        return fail(res, 404, "Event not found");
      }

      const event = await prisma.$transaction(async (tx) => {
        await tx.event.update({
          where: { id },
          data: input,
        });

        // Replace media only when media is provided
        if (media !== null) {
          await tx.eventMedia.deleteMany({
            where: {
              eventId: id,
            },
          });

          if (media.length > 0) {
            await tx.eventMedia.createMany({
              data: media.map(
                (item: EventMediaInput, index: number) => ({
                  eventId: id,
                  type: item.type,
                  url: item.url,
                  publicId: item.publicId || null,
                  sortOrder: Number(item.sortOrder ?? index),
                  caption: item.caption || null,
                })
              ),
            });
          }
        }

        return tx.event.findUnique({
          where: { id },

          include: {
            media: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        });
      });

      return ok(res, event, "Event updated");
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/events/admin/:id - admin delete
router.delete(
  "/admin/:id",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      const id = String(req.params.id);

      await prisma.event.delete({
        where: { id },
      });

      return ok(res, null, "Event deleted");
    } catch (err) {
      next(err);
    }
  }
);

export default router;