import { z } from 'zod';

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
  IMAGEKIT_PUBLIC_KEY: z.string(),
  IMAGEKIT_PRIVATE_KEY: z.string(),
  IMAGEKIT_URL_ENDPOINT: z.string(),
  IMAGEKIT_BASE_FOLDER: z.string(),
});

// Tipe untuk Environment Variables
export type EnvVariables = z.infer<typeof envSchema>;
