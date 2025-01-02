import './setEnvVars';
import { config } from 'dotenv';
import { db } from '../db/prisma';
import redis from '../db/redis';

config({
  path: '.env.test',
});

const doCleanup = async () => {
  const instance = redis.getInstance();
  await db.$connect();
  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  instance.flushall();
  await db.$transaction([deletePet, deleteUser]);
};

jest.setTimeout(30000);

beforeAll(async () => {
  await doCleanup();
});

beforeEach(async () => {
  jest.resetAllMocks();
  await doCleanup();
});

afterAll(async () => {
  await db.$disconnect();
  await doCleanup();
});
