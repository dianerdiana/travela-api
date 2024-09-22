import { z } from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const registerSchema = z
  .object({
    avatar: z.string({ required_error: "Avatar is required." }).optional(),
    fullName: z.string({ required_error: "Full Name is required." }),
    phone: z.string({ required_error: "Phone Number is required." }),
    email: z.string({ required_error: "Email is required." }).email("Email is not valid."),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password length at least must be 6."),
    confirmPassword: z.string({ required_error: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
