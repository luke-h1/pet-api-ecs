import { z } from '@validation/util/validation';

const ALLOWED_IMAGE_DOMAINS = [
  'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com',
];

export type Pet = z.infer<typeof petSchema>;

export const petSchema = z
  .object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    creatorId: z.string(),
    name: z.string({
      required_error: 'Name is required',
      description: 'Name of the pet',
    }),
    images: z.array(
      z.string().refine(s => {
        return ALLOWED_IMAGE_DOMAINS.every(domain => s.startsWith(domain));
      }),
    ),
    breed: z.string(),
    status: z.enum(['AVAILABLE', 'PENDING', 'ADOPTED']),
    birthDate: z.string(),
    age: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
  })
  .openapi('pet');

export const petPayload = {
  body: petSchema
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      creatorId: true,
    })
    .strict(),
};

const params = {
  params: z.object({
    id: z.string({
      required_error: 'ID is required',
      description: 'ID of the pet',
    }),
  }),
};

export const createPetSchema = z
  .object({
    ...petPayload,
  })
  .openapi({ description: 'createPetSchema' });

export const updatePetSchema = z
  .object({
    ...params,
    ...petPayload,
  })
  .openapi({ description: 'updatePetSchema' });

export const getPetSchema = z
  .object({
    ...params,
  })
  .openapi({ description: 'getPetSchema' });

export const deletePetSchema = z
  .object({
    ...params,
  })
  .openapi({ description: 'deletePetSchema' });

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type GetPetInput = z.infer<typeof getPetSchema>;
export type DeletePetInput = z.infer<typeof deletePetSchema>;
