import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { fail } from "../lib/response";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return fail(res, 400, "Validation failed", err.flatten());
  }
  // eslint-disable-next-line no-console
  console.error(`[error] ${req.method} ${req.path}:`, err);
  return fail(res, 500, "Something went wrong. Please try again later.");
}

export function notFound(req: Request, res: Response) {
  return fail(res, 404, "Resource not found");
}
