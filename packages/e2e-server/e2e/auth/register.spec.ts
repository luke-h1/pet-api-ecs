import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { CreateUserInput } from '@validation/schema';
import { createUser } from '../util/user';

test.describe('register', () => {
  test('registers new user', async ({ request }) => {
    const { response: createUserResponse } = await createUser(request);

    expect(createUserResponse).toEqual({
      email: createUserResponse.email,
      id: expect.any(String),
    });
  });

  test('returns validation error when email is invalid', async ({
    request,
  }) => {
    const u: CreateUserInput['body'] = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: 'invalid-email',
      password: faker.internet.password(),
    };

    const result = await request.post('/api/auth/register', {
      data: {
        ...u,
      },
    });

    expect(result.status()).toBe(400);
    const response = await result.json();
    expect(response).toEqual({
      errors: [
        {
          code: 'invalid_string',
          message: 'Invalid email',
          path: ['body', 'email'],
          validation: 'email',
        },
      ],
      message: 'Validation failed',
      status: 'error',
    });
  });

  test('returns validation error when user already exists', async ({
    request,
  }) => {
    const u: CreateUserInput['body'] = {
      firstName: 'bob',
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const created = await request.post('/api/auth/register', {
      data: {
        ...u,
      },
    });
    expect(created.status()).toBe(201);

    const result = await request.post('/api/auth/register', {
      data: {
        ...u,
      },
    });

    expect(result.status()).toBe(400);
    const response = await result.json();
    expect(response).toEqual({
      code: 'EmailAlreadyExists',
      errors: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Email already exists',
          path: ['body', 'email'],
          received: 'undefined',
        },
      ],
      message: 'Email already exists',
      statusCode: 400,
      title: 'Email already exists',
      type: 'Bad request',
    });
  });
});
