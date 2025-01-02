import { test, expect } from '@playwright/test';
import { createUser, getCookieFromHeaders, loginUser } from './util/user';

test.describe('isAuth', () => {
  test('returns true for authenticated user', async ({ request }) => {
    const { response: createUserResponse, userPassword } =
      await createUser(request);

    const user = await loginUser(
      { email: createUserResponse.email, password: userPassword },
      request,
    );

    const headers = user.headers();
    const cookie = await getCookieFromHeaders(headers);

    const result = await request.get('/api/auth', {
      headers: {
        Cookie: cookie,
      },
    });

    expect(result.status()).toEqual(200);
    const response = await result.json();
    expect(response).toEqual({
      isAuth: true,
    });
  });

  test('returns false for un-authenticated user', async ({ request }) => {
    const result = await request.get('/api/auth');

    expect(result.status()).toEqual(200);
    const response = await result.json();
    expect(response).toEqual({
      isAuth: false,
    });
  });
});
