import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { adminLoginSchema } from "@mla/validation";
import { prisma } from "../lib/prisma";
import { ok, fail } from "../lib/response";
import {
  JWT_SECRET,
  requireAuth,
  requireRole,
  AuthedRequest,
} from "../middleware/auth";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || admin.status !== "ACTIVE") {
      return fail(res, 401, "Invalid credentials");
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);

    if (!valid) {
      return fail(res, 401, "Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role,
        email: admin.email,
        name: admin.name,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    });

    return ok(
      res,
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      "Logged in"
    );
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
});
  return ok(res, null, "Logged out");
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  return ok(res, req.admin);
});

// POST /api/auth/staff - ADMIN creates a new staff or admin account
router.post(
  "/staff",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      const { name, email, password, role } = req.body as {
        name: string;
        email: string;
        password: string;
        role: "ADMIN" | "STAFF";
      };

      if (!name || !email || !password || password.length < 8) {
        return fail(
          res,
          400,
          "नाम, ईमेल और कम से कम 8 अक्षरों का पासवर्ड आवश्यक है"
        );
      }

      const existing = await prisma.adminUser.findUnique({
        where: { email },
      });

      if (existing) {
        return fail(res, 409, "इस ईमेल से पहले से खाता मौजूद है");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.adminUser.create({
        data: {
          name,
          email,
          passwordHash,
          role: role === "ADMIN" ? "ADMIN" : "STAFF",
        },
      });

      return ok(
        res,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        "खाता बनाया गया"
      );
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/staff - ADMIN lists all staff/admin accounts
router.get(
  "/staff",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      const users = await prisma.adminUser.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return ok(res, users);
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/auth/staff/:id/status - ADMIN enables/disables a staff account
router.patch(
  "/staff/:id/status",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      const { status } = req.body as {
        status: "ACTIVE" | "DISABLED";
      };

      const id = String(req.params.id);

      if (id === req.admin!.id) {
        return fail(
          res,
          400,
          "आप अपना खुद का खाता निष्क्रिय नहीं कर सकते"
        );
      }

      const user = await prisma.adminUser.update({
        where: { id },
        data: { status },
      });

      return ok(
        res,
        {
          id: user.id,
          status: user.status,
        },
        "स्थिति अपडेट की गई"
      );
    } catch (err) {
      next(err);
    }
  }
);

export default router;