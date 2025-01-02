import { z } from '@validation/util/validation';

export const envSchema = z.object({
  API_BASE_URL: z.string().default('http://localhost:8000'),
  PORT: z.string().default('8000'),

  // postgres
  DATABASE_URL: z
    .string()
    .default('postgresql://pets:pets@localhost:5432/pets?schema=public'),

  // redis
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // session auth
  SESSION_SECRET: z.string().default('pets'),

  // ONLY set in deployed environments
  SESSION_DOMAIN: z.string().optional(),

  // Runtime
  DEPLOYED_AT: z.string().default(new Date().getTime().toString()),
  DEPLOYED_BY: z.string().default('luke-h1'),
  ENVIRONMENT: z.string().default('local'),

  // AWS s3 assets
  S3_ASSETS_BUCKET: z.string(),
  S3_ASSETS_BUCKET_REGION: z.string().default('eu-west-2'),
  S3_ASSETS_ACCESS_KEY_ID: z.string(),
  S3_ASSETS_SECRET_ACCESS_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
