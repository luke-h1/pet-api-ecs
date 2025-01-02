import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const imagePaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'post',
    path: '/api/image',
    description: 'Upload images',
    summary: 'Upload images to S3 for use in pet profiles',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              image: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Image uploaded to S3 succesfully',
        content: {
          'application/json': {
            schema: z.object({
              images: z.array(z.string()),
            }),
          },
        },
      },
      400: {
        description: 'Invalid image format',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
    tags: ['image'],
  });
};
export default imagePaths;
