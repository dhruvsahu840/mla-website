import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createGrievanceSchema,
  trackGrievanceSchema,
} from "@mla/validation";
import { prisma } from "../lib/prisma";
import { ok, created, fail } from "../lib/response";
import { generateReferenceNumber } from "../lib/reference";
import {
  requireAuth,
  requireRole,
  AuthedRequest,
} from "../middleware/auth";
import { z } from "zod";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

// POST /api/grievances - citizen submits a grievance
router.post("/", submitLimiter, async (req, res, next) => {
  try {
    const input = createGrievanceSchema.parse(req.body);
    const referenceNumber = generateReferenceNumber();

    const grievance = await prisma.grievance.create({
      data: {
        referenceNumber,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        category: input.category,
        subject: input.subject,
        description: input.description,
        location: input.location || null,
        attachmentUrl: input.attachmentUrl || null,
        updates: {
          create: {
            status: "SUBMITTED",
            message: "Grievance submitted by citizen.",
          },
        },
      },
    });

    return created(
      res,
      { referenceNumber: grievance.referenceNumber },
      "Grievance submitted successfully"
    );
  } catch (err) {
    next(err);
  }
});

// GET /api/grievances/track?referenceNumber=GRV-... - citizen tracks status
router.get("/track", async (req, res, next) => {
  try {
    const { referenceNumber } = trackGrievanceSchema.parse(req.query);

    const grievance = await prisma.grievance.findUnique({
      where: { referenceNumber },
      select: {
        referenceNumber: true,
        category: true,
        subject: true,
        status: true,
        priority: true,
        createdAt: true,
        updates: {
          orderBy: { createdAt: "asc" },
          select: {
            status: true,
            message: true,
            createdAt: true,
          },
        },
      },
    });

    if (!grievance) {
      return fail(
        res,
        404,
        "No grievance found with that reference number"
      );
    }

    return ok(res, grievance);
  } catch (err) {
    next(err);
  }
});

// GET /api/grievances - admin list (protected, ADMIN + STAFF)
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Math.min(
        Number(req.query.pageSize) || 20,
        100
      );

      const status = req.query.status as string | undefined;

      const where = status
        ? { status: status as any }
        : {};

      const [items, total] = await Promise.all([
        prisma.grievance.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),

        prisma.grievance.count({ where }),
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

// GET /api/grievances/:id - admin single grievance with full update history
router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const id = String(req.params.id);

      const grievance = await prisma.grievance.findUnique({
        where: { id },
        include: {
          updates: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!grievance) {
        return fail(res, 404, "Grievance not found");
      }

      return ok(res, grievance);
    } catch (err) {
      next(err);
    }
  }
);

const updateStatusSchema = z.object({
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "ASSIGNED",
    "IN_PROGRESS",
    "NEED_MORE_INFO",
    "RESOLVED",
    "CLOSED",
    "REJECTED",
  ]),
  message: z.string().min(3).max(1000),
});

// PATCH /api/grievances/:id/status - admin updates status (ADMIN + STAFF)
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const { status, message } = updateStatusSchema.parse(
        req.body
      );

      const id = String(req.params.id);

      const existing = await prisma.grievance.findUnique({
        where: { id },
      });

      if (!existing) {
        return fail(res, 404, "Grievance not found");
      }

      const grievance = await prisma.grievance.update({
        where: { id },
        data: {
          status,
          resolvedAt:
            status === "RESOLVED" || status === "CLOSED"
              ? new Date()
              : existing.resolvedAt,

          updates: {
            create: {
              status,
              message,
              updatedById: req.admin!.id,
            },
          },
        },
        include: {
          updates: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      return ok(res, grievance, "Status updated");
    } catch (err) {
      next(err);
    }
  }
);

export default router;