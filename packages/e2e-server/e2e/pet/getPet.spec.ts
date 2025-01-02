import { test, expect } from '@playwright/test';

test.describe('getPet', () => {
  test('get pet returns pets', async ({ request }) => {
    const response = await request.get('/api/pets');
    expect(response.status()).toEqual(200);
    // TODO: figure out a way to auth tests and have them setup test data etc.
    // const body = await response.json();
    // expect(body).toEqual([]);
  });
});
