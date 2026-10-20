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

    await prisma.$executeRaw`
      INSERT INTO contact_messages
        (id, name, email, phone, subject, message, createdAt)
      VALUES
        (${`cm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`},
         ${input.name},
         ${input.email || null},
         ${input.phone || null},
         ${input.subject || null},
         ${input.message},
         NOW())
    `;

    return created(res, null, "Message sent. We will get back to you soon.");
  } catch (err) {
    next(err);
  }
});

router.get(
  "/admin/all",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  async (req: AuthedRequest, res, next) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));

      const items = await prisma.$queryRaw<
        {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          subject: string | null;
          message: string;
          createdAt: Date;
        }[]
      >`
        SELECT id, name, email, phone, subject, message, createdAt
        FROM contact_messages
        ORDER BY createdAt DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `;

      const countResult = await prisma.$queryRaw<{ total: bigint }[]>`
        SELECT COUNT(*) AS total FROM contact_messages
      `;

      return ok(
        res,
        items,
        "OK",
        { page, pageSize, total: Number(countResult[0]?.total ?? 0) }
      );
    } catch (err) {
      next(err);
    }
  }
);

export default router;