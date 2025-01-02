import {
  DeleteUserInput,
  GetUserInput,
  PatchUserInput,
} from '@validation/schema/user.schema';
import { Request } from 'express';

export type GetUserRequest = Request<GetUserInput['params']>;

export type PatchUserRequest = Request<
  PatchUserInput['params'],
  {},
  PatchUserInput['body']
>;

export type DeleteUserRequest = Request<DeleteUserInput['params']>;
