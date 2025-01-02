import { UserWithoutPrismaKeys } from '@api/controllers/__mocks__/user';
import { db } from '@api/db/prisma';
import { userErrorCodes } from '@api/errors/user';
import { faker } from '@faker-js/faker';
import { Role } from '@prisma/client';
import { PatchUserInput } from '@validation/schema/user.schema';
import UserService from '../user.service';

const testUsers: UserWithoutPrismaKeys[] = [
  {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    role: Role.USER,
  },
  {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    role: Role.USER,
  },
  {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    role: Role.USER,
  },
];

describe('userService', () => {
  let userService: UserService;

  beforeAll(() => {
    userService = new UserService();
  });

  describe('getUsers', () => {
    test('gets users from the DB', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const users = await userService.getUsers(1, 100, undefined);
      expect(users).toEqual([
        {
          createdAt: expect.any(Date),
          email: testUsers[0].email,
          firstName: testUsers[0].firstName,
          id: expect.any(String),
          lastName: testUsers[0].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
        {
          createdAt: expect.any(Date),
          email: testUsers[1].email,
          firstName: testUsers[1].firstName,
          id: expect.any(String),
          lastName: testUsers[1].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
        {
          createdAt: expect.any(Date),
          email: testUsers[2].email,
          firstName: testUsers[2].firstName,
          id: expect.any(String),
          lastName: testUsers[2].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
      ]);
      expect(users).toHaveLength(3);
    });

    test('gets users from the cache on second call', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const dbUsers = await userService.getUsers(1, 100, undefined);
      expect(dbUsers).toEqual([
        {
          createdAt: expect.any(Date),
          email: testUsers[0].email,
          firstName: testUsers[0].firstName,
          id: expect.any(String),
          lastName: testUsers[0].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
        {
          createdAt: expect.any(Date),
          email: testUsers[1].email,
          firstName: testUsers[1].firstName,
          id: expect.any(String),
          lastName: testUsers[1].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
        {
          createdAt: expect.any(Date),
          email: testUsers[2].email,
          firstName: testUsers[2].firstName,
          id: expect.any(String),
          lastName: testUsers[2].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
      ]);

      const secondUsers = await userService.getUsers(1, 100, undefined);
      expect(secondUsers).toEqual([
        {
          createdAt: expect.any(String),
          email: testUsers[0].email,
          firstName: testUsers[0].firstName,
          id: expect.any(String),
          lastName: testUsers[0].lastName,
          role: 'USER',
          updatedAt: expect.any(String),
        },
        {
          createdAt: expect.any(String),
          email: testUsers[1].email,
          firstName: testUsers[1].firstName,
          id: expect.any(String),
          lastName: testUsers[1].lastName,
          role: 'USER',
          updatedAt: expect.any(String),
        },
        {
          createdAt: expect.any(String),
          email: testUsers[2].email,
          firstName: testUsers[2].firstName,
          id: expect.any(String),
          lastName: testUsers[2].lastName,
          role: 'USER',
          updatedAt: expect.any(String),
        },
      ]);
      expect(secondUsers).toHaveLength(3);
    });

    test('subsequent requests gets users from cache and not DB', async () => {
      await db.user.createMany({
        data: testUsers,
      });
      const dbUsers = await userService.getUsers(1, 100, undefined);

      const expectedDbResult = [
        {
          createdAt: expect.any(Date),
          email: testUsers[0].email,
          firstName: testUsers[0].firstName,
          id: expect.any(String),
          lastName: testUsers[0].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
        {
          createdAt: expect.any(Date),
          email: testUsers[1].email,
          firstName: testUsers[1].firstName,
          id: expect.any(String),
          lastName: testUsers[1].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
        {
          createdAt: expect.any(Date),
          email: testUsers[2].email,
          firstName: testUsers[2].firstName,
          id: expect.any(String),
          lastName: testUsers[2].lastName,
          role: 'USER',
          updatedAt: expect.any(Date),
        },
      ];

      expect(dbUsers).toEqual(expectedDbResult);
      expect(dbUsers).toHaveLength(3);

      const expectedCacheResult = [
        {
          createdAt: expect.any(String),
          email: testUsers[0].email,
          firstName: testUsers[0].firstName,
          id: expect.any(String),
          lastName: testUsers[0].lastName,
          role: 'USER',
          updatedAt: expect.any(String),
        },
        {
          createdAt: expect.any(String),
          email: testUsers[1].email,
          firstName: testUsers[1].firstName,
          id: expect.any(String),
          lastName: testUsers[1].lastName,
          role: 'USER',
          updatedAt: expect.any(String),
        },
        {
          createdAt: expect.any(String),
          email: testUsers[2].email,
          firstName: testUsers[2].firstName,
          id: expect.any(String),
          lastName: testUsers[2].lastName,
          role: 'USER',
          updatedAt: expect.any(String),
        },
      ];

      for (let i = 0; i < 5; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const result = await userService.getUsers(1, 100, undefined);
        expect(result).toEqual(expectedCacheResult);
        expect(result).not.toEqual(expectedDbResult);
        expect(expectedCacheResult).toHaveLength(3);
      }
    });

    test('returns empty array when not found', async () => {
      const result = await userService.getUsers(1, 100, undefined);
      expect(result).toEqual([]);
    });
  });

  describe('getUser', () => {
    test('getUser returns user from db', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const users = await db.user.findMany();
      const user1Id = users[0].id;
      const result = await userService.getUser(user1Id);
      expect(result).toEqual({
        createdAt: expect.any(Date),
        email: users[0].email,
        firstName: users[0].firstName,
        id: users[0].id,
        lastName: users[0].lastName,
        role: users[0].role,
        updatedAt: expect.any(Date),
      });
    });
    test('getUser returns user from cache', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const users = await db.user.findMany();
      const user1Id = users[0].id;

      await userService.getUser(user1Id);

      const cachedResult = await userService.getUser(user1Id);

      expect(cachedResult).toEqual({
        createdAt: expect.any(String),
        email: users[0].email,
        firstName: users[0].firstName,
        id: users[0].id,
        lastName: users[0].lastName,
        role: users[0].role,
        updatedAt: expect.any(String),
      });
    });

    test('subsequent requests gets users from cache and not DB', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const users = await db.user.findMany();
      const user1Id = users[0].id;

      const dbUser = await userService.getUser(user1Id);

      const expectedDbResult = {
        createdAt: expect.any(Date),
        email: users[0].email,
        firstName: users[0].firstName,
        id: users[0].id,
        lastName: users[0].lastName,
        role: users[0].role,
        updatedAt: expect.any(Date),
      };

      expect(dbUser).toEqual(expectedDbResult);

      for (let i = 0; i < 5; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const cachedUser = await userService.getUser(user1Id);
        expect(cachedUser).not.toEqual(expectedDbResult);

        expect(cachedUser).toEqual({
          createdAt: expect.any(String),
          email: users[0].email,
          firstName: users[0].firstName,
          id: users[0].id,
          lastName: users[0].lastName,
          role: users[0].role,
          updatedAt: expect.any(String),
        });
      }
    });
  });

  describe('updateUser', () => {
    test('updateUser updates user', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const users = await db.user.findMany();
      const user1Id = users[0].id;

      const updatedBody: PatchUserInput['body'] = {
        email: users[0].email,
        firstName: 'bob',
        lastName: 'bob',
      };

      const expected = {
        createdAt: expect.any(Date),
        email: users[0].email,
        firstName: updatedBody.firstName,
        id: user1Id,
        lastName: updatedBody.lastName,
        role: 'USER',
        updatedAt: expect.any(Date),
      };

      const updatedResult = await userService.updateUser(user1Id, updatedBody);
      expect(updatedResult).toEqual(expected);

      const newResult = await userService.getUser(user1Id);
      expect(newResult).toEqual(expected);
    });

    test('updateUser doesnt update user if not found', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const users = await db.user.findMany();
      const user1Id = '12345';

      const updatedBody: PatchUserInput['body'] = {
        email: users[0].email,
        firstName: 'bob',
        lastName: 'bob',
      };

      const result = await userService.updateUser(user1Id, updatedBody);
      expect(result).toEqual(userErrorCodes.userNotFound);
    });
  });
  describe('deleteUser', () => {
    test('deleteUser deletes user', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const users = await db.user.findMany();

      const user1Id = users[0].id;

      const result = await userService.deleteUser(user1Id);
      expect(result).toEqual(null);
    });

    test('deleteUser 404s', async () => {
      await db.user.createMany({
        data: testUsers,
      });

      const user1Id = '1234';

      const result = await userService.deleteUser(user1Id);
      expect(result).toEqual(null);
    });
  });
});
