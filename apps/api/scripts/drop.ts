/* eslint-disable no-console */
import { db } from '../src/db/prisma';

async function main() {
  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  await db.$transaction([deletePet, deleteUser]);
  console.info('Database dropped');
}

main().catch(e => console.error(e));
