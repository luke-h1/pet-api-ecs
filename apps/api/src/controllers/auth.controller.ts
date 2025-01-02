import { Request, Response } from 'express';
import omit from 'lodash/omit';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import { authErrorCodes } from '../errors/auth';
import { LoginRequest, RegisterRequest } from '../requests/auth.requests';
import AuthService from '../services/auth.service';
import logger from '../utils/logger';

export default class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: RegisterRequest, res: Response) {
    const result = await this.authService.register(req.body);
    logger.info('User registered', result);

    if (result === authErrorCodes.EmailAlreadyExists) {
      throw new BadRequestError({
        code: authErrorCodes.EmailAlreadyExists,
        title: 'Email already exists',
        statusCode: 400,
        message: 'Email already exists',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'email'],
            message: 'Email already exists',
          },
        ],
      });
    }

    return res.status(201).json(omit(result, 'password'));
  }

  async login(req: LoginRequest, res: Response) {
    const result = await this.authService.login(req.body);

    if (result === authErrorCodes.InvalidCredentials) {
      throw new BadRequestError({
        message: 'Invalid credentials',
        statusCode: 401,
        type: 'Unauthorized',
        code: authErrorCodes.InvalidCredentials,
        title: 'Bad credentials supplied',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'email'],
            message: 'Invalid email or password',
          },
        ],
      });
    }

    if (result === authErrorCodes.UserNotFound) {
      throw new BadRequestError({
        code: authErrorCodes.UserNotFound,
        title: 'User not found',
        statusCode: 404,
        message: 'User not found',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'email'],
            message: 'User not found',
          },
        ],
      });
    }
    // auth user with express-session
    req.session.userId = result.id;

    return res.status(200).json(omit(result, 'password'));
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((e: unknown) => {
      res.clearCookie('connect.sid');
      if (e) {
        return res.status(400).json({
          msg: 'issue clearing cookie',
        });
      }
      return res.status(200).send();
    });
  }

  async me(req: Request, res: Response) {
    const result = await this.authService.me(req.session.userId);

    if (result === authErrorCodes.UserNotFound) {
      throw new NotFoundError({
        code: authErrorCodes.UserNotFound,
        title: 'User not found',
        statusCode: 404,
        message: 'User not found',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'email'],
            message: 'User not found',
          },
        ],
      });
    }

    return res.status(200).json(result);
  }

  // async resetPassword(req: ResetPasswordRequest, res: Response) {
  //   const result = await this.authService.resetPassword(req.body);

  //   if (result) {
  //     return res.status(200).json({ message: 'Password reset' });
  //   }

  //   return res.status(400).json({ message: 'Password reset failed' });
  // }

  async deleteAccount(req: Request, res: Response) {
    const result = await this.authService.deleteAccount(req.body);

    if (result) {
      return res.status(200).json({ message: 'Account deleted' });
    }

    return res.status(400).json({ message: 'Account deletion failed' });
  }

  async isAuthenticated(req: Request, res: Response) {
    const isAuth = req.session && req.session.userId;
    return res.status(200).json({
      isAuth: !!isAuth,
    });
  }
}
