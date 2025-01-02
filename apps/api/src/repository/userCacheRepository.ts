import RedisDatabase from '@api/db/redis';
import logger from '@api/utils/logger';
import { SortParams } from '@api/utils/parseSortParams';
import { User } from '@prisma/client';

type SanitisedUser = Omit<User, 'password'>;

export default class UserCacheRepository {
  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.redis = RedisDatabase;
  }

  async getUser(id: string): Promise<SanitisedUser | null> {
    const db = this.redis.getInstance();
    const cachedUser = await db.get(`users:${id}`);

    if (!cachedUser) {
      logger.info(`[REDIS]: getUser - no user with id: ${id} found in cache`);
      return null;
    }

    logger.info(`[REDIS]: getUser - user found in cache with id: ${id}`);
    return this.cacheToJSON(cachedUser);
  }

  async getUsers(
    page: number,
    pageSize: number,
    sortOrder: SortParams['sortOrder'],
  ): Promise<SanitisedUser[]> {
    const db = this.redis.getInstance();

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const cachedUsers = await db.get('users');

    if (!cachedUsers) {
      logger.info(
        '[REDIS]: cache miss - users not found in cache with key `users`',
      );
      return [];
    }

    const parsedUsers = this.cacheToJSON(cachedUsers);

    switch (sortOrder) {
      case 'asc': {
        parsedUsers.sort((a: SanitisedUser, b: SanitisedUser) => {
          return a.createdAt < b.createdAt ? -1 : 1;
        });
        return parsedUsers;
      }

      case 'desc': {
        parsedUsers.sort((a: SanitisedUser, b: SanitisedUser) => {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        return parsedUsers;
      }
      default: {
        return parsedUsers.slice(start, end);
      }
    }
  }

  async deleteUser(id: string) {
    const db = this.redis.getInstance();
    await db.del(`pets:${id}`);

    const users = await db.get('users');

    if (!users) {
      return;
    }
    const parsedUsers = this.cacheToJSON(users);

    if (!parsedUsers) {
      return;
    }
    const updatedUsers = parsedUsers.filter((user: User) => user.id !== id);

    await db.set('users', JSON.stringify(updatedUsers));
  }

  async setUsers(users: SanitisedUser[]) {
    const db = this.redis.getInstance();
    await db.set('users', JSON.stringify(users));
  }

  async setUser(user: SanitisedUser) {
    const db = this.redis.getInstance();
    const pipeline = db.pipeline();
    pipeline.del(`users:${user.id}`);
    pipeline.set(`users:${user.id}`, JSON.stringify(user));
    await pipeline.exec();

    const users = await db.get('users');
    if (!users) {
      return null;
    }
    await db.set('users', JSON.stringify([...this.cacheToJSON(users), user]));

    logger.info('[REDIS]: user added to users:{id} and users cache');
    return null;
  }

  // TODO: type JSON.parse signature
  private cacheToJSON(data: string[] | string) {
    if (Array.isArray(data)) {
      return data.map(item => JSON.parse(item));
    }

    return JSON.parse(data);
  }
}
