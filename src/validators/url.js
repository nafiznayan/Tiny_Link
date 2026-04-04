import { z } from "zod";

// POST /api/v1/urls — body
export const createUrl = z.object({
  originalUrl: z
    .string({ required_error: "originalUrl is required" })
    .url("Must be a valid URL"),
});

// Params for routes that take :shortCode
export const shortCodeParams = z.object({
  shortCode: z
    .string({ required_error: "shortCode is required" })
    .min(1, "shortCode cannot be empty"),
});

// GET /api/v1/urls — query
export const urlListQuery = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional(),
});
