import { z } from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const registerSchema = z
  .object({
    avatar: z.string(),
    fullName: z.string(),
    phone: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
