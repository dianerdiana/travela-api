import { z } from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  avatar: z.string(),
  username: z.string(),
  password: z.string().min(8),
});
