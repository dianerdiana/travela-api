import { z } from 'zod';

export const getManyUserResponseSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  username: z.string(),
  avatarUrl: z.string(),
});

export type GetManyUserResponseDto = z.infer<typeof getManyUserResponseSchema>;
