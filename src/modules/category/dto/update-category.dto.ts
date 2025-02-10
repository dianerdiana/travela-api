import { CategoryStatus } from '@common/types/category-status.type';
import { z } from 'zod';

export const updateCategorySchema = z.object({
  name: z.string().min(3),
  slug: z.string(),
  status: z.nativeEnum(CategoryStatus),
});

export const updateCategoryResponse = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  iconUrl: z.string(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryResponse = z.infer<typeof updateCategoryResponse>;
