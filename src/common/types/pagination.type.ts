import { z } from 'zod';

export const paginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Page harus angka positif',
    }),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Limit harus angka positif',
    }),
  sort: z.enum(['asc', 'desc']),
  column: z.string(),
  search: z
    .string()
    .optional()
    .transform((val) => val || ''),
  filters: z.array(z.record(z.any())).optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;
