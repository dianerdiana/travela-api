import { optional, z } from 'zod';

// Schema Validasi Environment Variables
export const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATIONS: z.string().optional(),
});

// Tipe untuk Environment Variables
export type EnvVariables = z.infer<typeof envSchema>;
