import { z } from 'zod';

export const transformPackageTourIdSchema = z
  .string()
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val) && val > 0, {
    message: 'Category ID harus angka positif',
  });

export type TransformPackageTourIdDto = z.infer<typeof transformPackageTourIdSchema>;
