import {
  CreateUserInput,
  LoginUserInput,
} from '@validation/schema/auth.schema';
import { ServerValidationError } from '@validation/schema/response.schema';
import { User } from '@validation/schema/user.schema';
import { petApi } from './api';

const authService = {
  isAuth: async (): Promise<{ isAuth: boolean }> => {
    return petApi.get('/auth');
  },
  register: async (input: CreateUserInput['body']) => {
    return petApi.post<Omit<User, 'password'> | ServerValidationError>(
      '/auth/register',
      input,
    );
  },
  login: async (input: LoginUserInput['body']) => {
    return petApi.post<Omit<User, 'password'> | ServerValidationError>(
      '/auth/login',
      input,
    );
  },
  logout: async (): Promise<void> => {
    return petApi.post('/auth/logout');
  },
  me: async (): Promise<User> => {
    return petApi.get('/auth/me');
  },
} as const;

export default authService;
