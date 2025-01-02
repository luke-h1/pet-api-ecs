import { Role, User } from '@prisma/client';

export type UserWithoutPrismaKeys = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt'
>;

export const user: UserWithoutPrismaKeys = {
  email: 'testuser@test.com',
  firstName: 'test',
  lastName: 'user',
  password: 'password',
  role: Role.USER,
};

export const user2: UserWithoutPrismaKeys = {
  email: 'marblestest@test.com',
  firstName: 'marbles',
  lastName: 'cat',
  password: 'password12345',
  role: Role.USER,
};

export const user3: UserWithoutPrismaKeys = {
  email: 'johndoe@test.com',
  firstName: 'john',
  lastName: 'doe',
  password: 'password12345',
  role: Role.USER,
};
