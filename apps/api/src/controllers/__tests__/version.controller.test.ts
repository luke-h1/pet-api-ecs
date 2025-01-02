import server from '@api/server';
import supertest from 'supertest';

describe('version', () => {
  const app = server.init();

  describe('getVersion', () => {
    test('getVersion returns json by default', async () => {
      const { body, statusCode } = await supertest(app)
        .get('/api/version')
        .set('Accept', 'application/json');

      expect(body).toEqual({
        deployedAt: 'local',
        deployedBy: 'luke-h1',
        gitSha: 'unknown',
      });
      expect(statusCode).toBe(200);
    });

    test('getVersion returns xml if requested', async () => {
      const { text, statusCode } = await supertest(app)
        .get('/api/version')
        .set('Accept', 'application/xml');

      expect(statusCode).toBe(200);
      expect(text).toEqual(
        '<version><deployedBy>luke-h1</deployedBy><deployedAt>local</deployedAt><gitSha>unknown</gitSha></version>',
      );
    });
  });
});
