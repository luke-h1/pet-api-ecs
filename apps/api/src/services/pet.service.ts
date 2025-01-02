import { db } from '@api/db/prisma';
import PetCacheRepository from '@api/repository/petCacheRepository';
import logger from '@api/utils/logger';
import { SortParams } from '@api/utils/parseSortParams';
import { Pet } from '@prisma/client';
import {
  CreatePetInput,
  DeletePetInput,
  GetPetInput,
  UpdatePetInput,
} from '@validation/schema/pet.schema';

export default class PetService {
  private readonly petCacheRepository: PetCacheRepository;

  constructor() {
    this.petCacheRepository = new PetCacheRepository();
  }

  async getPets(
    page: number,
    pageSize: number,
    sortOrder: SortParams['sortOrder'],
  ): Promise<Pet[] | null> {
    try {
      const cachedPets = await this.petCacheRepository.getPets(
        page,
        pageSize,
        sortOrder,
      );

      if (!cachedPets.length) {
        const pets = await db.pet.findMany();
        await this.petCacheRepository.setPets(pets);
        return pets.slice((page - 1) * pageSize, page * pageSize);
      }

      return cachedPets;
    } catch (error) {
      return null;
    }
  }

  async getPet(id: GetPetInput['params']['id']) {
    const cachedPet = await this.petCacheRepository.getPet(id);

    if (cachedPet) {
      return cachedPet;
    }

    const pet = await db.pet.findFirst({
      where: {
        id,
      },
    });

    if (pet) {
      await this.petCacheRepository.setPet(pet);
    }
    return pet;
  }

  async createPet(pet: CreatePetInput['body'], userId: string) {
    try {
      const newPet = await db.pet.create({
        data: {
          ...pet,
          creatorId: userId,
        },
      });

      await this.petCacheRepository.setPet(newPet);
      return newPet;
    } catch (error) {
      return null;
    }
  }

  async updatePet(
    id: UpdatePetInput['params']['id'],
    pet: UpdatePetInput['body'],
  ) {
    try {
      const updatedPet = await db.pet.update({
        where: {
          id,
        },
        data: {
          ...pet,
        },
      });

      await this.petCacheRepository.removePet(updatedPet.id);

      return updatedPet;
    } catch (e) {
      logger.error(`Failed to update pet: ${e}`);
      return null;
    }
  }

  async deletePet(id: DeletePetInput['params']['id']) {
    try {
      await Promise.allSettled([
        db.pet.delete({ where: { id } }),
        this.petCacheRepository.removePet(id),
      ]);
      return null;
    } catch (error) {
      logger.error(`Failed to delete pet: ${error}`);
      return null;
    }
  }
}
