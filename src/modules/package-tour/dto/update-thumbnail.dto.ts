import { z } from 'zod';

export const updateThumbnailSchema = z.object({
  icon: z
    .any()
    .refine((file) => file && file.mimetype.startsWith('image/'), {
      message: 'File must be an image.',
    })
    .refine((file) => file && file.size <= 2 * 1024 * 1024, {
      message: 'Max file size is 2MB.',
    }),
});

export type UpdateThumbnailDto = z.infer<typeof updateThumbnailSchema>;
export type UpdateThumbnailResponseDto = string;
