import { PackageTourStatus } from '@common/types/package-tour-status.type';
import { z } from 'zod';

export const createPackageTourSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string(),
  price: z.number(),
  days: z.number(),
  isRecommended: z.boolean(),
  city: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  status: z.nativeEnum(PackageTourStatus),
  categories: z.array(z.number()).optional().nullable(),
});

export const createPackageTourResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type CreatePackageTourDto = z.infer<typeof createPackageTourSchema>;
export type CreatePackageTourResponseDto = z.infer<typeof createPackageTourResponseSchema>;
