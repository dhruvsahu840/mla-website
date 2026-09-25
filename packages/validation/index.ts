import { z } from "zod";

export const grievanceCategories = [
  "road",
  "water",
  "electricity",
  "sanitation",
  "healthcare",
  "education",
  "public_safety",
  "other",
] as const;

export const createGrievanceSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email().optional().or(z.literal("")),
  category: z.enum(grievanceCategories),
  subject: z.string().min(5).max(150),
  description: z.string().min(10).max(3000),
  location: z.string().max(200).optional(),
  attachmentUrl: z.string().url().optional(),
});
export type CreateGrievanceInput = z.infer<typeof createGrievanceSchema>;

export const trackGrievanceSchema = z.object({
  referenceNumber: z.string().min(5),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  subject: z.string().max(150).optional(),
  message: z.string().min(10).max(2000),
});
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const postSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(10),
  coverImage: z.string().url().optional(),
  category: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});
export type PostInput = z.infer<typeof postSchema>;
