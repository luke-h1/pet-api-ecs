import { test, expect } from '@playwright/test';

test.describe('healthcheck', () => {
  test('should return ok when db & cache is up', async ({ request }) => {
    const result = await request.get('/api/healthcheck', {
      headers: {
        accept: 'application/json',
      },
    });
    expect(result.status()).toBe(200);

    const response = await result.json();
    expect(response).toEqual({
      cache: true,
      db: true,
      status: 'OK',
    });
  });

  test('should return xml response when requested', async ({ request }) => {
    // set the accept header to application/xml
    const result = await request.get('/api/healthcheck', {
      headers: {
        accept: 'text/xml',
      },
    });
    expect(result.status()).toBe(200);

    const response = await result.json();
    expect(response).toEqual({
      db: true,
      cache: true,
      status: 'OK',
    });
  });
});
