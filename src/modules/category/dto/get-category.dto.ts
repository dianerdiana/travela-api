import { z } from 'zod';

export const getCategoryResponse = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  iconUrl: z.string(),
  status: z.string(),
});

export type GetCategoryResponseDto = z.infer<typeof getCategoryResponse>;
