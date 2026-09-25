import { Router } from "express";
import { prisma } from "../lib/prisma";
import { ok } from "../lib/response";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth";

const router = Router();

// GET /api/dashboard/stats - admin overview counts (ADMIN + STAFF)
router.get("/stats", requireAuth, requireRole("ADMIN", "STAFF"), async (req: AuthedRequest, res, next) => {
  try {
    const [totalGrievances, openGrievances, resolvedGrievances, totalPosts, publishedPosts, newMessages] =
      await Promise.all([
        prisma.grievance.count(),
        prisma.grievance.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS", "NEED_MORE_INFO"] } } }),
        prisma.grievance.count({ where: { status: { in: ["RESOLVED", "CLOSED"] } } }),
        prisma.post.count(),
        prisma.post.count({ where: { status: "PUBLISHED" } }),
        prisma.contactMessage.count(),
      ]);

    const recentGrievances = await prisma.grievance.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, referenceNumber: true, subject: true, status: true, category: true, createdAt: true },
    });

    return ok(res, {
      totalGrievances,
      openGrievances,
      resolvedGrievances,
      totalPosts,
      publishedPosts,
      newMessages,
      recentGrievances,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
