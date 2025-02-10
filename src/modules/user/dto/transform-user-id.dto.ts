import { z } from 'zod';

export const transformUserIdSchema = z
  .string()
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val) && val > 0, {
    message: 'User ID harus angka positif',
  });

export type TransformUserIdDto = z.infer<typeof transformUserIdSchema>;
