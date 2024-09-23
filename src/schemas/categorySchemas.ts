import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  slug: z.string({ required_error: "Slug is required" }),
  icon: z.string().optional().nullable(),
});

export const updateCategorySchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  slug: z.string({ required_error: "Slug is required" }),
  icon: z.string().optional().nullable(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
