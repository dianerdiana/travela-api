import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});
