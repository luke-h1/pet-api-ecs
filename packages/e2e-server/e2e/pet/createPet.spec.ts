import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { CreatePetInput } from '@validation/schema/pet.schema';
import { sleep } from '../util/sleep';
import { createUser, getCookieFromHeaders, loginUser } from '../util/user';

test.describe('createPet', () => {
  test('creates pet when user is authenticated', async ({ request }) => {
    const { response: createUserResponse, userPassword } =
      await createUser(request);

    const user = await loginUser(
      { email: createUserResponse.email, password: userPassword },
      request,
    );

    const headers = user.headers();
    const cookie = await getCookieFromHeaders(headers);

    const p: CreatePetInput['body'] = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 1, max: 25 }).toString(),
      breed: faker.animal.cat(),
      birthDate: '2024-08-02',
      description: faker.animal.cat(),
      images: [
        'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/GTgYHDgWsAAX4HO.png',
      ],
      status: 'AVAILABLE',
      tags: ['pet', 'cat', 'tag'],
    };

    const result = await request.post('/api/pets', {
      data: {
        ...p,
      },
      headers: {
        Cookie: cookie,
      },
    });

    expect(result.status()).toEqual(201);
    const response = await result.json();
    expect(response).toEqual({
      ...p,
      createdAt: expect.any(String),
      creatorId: expect.any(String),
      description: p.description,
      id: expect.any(String),
      updatedAt: expect.any(String),
    });
    // deployed envs can take a while to update cache
    await sleep(5000);

    const existingPet = await request.get(`/api/pets/${response.id}`);
    expect(existingPet.status()).toEqual(200);
    const existingPetResponse = await existingPet.json();
    expect(existingPetResponse).toEqual(response);

    // deployed envs can take a while to update cache
    await sleep(1500);

    // 90k
    const LIMIT = 90000;

    // assert /api/pets cache tree was updated
    const allPets = await request.get(`/api/pets?page=1&pageSize=${LIMIT}`);
    expect(allPets.status()).toEqual(200);

    const allPetsResponse = await allPets.json();

    // eslint-disable-next-line no-underscore-dangle
    expect(allPetsResponse._links).toEqual({
      self: {
        href: `${process.env.API_BASE_URL}/api/pets?page=1&pageSize=${LIMIT}`,
      },
    });

    expect(allPetsResponse.paging).toEqual({
      page: 1,
      query: { page: '1', pageSize: `${LIMIT}` },
      totalPages: 1,
      totalResults: expect.any(Number),
    });

    const allPetIds = allPetsResponse.results.map(
      (pet: { id: string }) => pet.id,
    );
    const matches = allPetIds.filter((id: string) => id === response.id);
    expect(matches.length).toEqual(1);

    expect(allPetsResponse.results).toContainEqual(response);
  });

  test('returns validation error if not authenticated', async ({ request }) => {
    const p: CreatePetInput['body'] = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 1, max: 25 }).toString(),
      breed: faker.animal.cat(),
      birthDate: '2024-08-02',
      description: faker.animal.cat(),
      images: [
        'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/GTgYHDgWsAAX4HO.png',
      ],
      status: 'AVAILABLE',
      tags: ['pet', 'cat', 'tag'],
    };

    const result = await request.post('/api/pets', {
      data: {
        ...p,
      },
      headers: {},
    });

    expect(result.status()).toEqual(401);
    const response = await result.json();
    expect(response).toEqual({
      code: 'Forbidden',
      errors: [],
      message: 'You are not authorized to perform this action',
      statusCode: 401,
      title: 'Forbidden',
      type: 'Forbidden',
    });
  });
});
