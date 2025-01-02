import { faker } from '@faker-js/faker';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { CreateUserInput, LoginUserInput } from '@validation/schema';
import { User } from '@validation/schema/user.schema';
import crypto from 'crypto';
import { v4 } from 'uuid';

export interface Dictionary<T> {
  [key: string]: T;
}

export const createUser = async (
  request: APIRequestContext,
): Promise<{
  response: Omit<User, 'password'>;
  userPassword: string;
}> => {
  const randomPassword = crypto.randomBytes(20).toString('hex');

  const u: CreateUserInput['body'] = {
    firstName: `TEST_USER-${faker.person.firstName()}-${faker.animal.bear()}`,
    lastName: `TEST_USER-${faker.person.lastName()}-${faker.animal.bear()}`,
    email: `TEST_USER-${v4()}@test-email.com`,
    password: randomPassword,
  };

  const created = await request.post('/api/auth/register', {
    data: {
      ...u,
    },
  });
  expect(created.status()).toEqual(201);
  const response = await created.json();

  return {
    response,
    userPassword: u.password,
  };
};

export const loginUser = async (
  { email, password }: LoginUserInput['body'],
  request: APIRequestContext,
): Promise<APIResponse> => {
  const result = await request.post('/api/auth/login', {
    data: {
      email,
      password,
    },
  });

  expect(result.status()).toBe(200);
  return result;
};

export const getCookieFromHeaders = async (headers: Dictionary<string>) => {
  // due to the presence of other set-cookie headers from cf, aws ALB, etc
  // we need different logic for local vs deployed

  if (process.env.API_BASE_URL !== 'http://localhost:8000') {
    const cookieValue = headers['set-cookie'][0]
      .split(';')[0]
      .split('=')[1] as string;

    return cookieValue as string;
  }

  return headers['set-cookie'][0].split(';')[0].split('=')[1] as string;
};
