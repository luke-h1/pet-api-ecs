import { db } from '@api/db/prisma';
import { authErrorCodes } from '@api/errors/auth';
import { faker } from '@faker-js/faker';
import { CreateUserInput } from '@validation/schema/auth.schema';
import AuthService from '../auth.service';

describe('AuthService', () => {
  const authService = new AuthService();

  describe('register', () => {
    test('registers new user', async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };

      const result = await authService.register(user);

      expect(result).toEqual({
        id: expect.any(String),
        email: expect.any(String),
      });
    });

    test(`returns ${authErrorCodes.EmailAlreadyExists} exception if user exists`, async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      await db.user.create({
        data: {
          ...user,
        },
      });
      await authService.register(user);
      const result = await authService.register(user);
      expect(result).toEqual(authErrorCodes.EmailAlreadyExists);
    });
  });

  describe('login', () => {
    test('authenticates existing user', async () => {
      const user: CreateUserInput['body'] = {
        email: faker.internet.email(),
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      await authService.register(user);

      const result = await authService.login({
        email: user.email,
        password: user.password,
      });

      expect(result).toEqual({
        createdAt: expect.anything(),
        email: user.email,
        firstName: user.firstName,
        id: expect.any(String),
        lastName: user.lastName,
        role: 'USER',
      });
    });

    test(`throws ${authErrorCodes.InvalidCredentials} error if bad credentials are supplied`, async () => {
      const user: CreateUserInput['body'] = {
        email: faker.internet.email(),
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      await authService.register(user);

      const result = await authService.login({
        email: user.email,
        password: `${user.password}123`,
      });

      expect(result).toEqual(authErrorCodes.InvalidCredentials);
    });

    test(`throws ${authErrorCodes.UserNotFound} if no user is found`, async () => {
      const result = await authService.login({
        email: 'test@test.com',
        password: '123',
      });

      expect(result).toEqual(authErrorCodes.UserNotFound);
    });
  });

  describe('deleteAccount', () => {
    test('deletes account', async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      await authService.register(user);

      const u = await authService.login({
        email: user.email,
        password: user.password,
      });

      const result = await authService.deleteAccount((u as { id: string }).id);

      expect(result).toEqual(true);
    });
  });

  describe('me', () => {
    test('returns existing user', async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      const registerResult = await authService.register(user);

      if (typeof registerResult === 'string') {
        throw new Error('User registration failed');
      }

      const result = await authService.me(registerResult.id);

      expect(result).toEqual({
        email: 'bob@bob.com',
        firstName: 'bob',
        id: expect.any(String),
        lastName: 'bob',
        role: 'USER',
      });
    });

    test('404s if user does not exist', async () => {
      const result = await authService.me('123');

      expect(result).toEqual(authErrorCodes.UserNotFound);
    });
  });
});
