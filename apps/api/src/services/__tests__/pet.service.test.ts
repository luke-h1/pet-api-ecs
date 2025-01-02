import { pets as mockPets } from '@api/controllers/__mocks__/pet';
import { user } from '@api/controllers/__mocks__/user';
import { db } from '@api/db/prisma';
import { testImages } from '@api/test/testImages';
import { PetStatus } from '@prisma/client';
import { CreatePetInput } from '@validation/schema/pet.schema';
import PetService from '../pet.service';

describe('petService', () => {
  let petService: PetService;

  beforeAll(() => {
    petService = new PetService();
  });

  // TODO: update test to ensure it gets from DB and then cache

  describe('getPets', () => {
    test('returns pets', async () => {
      const u = await db.user.create({
        data: user,
      });

      await db.pet.createMany({
        data: mockPets.map(pet => ({
          ...pet,
          creatorId: u.id,
        })),
      });
      const pets = await petService.getPets(1, 100, undefined);
      expect(pets).toEqual([
        {
          age: '12',
          birthDate: '2022',
          breed: 'Golden Retriever',
          createdAt: expect.anything(),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: testImages,
          name: 'Buddy',
          status: 'AVAILABLE',
          tags: ['dog'],
          updatedAt: expect.anything(),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Siamese',
          createdAt: expect.anything(),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: testImages,
          name: 'Mittens',
          status: 'ADOPTED',
          tags: ['dog'],
          updatedAt: expect.anything(),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Labrador Retriever',
          createdAt: expect.anything(),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: testImages,
          name: 'Charlie',
          status: 'AVAILABLE',
          tags: ['dog'],
          updatedAt: expect.anything(),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Maine Coon',
          createdAt: expect.anything(),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: testImages,
          name: 'Whiskers',
          status: 'PENDING',
          tags: ['dog'],
          updatedAt: expect.anything(),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Beagle',
          createdAt: expect.anything(),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: testImages,
          name: 'Max',
          status: 'ADOPTED',
          tags: ['dog'],
          updatedAt: expect.anything(),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Bengal',
          createdAt: expect.anything(),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: testImages,
          name: 'Luna',
          status: 'AVAILABLE',
          tags: ['dog'],
          updatedAt: expect.anything(),
        },
      ]);
    });
  });

  describe('getPet', () => {
    test('returns a pet by id', async () => {
      const u = await db.user.create({
        data: user,
      });

      await db.pet.createMany({
        data: mockPets.map(pet => ({
          ...pet,
          creatorId: u.id,
        })),
      });

      const pets = await db.pet.findMany();

      const pet = await petService.getPet(pets[0].id);
      expect(pet).toEqual({
        ...mockPets[0],
        creatorId: u.id,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('createPet', () => {
    test('can create a pet', async () => {
      const u = await db.user.create({
        data: user,
      });

      const pet: CreatePetInput['body'] = {
        name: 'marbles',
        description: 'marbles is a good cat',
        age: '2',
        birthDate: '2022-02-02',
        breed: 'cat :)',
        images: testImages,
        status: PetStatus.AVAILABLE,
        tags: ['cute', 'indoor'],
      };

      const result = await petService.createPet(pet, u.id);

      expect(result).toEqual({
        ...pet,
        creatorId: u.id,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updatePet', () => {
    test('update a pet', async () => {
      const u = await db.user.create({
        data: user,
      });

      const createdPet: CreatePetInput['body'] = {
        name: 'marbles',
        description: 'marbles is a good cat',
        age: '2',
        birthDate: '2022-02-02',
        breed: 'cat :)',
        images: testImages,
        status: PetStatus.AVAILABLE,
        tags: ['cute', 'indoor'],
      };

      const createdResult = await petService.createPet(createdPet, u.id);

      const result = await petService.updatePet(createdResult?.id as string, {
        ...createdPet,
        name: 'Updated Pet',
      });

      expect(result).toEqual({
        ...createdPet,
        name: 'Updated Pet',
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        creatorId: u.id,
      });
    });
  });

  describe('deletePet', () => {
    test('delete pet', async () => {
      const u = await db.user.create({
        data: user,
      });

      const createdPet: CreatePetInput['body'] = {
        name: 'marbles',
        description: 'marbles is a good cat',
        age: '2',
        birthDate: '2022-02-02',
        breed: 'cat :)',
        images: testImages,
        status: PetStatus.AVAILABLE,
        tags: ['cute', 'indoor'],
      };

      const createdResult = await petService.createPet(createdPet, u.id);

      const result = await petService.deletePet(createdResult?.id as string);
      expect(result).toEqual(null);
    });
  });
});
