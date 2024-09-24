import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  icon: z.string().optional().nullable(),
});

export const updateCategorySchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  icon: z.string().optional().nullable(),
});

export const paginationCategorySchema = z.object({
  page: z.string().default("1"),
  pageSize: z.string().default("10"),
  sort: z.string().default("name"),
  order: z.string().default("asc"),
  search: z.string().optional().nullable(),
});

export const deleteCategorySchema = z.object({
  categoryIds: z
    .array(z.number(), { required_error: "Selected category min. 1" })
    .min(1, "Selected category min. 1"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type PaginationCategoryInput = z.infer<typeof paginationCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
