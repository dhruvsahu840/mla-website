import { Router } from "express";

import { prisma } from "../lib/prisma";

import { ok, fail } from "../lib/response";

import {
  requireAuth,
  requireRole,
  AuthedRequest,
} from "../middleware/auth";

const router = Router();

// GET /api/settings
router.get("/", async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany();

    return ok(res, settings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings/:key
router.put(
  "/:key",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      // Convert Express route parameter to a normal string
      const key = String(req.params.key);

      const { value } = req.body;

      if (value === undefined) {
        return fail(res, 400, "Value is required");
      }

      const setting = await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });

      return ok(res, setting, "Setting updated");
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/settings
router.put(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthedRequest, res, next) => {
    try {
      const settings = req.body;

      if (!settings || typeof settings !== "object") {
        return fail(res, 400, "Invalid settings");
      }

      const results = [];

      for (const [key, value] of Object.entries(settings)) {
        const setting = await prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });

        results.push(setting);
      }

      return ok(res, results, "Settings updated");
    } catch (err) {
      next(err);
    }
  }
);

export default router;