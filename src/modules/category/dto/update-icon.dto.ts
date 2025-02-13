import { z } from 'zod';

export const updateIconSchema = z.object({
  icon: z
    .any()
    .refine((file) => file && file.mimetype.startsWith('image/'), {
      message: 'File harus berupa gambar',
    })
    .refine((file) => file && file.size <= 2 * 1024 * 1024, {
      message: 'Ukuran file maksimal 2MB',
    }),
});

export type UpdateIconDto = z.infer<typeof updateIconSchema>;
export type UpdateIconResponseDto = string;
