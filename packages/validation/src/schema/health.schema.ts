import { z } from '@validation/util/validation';

export const healthSchema = z.object({
  db: z.boolean(),
  cache: z.boolean(),
  status: z.string(),
});
