import { z } from 'zod';

export const updateUserSchema = z.object({
  userId: z.number(),
  avatar: z
    .any()
    .refine((file) => file && file.mimetype.startsWith('image/'), {
      message: 'File harus berupa gambar',
    })
    .refine((file) => file && file.size <= 2 * 1024 * 1024, {
      message: 'Ukuran file maksimal 2MB',
    }),
  fullName: z.string().min(3),
  phone: z.string().min(10),
  email: z.string().email(),
  username: z.string().min(4),
});

export const updateUserResponseSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  username: z.string(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UpdateUserResponseDto = z.infer<typeof updateUserResponseSchema>;
