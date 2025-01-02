import { z } from '@validation/util/validation';

export const responseSchema = z.object({
  title: z.string(),
  type: z.string(),
  statusCode: z.number(),
  code: z.string(),
  message: z.string(),
  errors: z
    .array(
      z.object({
        code: z.string(),
        expected: z.string(),
        message: z.string(),
        path: z.array(z.string()),
        received: z.string(),
      }),
    )
    .optional(),
});
export type ServerValidationError = z.infer<typeof responseSchema>;
