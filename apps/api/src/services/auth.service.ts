import { db } from '@api/db/prisma';
import RedisDatabase from '@api/db/redis';
import NotFoundError from '@api/errors/NotFoundError';
import { authErrorCodes } from '@api/errors/auth';
import logger from '@api/utils/logger';
import {
  CreateUserInput,
  LoginUserInput,
} from '@validation/schema/auth.schema';
import omit from 'lodash/omit';
import PasswordService from './password.service';

export default class AuthService {
  private readonly redis: typeof RedisDatabase;

  private readonly passwordService: PasswordService;

  constructor() {
    this.redis = RedisDatabase;
    this.passwordService = new PasswordService();
  }

  async me(id: string) {
    const user = await db.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return authErrorCodes.UserNotFound;
    }

    return user;
  }

  async register(user: CreateUserInput['body']) {
    const existingUser = await db.user.findFirst({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (existingUser?.email === user.email) {
      logger.warn(`${authErrorCodes.EmailAlreadyExists} triggered`);
      return authErrorCodes.EmailAlreadyExists;
    }

    const hashedPassword = await this.passwordService.hashPassword(
      user.password,
    );

    const u = await db.user.create({
      data: {
        ...user,
        role: 'USER',
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });
    return u;
  }

  async login(user: LoginUserInput['body']) {
    const u = await db.user.findFirst({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        password: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!u) {
      logger.warn(
        `${authErrorCodes.UserNotFound} triggered for user ${user.email}`,
      );
      return authErrorCodes.UserNotFound;
    }

    const isValidPassword = await this.passwordService.isValidPassword({
      hashedPassword: u.password,
      plainTextPassword: user.password,
    });

    if (!isValidPassword) {
      logger.warn(
        `${authErrorCodes.InvalidCredentials} triggered for user ${user.email}`,
      );
      return authErrorCodes.InvalidCredentials;
    }

    return omit(u, 'password');
  }

  // async resetPassword(user: ResetPasswordInput['body']): Promise<boolean> {
  //   const u = await db.user.findFirst({
  //     where: {
  //       email: user.email,
  //     },
  //   });

  //   if (!u) {
  //     return false;
  //   }

  //   const token = v4();

  //   const PREFIX = 'AUTH_FORGOT_PASSWORD';

  //   const result = await this.redis.setWithExpr(`${PREFIX}${token}`, u.id, {
  //     token: 'EX',
  //     time: 1000 * 60 * 60 * 24 * 1, // 1 day to reset pwd
  //   });
  //   return result;
  // }

  async deleteAccount(id: string) {
    const user = await db.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundError({
        code: authErrorCodes.UserNotFound,
        title: 'User not found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    try {
      await db.user.delete({
        where: { id },
      });
      return true;
    } catch (e) {
      logger.warn(`Issue deleting account with id: ${id}`);
      return false;
    }
  }
}
