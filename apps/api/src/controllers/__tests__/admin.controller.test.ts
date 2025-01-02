import { db } from '@api/db/prisma';
import server from '@api/server';
import supertest from 'supertest';
import { user } from '../__mocks__/user';

describe('admin', () => {
  const app = server.init();

  describe('flushRedis', () => {
    test('throws unauthorized exception if user is un-authenticated', async () => {
      const { body, statusCode } =
        await supertest(app).post('/api/admin/flush');

      expect(body).toEqual({
        code: 'Forbidden',
        errors: [],
        message: 'You are not authorized to perform this action',
        statusCode: 401,
        title: 'Forbidden',
        type: 'Forbidden',
      });

      expect(statusCode).toEqual(401);
    });

    test('throws unauthorized exception if user is not an admin', async () => {
      await supertest(app).post('/api/auth/register').send(user);

      const { headers, statusCode: authStatusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(authStatusCode).toBe(200);

      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      const { body, statusCode } = await supertest(app)
        .post('/api/admin/flush')
        .set('Cookie', `${cookieName}=${cookieValue}`);

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

    test('allows admin to flush redis db', async () => {
      await supertest(app).post('/api/auth/register').send(user);

      const { headers, statusCode: authStatusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(authStatusCode).toBe(200);

      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      // set user to an admin in the DB
      await db.$queryRaw`UPDATE "users" SET role = 'ADMIN' WHERE email = ${user.email}`;

      const { body, statusCode } = await supertest(app)
        .post('/api/admin/flush')
        .set('Cookie', `${cookieName}=${cookieValue}`);

      expect(statusCode).toEqual(200);
      expect(body).toEqual({ result: 'OK' });
    });
  });
});
