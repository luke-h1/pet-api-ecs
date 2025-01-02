import CreateServer from '@api/server';
import supertest from 'supertest';

const server = CreateServer;
const app = server.init();

describe('health', () => {
  test('healthcheck responds when db & cache is ok in json', async () => {
    const { body, statusCode } = await supertest(app)
      .get('/api/healthcheck')
      .set('Accept', 'application/json');
    expect(statusCode).toBe(200);
    expect(body).toEqual({ cache: true, db: true, status: 'OK' });
  });
  test('healthcheck responds when db & cache is ok in xml', async () => {
    const { text, statusCode } = await supertest(app)
      .get('/api/healthcheck')
      .set('Accept', 'application/xml');
    expect(statusCode).toBe(200);
    expect(text).toEqual(
      '<health><db>true</db><cache>true</cache><status>OK</status></health>',
    );
  });
});
