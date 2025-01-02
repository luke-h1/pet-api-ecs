import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { healthSchema } from '@validation/schema/health.schema';

const healthPaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/api/healthcheck',
    description: 'Get status of DB, cache and API',
    summary: 'Health check of DB, cache and API',
    responses: {
      200: {
        description: 'DB, API and cache are OK',
        content: {
          'application/json': {
            schema: healthSchema,
          },
        },
      },
      500: {
        description:
          'Either the API has failed to start or the database/cache cannot be reached',
        content: {
          'application/json': {
            schema: healthSchema,
          },
          'application/xml': {
            schema: healthSchema,
          },
        },
      },
    },
    tags: ['health'],
  });
};
export default healthPaths;
