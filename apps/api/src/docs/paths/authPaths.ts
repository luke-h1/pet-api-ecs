import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { userPayload } from '@validation/schema';
import { responseSchema } from '@validation/schema/response.schema';
import { z } from 'zod';

const authPaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/api/auth/me',
    description: 'Returns the current user',
    summary: 'Get current user',
    responses: {
      200: {
        description: 'Current user',
        content: {
          'application/json': {
            schema: userPayload.body.extend({
              role: z.enum(['USER', 'ADMIN', 'MODERATOR']),
            }),
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
      404: {
        description: 'User not found',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['auth'],
  });
  registry.registerPath({
    method: 'get',
    path: '/api/auth',
    description:
      'Returns a boolean indicating if the current user is authenticated',
    summary: 'Check if user is authenticated',
    responses: {
      200: {
        description: 'isAuth',
        content: {
          'application/json': {
            schema: z.object({
              isAuth: z.boolean(),
            }),
          },
        },
      },
    },
    tags: ['auth'],
  });

  registry.registerPath({
    method: 'post',
    path: '/api/auth/register',
    description: 'Register user',
    summary: 'Register a user',
    responses: {
      201: {
        description: 'User created',
        content: {
          'application/json': {
            schema: z.object({
              id: z.string(),
              email: z.string().email(),
            }),
          },
        },
      },
      400: {
        description: 'Validation errors occured',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['auth'],
  });

  registry.registerPath({
    method: 'post',
    path: '/api/auth/login',
    description: 'Logs in user',
    summary: 'Login user',
    responses: {
      200: {
        description: 'auth succesfull',
        content: {
          'application/json': {
            schema: z.object({
              id: z.string(),
              email: z.string(),
            }),
          },
        },
      },
      400: {
        description: 'Validation errors occured',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['auth'],
  });

  registry.registerPath({
    method: 'post',
    path: '/api/auth/logout',
    summary: 'Logout user',
    description: 'Logs out user and clears cookies from store',
    responses: {
      200: {
        description: 'Logout succesfull',
        content: {
          'application/json': {
            schema: z.object({}),
          },
        },
      },
    },
    tags: ['auth'],
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/auth/delete-account',
    description: 'Deletes account',
    summary: 'Delete your account',
    responses: {
      200: {
        description: 'Deleted account',
        content: {
          'application/json': {
            schema: z.object({ message: z.string() }),
          },
        },
      },
      400: {
        description: 'Failed to delete account',
        content: {
          'application/json': {
            schema: z.object({ message: z.string() }),
          },
        },
      },
    },
    tags: ['auth'],
  });
};
export default authPaths;
