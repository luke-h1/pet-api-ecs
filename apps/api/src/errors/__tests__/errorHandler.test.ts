import CreateServer from '@api/server';
import supertest from 'supertest';

const server = CreateServer;

const app = server.init();

describe('errorHandler', () => {
  test('global error handler returns 404', async () => {
    const { body, statusCode } = await supertest(app).get('/not/found');

    expect(statusCode).toEqual(404);

    expect(body).toEqual({
      code: 'NotFound',
      errors: [],
      message:
        'The requested resource could not be found. Please check your query and try again.',
      statusCode: 404,
      title: 'The requested resource could not be found.',
      type: 'Not Found',
    });
  });
});
