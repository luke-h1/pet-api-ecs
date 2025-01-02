import 'express-async-errors';
import RedisDatabase from '@api/db/redis';
import openApiSpec from '@api/docs/swagger';
import NotFoundError from '@api/errors/NotFoundError';
import errorHandler from '@api/errors/errorHandler';
import Routes from '@api/routes';
import testRedis from '@api/test/redis';
import logger from '@api/utils/logger';
import bodyParser from 'body-parser';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import { parseQueryString } from './utils/queryStringParsers';

const dotenvFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({
  path: dotenvFile,
});

logger.info(`loaded ${dotenvFile}`);

class CreateServer {
  private readonly app: Express;

  private readonly routes: Routes;

  private readonly redisDb: typeof RedisDatabase;

  private readonly maxBodySize: string;

  constructor() {
    this.app = express();
    this.routes = new Routes(this.app);
    this.redisDb = RedisDatabase;
    this.maxBodySize = '25mb';
  }

  private isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  private handleNotFound() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.all('*', (_req, _res) => {
      throw new NotFoundError();
    });
  }

  public init() {
    // *order is important*

    // middleware
    this.app.set('query parser', parseQueryString);
    // logging
    this.app.enable('trust proxy');
    this.app.use(
      express.json({
        limit: this.maxBodySize,
      }),
    );
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.text());

    this.app.disable('x-powered-by');
    this.app.set('json spaces', 2);
    this.app.use(
      cors({
        credentials: true,
        origin: [
          'http://localhost:3000',
          'https://ui-pets-staging.lhowsam.com',
          'https://branches.lhowsam.com',
          '*',
        ],
      }),
    );
    this.app.use(compression());

    const RedisStore = connectRedis(session);

    // session authentication middleware
    this.app.use(
      session({
        store: new RedisStore({
          // hack to get around issues in unit tests
          client:
            process.env.NODE_ENV === 'test'
              ? testRedis
              : this.redisDb.getInstance(),
          disableTouch: true,
          prefix: 'sess:',
          logErrors(error) {
            logger.error(`redis session error: ${error}`);
          },
        }),
        secret: process.env.SESSION_SECRET ?? 'pets',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: this.isProduction(),
          httpOnly: true, // prevent client side js from reading the cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          domain: this.isProduction() ? process.env.SESSION_DOMAIN : undefined,
          path: '/',
          signed: this.isProduction(),
          sameSite: 'lax',
        },
      }),
    );

    this.app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(openApiSpec(), {
        swaggerUrl: process.env.API_BASE_URL,
      }),
    );

    // routing
    this.routes.setupRoutes();

    // global 404
    this.handleNotFound();

    // global error handler
    this.app.use(errorHandler);

    return this.app;
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new CreateServer();
