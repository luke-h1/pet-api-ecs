import { envSchema } from '@api/utils/env';
import isDbAvailable from '@api/utils/isDbAvailable';
import logger from '@api/utils/logger';
import { exec as execCb } from 'node:child_process';
import { promisify } from 'node:util';
import CreateServer from './server';

const exec = promisify(execCb);

class Main {
  private validateEnvironmentVariables() {
    const environmentVariables = envSchema.safeParse({
      PORT: process.env.PORT,

      // postgres
      DATABASE_URL: process.env.DATABASE_URL,

      // redis
      REDIS_URL: process.env.REDIS_URL,

      // session auth
      SESSION_SECRET: process.env.SESSION_SECRET,
      SESSION_DOMAIN: process.env.SESSION_DOMAIN,

      // version
      DEPLOYED_AT: process.env.DEPLOYED_AT,
      DEPLOYED_BY: process.env.DEPLOYED_BY,

      // general
      ENVIRONMENT: process.env.ENVIRONMENT,
      API_BASE_URL: process.env.API_BASE_URL,

      // AWS S3 static assets
      S3_ASSETS_BUCKET: process.env.S3_ASSETS_BUCKET,
      S3_ASSETS_BUCKET_REGION: process.env.S3_ASSETS_BUCKET_REGION,
      S3_ASSETS_ACCESS_KEY_ID: process.env.S3_ASSETS_ACCESS_KEY_ID,
      S3_ASSETS_SECRET_ACCESS_KEY: process.env.S3_ASSETS_SECRET_ACCESS_KEY,
    });

    if (!environmentVariables.success) {
      logger.error(
        `${JSON.stringify(environmentVariables.error.issues, null, 2)}`,
      );
      throw new Error('issue reading environment variables');
    } else {
      logger.info('parsed env variables successfully');
    }
  }

  private async runMigrations() {
    // only run migrations in a production setting
    // for development we can just use the CLI manually
    const shouldRunMigrations =
      process.env.NODE_ENV === 'production' &&
      !process.env.API_BASE_URL.includes('localhost');

    if (!shouldRunMigrations) {
      return;
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('no DATABASE_URL env variable supplied!');
    }

    const dbReady = await isDbAvailable();

    if (!dbReady) {
      throw new Error('DB cannot be reached');
    }

    const { stdout, stderr } = await exec('pnpm db:migrate-dev', {
      env: {
        ...process.env,
      },
    });

    logger.info('-------------------');
    logger.info('Migrations');
    logger.info('stdout ->', stdout);
    logger.info('stderr ->', stderr);
    logger.info('-------------------');
  }

  public async start() {
    await this.runMigrations();
    this.validateEnvironmentVariables();
    const app = CreateServer.init();
    const port = process.env.PORT ?? 8000;

    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    });
  }
}

const main = new Main();
main.start().then(r => r);
