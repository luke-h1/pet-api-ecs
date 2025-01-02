import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  linksSchema,
  paginatedLinksSchema,
} from '@validation/schema/links.schema';
import { petSchema, createPetSchema } from '@validation/schema/pet.schema';
import { responseSchema } from '@validation/schema/response.schema';
import { z } from 'zod';

const registerPetPaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/api/pets',
    description: 'Get all pets',
    summary: 'Fetches all pets',
    request: {
      query: z.object({
        page: z.number().optional(),
        pageSize: z.number().optional(),
        order: z.enum(['asc', 'desc']).optional(),
      }),
    },
    responses: {
      200: {
        description: 'List of pets',
        content: {
          'application/json': {
            schema: z.object({
              pets: petSchema.array(),
              _links: linksSchema,
              paging: paginatedLinksSchema,
            }),
          },
        },
      },
      404: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['pets'],
  });

  registry.registerPath({
    method: 'get',
    path: '/api/pets/{id}',
    description: 'Get pet by id',
    summary: 'Fetches a pet by id',
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Pet found',
        content: {
          'application/json': {
            schema: petSchema,
          },
        },
      },
      404: {
        description: 'Pet not found',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['pets'],
  });

  registry.registerPath({
    method: 'post',
    path: '/api/pets',
    description: 'Create a pet',
    summary: 'Create a pet',
    request: {
      body: {
        content: {
          'application/json': {
            schema: createPetSchema,
          },
        },
      },
      cookies: z.object({
        'connect.sid': z.string(),
      }),
    },
    responses: {
      201: {
        description: 'Pet created',
        content: {
          'application/json': {
            schema: petSchema,
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['pets'],
  });

  registry.registerPath({
    method: 'put',
    path: '/api/pets/{id}',
    description: 'Update a pet',
    summary: 'Update a pet',
    request: {
      params: z.object({ id: z.string() }),
      cookies: z.object({
        'connect.sid': z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Pet updated',
        content: {
          'application/json': {
            schema: petSchema,
          },
        },
      },
      404: {
        description: 'pet not found',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['pets'],
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/pets/{id}',
    description: 'delete a pet',
    summary: 'Delete a pet',
    request: {
      params: z.object({ id: z.string() }),
      cookies: z.object({
        'connect.sid': z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Pet deleted',
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },

      404: {
        description: 'Pet not found',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['pets'],
  });
};
export default registerPetPaths;
