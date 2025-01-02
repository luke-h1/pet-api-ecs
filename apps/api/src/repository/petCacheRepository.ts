import RedisDatabase from '@api/db/redis';
import logger from '@api/utils/logger';
import { SortParams } from '@api/utils/parseSortParams';
import { Pet } from '@prisma/client';

export default class PetCacheRepository {
  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.redis = RedisDatabase;
  }

  async removePet(id: string): Promise<void> {
    const db = this.redis.getInstance();
    await db.del(`pets:${id}`);
    const allPets = await db.get('pets');
    if (!allPets) {
      return;
    }

    const parsedPets = this.cacheToJSON(allPets);
    const updatedPets = parsedPets.filter((pet: Pet) => pet.id !== id);
    await db.set('pets', JSON.stringify(updatedPets));
  }

  async setPets(pets: Pet[]) {
    const db = this.redis.getInstance();
    const pipeline = db.pipeline();
    pets.forEach(pet => {
      pipeline.set(`pets:${pet.id}`, JSON.stringify(pet));
    });
    pipeline.set('pets', JSON.stringify(pets));
    await pipeline.exec();
  }

  async setPet(pet: Pet): Promise<null> {
    const db = this.redis.getInstance();
    const pipeline = db.pipeline();
    pipeline.del(`pets:${pet.id}`);
    pipeline.set(`pets:${pet.id}`, JSON.stringify(pet));

    const allPets = await db.get('pets');
    if (!allPets) {
      logger.info(`[REDIS]: cache miss setPet - pets not found in cache!`);
      pipeline.exec();
      return null;
    }
    pipeline.set('pets', JSON.stringify([...this.cacheToJSON(allPets), pet]));

    await pipeline.exec();
    logger.info(`[REDIS]: pet added to pets:{id} and pets cache`);
    return null;
  }

  async getPet(id: string): Promise<Pet | null> {
    const db = this.redis.getInstance();
    const cachedPet = await db.get(`pets:${id}`);

    if (!cachedPet) {
      logger.info(`[REDIS]: getPet - pet not found in cache`);
      return null;
    }

    logger.info(
      `[REDIS]: pet found in cache with id: ${this.cacheToJSON(cachedPet).id}`,
      {
        tag: 'redis',
      },
    );
    return this.cacheToJSON(cachedPet);
  }

  async getPets(
    page: number,
    pageSize: number,
    sortOrder: SortParams['sortOrder'],
  ): Promise<Pet[]> {
    const db = this.redis.getInstance();

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const cachedPets = await db.get('pets');

    if (!cachedPets) {
      logger.info(`[REDIS]: cache miss - pets not found in cache`);
      return [];
    }

    const parsedPets = this.cacheToJSON(cachedPets);

    if (sortOrder === 'asc') {
      parsedPets.sort((a: Pet, b: Pet) => {
        return a.createdAt < b.createdAt ? -1 : 1;
      });
    } else if (sortOrder === 'desc') {
      parsedPets.sort((a: Pet, b: Pet) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
    }

    return parsedPets.slice(start, end);
  }

  private cacheToJSON(data: string[] | string) {
    if (Array.isArray(data)) {
      return data.map(item => JSON.parse(item));
    }

    return JSON.parse(data);
  }

  private getByKeyName(...args: string[]) {
    return `${args.join(':')}`;
  }
}
