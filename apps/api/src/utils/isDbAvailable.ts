import { db } from '@api/db/prisma';
import { Prisma } from '@prisma/client';

export default async function isDbAvailable(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientInitializationError) {
      return false;
    }
    throw e;
  }
}
