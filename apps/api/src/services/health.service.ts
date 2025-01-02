import { db } from '@api/db/prisma';
import RedisDatabase from '@api/db/redis';
import logger from '@api/utils/logger';

export default class HealthService {
  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.redis = RedisDatabase;
  }

  async health(): Promise<{ db: boolean; cache: boolean }> {
    const dbMsg = await db.$queryRaw`SELECT 1`;
    let cacheMsg = '';

    try {
      const cache = await this.redis.ping();
      cacheMsg = cache;
    } catch (error) {
      logger.error(`Cache connection error: ${error}`);
    }
    const cacheOk = cacheMsg === 'PONG';

    logger.info(
      `DB connection check result -> DB: ${!!dbMsg}, cache: ${cacheOk}`,
    );

    return {
      db: !!dbMsg,
      cache: cacheOk,
    };
  }
}
