import {
  CreatePetInput,
  DeletePetInput,
  GetPetInput,
  UpdatePetInput,
} from '@validation/schema/pet.schema';
import { Request } from 'express';

export type GetPetRequest = Request<GetPetInput['params']>;

export type CreatePetRequest = Request<{}, {}, CreatePetInput['body']>;

export type UpdatePetRequest = Request<
  UpdatePetInput['params'],
  {},
  UpdatePetInput['body']
>;

export type DeletePetReqeust = Request<DeletePetInput['params']>;
