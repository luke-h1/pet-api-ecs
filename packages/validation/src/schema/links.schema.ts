import { z } from '@validation/util/validation';

export const linksSchema = z.object({
  self: z.object({
    url: z.string().url(),
    method: z.string().optional(),
  }),
});

export const paginatedLinksSchema = linksSchema.extend({
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    order: z.enum(['desc', 'asc']).optional(),
  }),
  page: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
});

export type PaginatedLinks = z.infer<typeof paginatedLinksSchema>;
