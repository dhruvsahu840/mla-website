import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { fail } from "../lib/response";

export interface AuthedRequest extends Request {
  admin?: { id: string; role: string; email: string; name?: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) return fail(res, 401, "Authentication required");
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string; name?: string };
    req.admin = payload;
    next();
  } catch {
    return fail(res, 401, "Invalid or expired session");
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) return fail(res, 401, "Authentication required");
    if (!roles.includes(req.admin.role)) return fail(res, 403, "Insufficient permissions");
    next();
  };
}

export { JWT_SECRET };
