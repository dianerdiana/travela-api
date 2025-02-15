import { z } from 'zod';

export const getManyPackageTourSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  thumbnailUrl: z.string(),
  price: z.string(),
  isRecommended: z.boolean(),
  city: z.string(),
  country: z.string(),
  status: z.string(),
  categories: z.array(z.number()).optional().nullable(),
});

export type GetManyPackageTourResponseDto = z.infer<typeof getManyPackageTourSchema>;
