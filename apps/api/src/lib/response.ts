import { Response } from "express";

export function ok(res: Response, data: unknown, message = "OK", meta?: unknown) {
  return res.status(200).json({ success: true, message, data, errors: null, meta: meta ?? null });
}

export function created(res: Response, data: unknown, message = "Created") {
  return res.status(201).json({ success: true, message, data, errors: null, meta: null });
}

export function fail(res: Response, status: number, message: string, errors?: unknown) {
  return res.status(status).json({ success: false, message, data: null, errors: errors ?? null, meta: null });
}
