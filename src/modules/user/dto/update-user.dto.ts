import { z } from 'zod';

export const updateUserSchema = z.object({
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
