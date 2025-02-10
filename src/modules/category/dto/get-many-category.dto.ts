import { z } from 'zod';

export const getManyCategoryResponse = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  iconUrl: z.string(),
  status: z.string(),
});

export type GetManyCategoryResponseDto = z.infer<
  typeof getManyCategoryResponse
>;
