import { z } from 'zod';

export const createPackageTourSchema = z.object({
  name: z.string().min(3).max(255),
  thumbnail: z
    .any()
    .refine((file) => file && file.mimetype.startsWith('image/'), {
      message: 'File must be an image.',
    })
    .refine((file) => file && file.size <= 2 * 1024 * 1024, {
      message: 'Max file size is 2MB.',
    }),
  price: z.number(),
  days: z.number(),
  isRecommended: z.boolean(),
  city: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  categories: z.array(z.number()).optional().nullable(),
});

export const createPackageTourResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type CreatePackageTourDto = z.infer<typeof createPackageTourSchema>;
export type CreatePackageTourResponseDto = z.infer<typeof createPackageTourResponseSchema>;
