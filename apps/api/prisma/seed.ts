/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { faker } from '@faker-js/faker';
import { Pet, PetStatus, Role, User } from '@prisma/client';
import crypto from 'crypto';
import { db } from '../src/db/prisma';
import { testImages } from '../src/test/testImages';

const USER_BATCH_SIZE = 10;
const PETS_PER_USER = 10;
const TOTAL_USERS = 50;

type UserWithoutPrismaKeys = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

type PetWithoutPrismaKeys = Omit<
  Pet,
  'id' | 'createdAt' | 'updatedAt' | 'creatorId'
> & { creatorId: string };

const randomPassword = crypto.randomBytes(20).toString('hex');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateUserData(_index: number): UserWithoutPrismaKeys {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: randomPassword,
    role: Role.USER,
  };
}

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const breeds = ['cat', 'dog', 'reptile', 'fish'];

const tags = [
  'cute',
  'fluffy',
  'adorable',
  'friendly',
  'playful',
  'energetic',
  'shy',
  'affectionate',
  'intelligent',
  'loyal',
];

const petNames = [
  'Bella',
  'Max',
  'Luna',
  'Charlie',
  'Daisy',
  'Rocky',
  'Milo',
  'Coco',
  'Bailey',
  'Ruby',
  'Leo',
  'Zoe',
  'Buddy',
  'Finn',
  'Sadie',
  'Nala',
  'Simba',
  'Oreo',
  'Jasper',
  'Willow',
  'Gizmo',
  'Sophie',
  'Marley',
  'Thor',
  'Pepper',
  'Lola',
  'Rex',
  'Chloe',
  'Apollo',
  'Tucker',
  'Bandit',
  'Penny',
  'Ziggy',
  'Harley',
  'Hazel',
  'Zeus',
  'Olive',
  'Duke',
  'Winnie',
  'Shadow',
  'Roxy',
  'Scout',
  'Pippa',
  'Loki',
  'Mia',
  'Buster',
  'Bruno',
  'Stella',
  'Trixie',
  'Jasper',
];

const ages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const randomPetName = petNames[Math.floor(Math.random() * petNames.length)];
const randomBirthDay = [
  '2007-02-20',
  '2013-09-19',
  '2009-09-28',
  '2010-09-04',
  '2022-09-24',
  '2011-07-16',
  '2021-01-17',
  '2015-10-15',
  '2013-05-05',
  '2023-05-22',
  '2015-03-14',
  '2014-03-18',
  '2011-04-08',
  '2019-06-12',
  '2006-12-31',
  '2005-01-16',
  '2024-06-09',
  '2022-10-11',
  '2009-12-05',
  '2023-06-25',
];

function generatePetData(
  index: number,
  creatorId: string,
): PetWithoutPrismaKeys {
  return {
    name: randomPetName,
    status: PetStatus.AVAILABLE,
    age: ages[Math.floor(Math.random() * ages.length)].toString(),
    birthDate:
      randomBirthDay[Math.floor(Math.random() * randomBirthDay.length)],
    breed: Math.random() > 0.5 ? breeds[0] : breeds[1],
    description: loremIpsum,
    images: testImages,
    tags,
    creatorId,
  };
}

async function main() {
  console.info('Seeding database...');
  console.info('-------------------');

  for (let i = 0; i < TOTAL_USERS; i += USER_BATCH_SIZE) {
    const users: UserWithoutPrismaKeys[] = [];
    for (let j = 0; j < USER_BATCH_SIZE; j += 1) {
      const userIndex = i + j;
      if (userIndex >= TOTAL_USERS) break;
      users.push(generateUserData(userIndex));
    }

    console.time('Inserting batch');
    await db.$transaction(
      async prisma => {
        await prisma.user.createMany({
          data: users,
          skipDuplicates: true,
        });

        const createdUsers = await prisma.user.findMany({
          where: {
            email: {
              in: users.map(user => user.email),
            },
          },
        });

        for (const user of createdUsers) {
          const pets: PetWithoutPrismaKeys[] = [];
          for (let k = 0; k < PETS_PER_USER; k += 1) {
            pets.push(generatePetData(k, user.id));
          }

          // Batch insert pets for each user
          const PET_BATCH_SIZE = 1000; // Adjust batch size as needed
          for (let l = 0; l < pets.length; l += PET_BATCH_SIZE) {
            const petBatch = pets.slice(l, l + PET_BATCH_SIZE);
            await prisma.pet.createMany({
              data: petBatch,
              skipDuplicates: true,
            });
          }
        }
      },
      { timeout: 1000000 },
    );

    // Log the current number of records in the User and Pet tables
    const userCount = await db.user.count();
    const petCount = await db.pet.count();
    console.info(`Inserted batch ${i / USER_BATCH_SIZE + 1}`);
    console.info(`Current number of users: ${userCount}`);
    console.info(`Current number of pets: ${petCount}`);

    console.timeEnd('Inserting batch');

    // Update progress indicator
    process.stdout.write(
      `Progress: ${(((i + USER_BATCH_SIZE) / TOTAL_USERS) * 100).toFixed(2)}% complete\r`,
    );
  }

  console.info('\nSeeding completed.');
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
