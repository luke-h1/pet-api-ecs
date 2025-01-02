import { z } from '@validation/util/validation';

export const versionSchema = z
  .object({
    deployedAt: z.string(),
    deployedBy: z.string(),
    gitSha: z.string(),
  })
  .strict();

export type VersionSchema = z.infer<typeof versionSchema>;
