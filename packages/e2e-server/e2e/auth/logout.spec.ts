import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { CreateUserInput } from '@validation/schema';

test.describe('logout', () => {
  test('logs out authenticated user', async ({ request }) => {
    // arrange
    const u: CreateUserInput['body'] = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const created = await request.post('/api/auth/register', {
      data: {
        ...u,
      },
    });

    expect(created.status()).toEqual(201);

    const login = await request.post('/api/auth/login', {
      data: {
        email: u.email,
        password: u.password,
      },
    });

    expect(login.status()).toEqual(200);

    const cookie = login.headers()['set-cookie'][0].split(';')[0].split('=')[1];

    const result = await request.post('/api/auth/logout', {
      headers: {
        Cookie: cookie,
      },
    });

    expect(result.status()).toEqual(200);
  });
});
