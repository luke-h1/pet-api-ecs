import server from '@api/server';
import supertest from 'supertest';
import { user } from '../__mocks__/user';

describe('image', () => {
  const app = server.init();

  describe('createImages', () => {
    test.skip('creates an image', async () => {
      await supertest(app).post('/api/auth/register').send(user);
      const { headers } = await supertest(app).post('/api/auth/login').send({
        email: user.email,
        password: user.password,
      });
      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';
      // form data
      const formData = new FormData();
      formData.append('images', '../__mocks__/cat.png');
      const { statusCode } = await supertest(app)
        .post('/api/images')
        .set('Cookie', `${cookieName}=${cookieValue}`)
        .attach('images', '../__mocks__/cat.png', 'cat.png');

      expect(statusCode).toBe(201);
    });
  });
});
