import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(3),
  slug: z.string(),
  icon: z
    .any()
    .refine((file) => file && file.mimetype.startsWith('image/'), {
      message: 'File harus berupa gambar',
    })
    .refine((file) => file && file.size <= 2 * 1024 * 1024, {
      message: 'Ukuran file maksimal 2MB',
    }),
});

export const createCategoryResponse = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  iconUrl: z.string(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type CreateCategoryResponse = z.infer<typeof createCategoryResponse>;
