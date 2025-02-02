import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8),
});

export const loginResponseSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  username: z.string(),
  role: z.string(),
  authToken: z.string(),
  refreshToken: z.string(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
