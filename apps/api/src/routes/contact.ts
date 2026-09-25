import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contactMessageSchema } from "@mla/validation";
import { prisma } from "../lib/prisma";
import { created, ok } from "../lib/response";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth";

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/", limiter, async (req, res, next) => {
  try {
    const input = contactMessageSchema.parse(req.body);
    await prisma.contactMessage.create({
      data: {
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        subject: input.subject || null,
        message: input.message,
      },
    });
    return created(res, null, "Message sent. We will get back to you soon.");
  } catch (err) {
    next(err);
  }
});

// GET /api/contact/admin/all - admin list of contact messages (ADMIN + STAFF)
router.get("/admin/all", requireAuth, requireRole("ADMIN", "STAFF"), async (req: AuthedRequest, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Math.min(Number(req.query.pageSize) || 20, 100);
    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contactMessage.count(),
    ]);
    return ok(res, items, "OK", { page, pageSize, total });
  } catch (err) {
    next(err);
  }
});

export default router;
