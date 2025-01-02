/* eslint-disable no-underscore-dangle */
import { db } from '@api/db/prisma';
import server from '@api/server';
import generateTestUsers from '@api/test/generateTestUsers';
import { PatchUserInput } from '@validation/schema/user.schema';
import supertest from 'supertest';

describe('user.controller', () => {
  const app = server.init();
  test('getUsers default pagination', async () => {
    const testUsers = generateTestUsers(20);
    await db.user.createMany({ data: testUsers });

    const { body, statusCode } = await supertest(app).get('/api/users');

    expect(statusCode).toEqual(200);
    expect(body.users).toHaveLength(20);

    expect(body._links).toEqual({
      self: { href: expect.stringContaining('/api/users') },
    });
    expect(body.paging).toEqual({
      page: 1,
      query: {},
      totalPages: 1,
      totalResults: 20,
    });
  });

  test('getUsers paging', async () => {
    const testUsers = generateTestUsers(10);
    await db.user.createMany({ data: testUsers });

    const { body: firstPage, statusCode: firstPageStatusCode } =
      await supertest(app).get('/api/users?page=1&pageSize=3');

    expect(firstPageStatusCode).toEqual(200);
    expect(firstPage._links).toEqual({
      next: {
        href: expect.stringContaining('/api/users?page=2&pageSize=3'),
      },
      self: {
        href: expect.stringContaining('/api/users?page=1&pageSize=3'),
      },
    });
    expect(firstPage.paging).toEqual({
      page: 1,
      query: {
        page: '1',
        pageSize: '3',
      },
      totalPages: 4,
      totalResults: 10,
    });

    expect(firstPage.users).toEqual(
      expect.arrayContaining([
        {
          createdAt: expect.any(String),
          email: expect.any(String),
          firstName: expect.any(String),
          id: expect.any(String),
          lastName: expect.any(String),
          role: 'USER',
          updatedAt: expect.any(String),
        },
      ]),
    );
    expect(firstPage.users).toHaveLength(3);

    const { body: secondPageBody, statusCode: secondPageStatusCode } =
      await supertest(app).get('/api/users?page=2&pageSize=3');

    expect(secondPageStatusCode).toEqual(200);
    expect(secondPageBody._links).toEqual({
      next: { href: expect.stringContaining('/api/users?page=3&pageSize=3') },
      prev: { href: expect.stringContaining('/api/users?page=1&pageSize=3') },
      self: { href: expect.stringContaining('/api/users?page=2&pageSize=3') },
    });
    expect(secondPageBody.paging).toEqual({
      page: 2,
      query: { page: '2', pageSize: '3' },
      totalPages: 4,
      totalResults: 10,
    });
    expect(secondPageBody.users).toEqual(
      expect.arrayContaining([
        {
          createdAt: expect.any(String),
          email: expect.any(String),
          firstName: expect.any(String),
          id: expect.any(String),
          lastName: expect.any(String),
          role: 'USER',
          updatedAt: expect.any(String),
        },
      ]),
    );

    expect(secondPageBody.users).toHaveLength(3);

    const { body: thirdPageBody, statusCode: thirdPageStatusCode } =
      await supertest(app).get('/api/users?page=3&pageSize=1');

    expect(thirdPageStatusCode).toEqual(200);

    expect(thirdPageBody._links).toEqual({
      next: { href: expect.stringContaining('api/users?page=4&pageSize=1') },
      prev: { href: expect.stringContaining('api/users?page=2&pageSize=1') },
      self: { href: expect.stringContaining('api/users?page=3&pageSize=1') },
    });
    expect(thirdPageBody.paging).toEqual({
      page: 3,
      query: { page: '3', pageSize: '1' },
      totalPages: 10,
      totalResults: 10,
    });
    expect(thirdPageBody.users).toEqual([
      {
        createdAt: expect.any(String),
        email: expect.any(String),
        firstName: expect.any(String),
        id: expect.any(String),
        lastName: expect.any(String),
        role: 'USER',
        updatedAt: expect.any(String),
      },
    ]);
    expect(thirdPageBody.users).toHaveLength(1);

    const { body: fourthPagebody, statusCode: fourthPageStatusCode } =
      await supertest(app).get('/api/users?page=4&pageSize=20');

    expect(fourthPageStatusCode).toEqual(200);

    expect(fourthPagebody._links).toEqual({
      prev: { href: expect.stringContaining('/api/users?page=3&pageSize=20') },
      self: { href: expect.stringContaining('/api/users?page=4&pageSize=20') },
    });
    expect(fourthPagebody.paging).toEqual({
      page: 4,
      query: { page: '4', pageSize: '20' },
      totalPages: 1,
      totalResults: 10,
    });
    expect(fourthPagebody.users).toEqual([]);
  });

  describe('getUser', () => {
    test('getUser gets user', async () => {
      const testUsers = generateTestUsers(10);
      await db.user.createMany({ data: testUsers });

      const user1 = await db.user.findFirst({
        where: {
          email: testUsers[0].email,
        },
      });

      const { body, statusCode } = await supertest(app).get(
        `/api/users/${user1?.id}`,
      );

      expect(statusCode).toEqual(200);
      expect(body).toEqual({
        createdAt: expect.any(String),
        email: testUsers[0].email,
        firstName: testUsers[0].firstName,
        id: expect.any(String),
        lastName: testUsers[0].lastName,
        role: 'USER',
        updatedAt: expect.any(String),
      });
    });
  });

  describe('updateUser', () => {
    test('unauthenticated user cannot update user', async () => {
      const testusers = generateTestUsers(5);
      await db.user.createMany({
        data: testusers,
      });

      const users = await db.user.findMany();

      const updatedUserBody: PatchUserInput['body'] = {
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
      };

      const { body, statusCode } = await supertest(app)
        .patch(`/api/users/${users[0].id}`)
        .send(updatedUserBody);

      expect(statusCode).toEqual(401);
      expect(body).toEqual({
        code: 'Forbidden',
        errors: [],
        message: 'You are not authorized to perform this action',
        statusCode: 401,
        title: 'Forbidden',
        type: 'Forbidden',
      });
    });

    test('authenticated user can update their own user', async () => {
      const user = generateTestUsers(1);
      await supertest(app).post('/api/auth/register').send(user[0]);

      const {
        headers,
        statusCode,
        body: loginBody,
      } = await supertest(app).post('/api/auth/login').send({
        email: user[0].email,
        password: user[0].password,
      });

      const userId = loginBody.id;

      const u = await db.user.findFirst({
        where: {
          id: loginBody.id,
        },
      });

      expect(statusCode).toEqual(200);

      // TODO: create helper to get cookie from headers
      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      const { body: updatedUser, statusCode: updatedUserStatusCode } =
        await supertest(app)
          .patch(`/api/users/${userId}`)
          .set('Cookie', `${cookieName}=${cookieValue}`)
          .send({
            firstName: 'test',
            lastName: 'updated last name',
            email: user[0].email,
          });

      expect(updatedUserStatusCode).toEqual(200);

      expect(updatedUser).toEqual({
        createdAt: expect.any(String),
        email: u?.email,
        firstName: 'test',
        id: u?.id,
        lastName: 'updated last name',
        role: 'USER',
        updatedAt: expect.any(String),
      });
    });

    test('authenticated user cannot update another user', async () => {
      const testUsers = generateTestUsers(5);

      await db.user.createMany({
        data: testUsers.slice(1),
      });

      await supertest(app).post('/api/auth/register').send(testUsers[0]);

      const { headers, statusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: testUsers[0].email,
          password: testUsers[0].password,
        });

      expect(statusCode).toEqual(200);

      // TODO: create helper to get cookie from headers
      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      const user2Id = await db.user.findFirst({
        where: {
          email: testUsers[1].email,
        },
      });

      const { body: updatedUser, statusCode: updatedUserStatusCode } =
        await supertest(app)
          .patch(`/api/users/${user2Id}`)
          .set('Cookie', `${cookieName}=${cookieValue}`)
          .send({
            firstName: 'test',
            lastName: 'updated last name',
            email: testUsers[0].email,
          });

      expect(updatedUserStatusCode).toEqual(401);
      expect(updatedUser).toEqual({
        code: 'Forbidden',
        errors: [],
        message: 'You are not authorized to perform this action',
        statusCode: 401,
        title: 'Forbidden',
        type: 'Forbidden',
      });
    });
  });
});
