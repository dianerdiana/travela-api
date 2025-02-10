import { z } from 'zod';

export const transformCategoryIdSchema = z
  .string()
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val) && val > 0, {
    message: 'Category ID harus angka positif',
  });

export type TransformUserIdDto = z.infer<typeof transformCategoryIdSchema>;
