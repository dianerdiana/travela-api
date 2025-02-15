import { UserStatus } from '@common/types/user-status.type';
import { z } from 'zod';

export const createUserSchema = z.object({
  avatar: z
    .any()
    .refine((file) => file && file.mimetype.startsWith('image/'), {
      message: 'File must be an image.',
    })
    .refine((file) => file && file.size <= 2 * 1024 * 1024, {
      message: 'Max file size is 2MB.',
    }),
  fullName: z.string().min(3),
  phone: z.string().min(10),
  email: z.string().email(),
  username: z.string().min(4),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  status: z.nativeEnum(UserStatus),
});

export const createUserResponseSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  username: z.string(),
  status: z.string(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type CreateUserResponseDto = z.infer<typeof createUserResponseSchema>;
