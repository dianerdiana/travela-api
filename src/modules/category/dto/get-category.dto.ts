import { z } from 'zod';

export const getCategoryResponse = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  status: z.string(),
});

export type GetManyCategoryResponseDto = z.infer<typeof getCategoryResponse>;
