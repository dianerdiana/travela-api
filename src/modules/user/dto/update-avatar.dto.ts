import { z } from 'zod';

export const updateAvatarSchema = z.object({
  avatar: z
    .any()
    .refine((file) => file && file.mimetype.startsWith('image/'), {
      message: 'File harus berupa gambar',
    })
    .refine((file) => file && file.size <= 2 * 1024 * 1024, {
      message: 'Ukuran file maksimal 2MB',
    }),
  avatarId: z.string(),
});

export type UpdateAvatarDto = z.infer<typeof updateAvatarSchema>;
