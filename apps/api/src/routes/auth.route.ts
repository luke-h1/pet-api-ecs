import AuthController from '@api/controllers/auth.controller';
import isAuth from '@api/middleware/isAuth';
import validateResource from '@api/middleware/validateResource';
import {
  createUserSchema,
  loginUserSchema,
} from '@validation/schema/auth.schema';
import { Express } from 'express';

export default class AuthRoutes {
  private readonly app: Express;

  private readonly authController: AuthController;

  constructor(app: Express) {
    this.app = app;
    this.authController = new AuthController();
  }

  public setupRoutes(): void {
    this.app.post(
      '/api/auth/register',
      validateResource(createUserSchema),
      (req, res) => {
        return this.authController.register(req, res);
      },
    );

    this.app.post(
      '/api/auth/login',
      validateResource(loginUserSchema),
      (req, res) => {
        return this.authController.login(req, res);
      },
    );

    this.app.post('/api/auth/logout', (req, res) => {
      return this.authController.logout(req, res);
    });

    // this.app.post(
    //   '/api/auth/reset-password',
    //   validateResource(resetPasswordSchmea),
    //   (req, res) => {
    //     return this.authController.resetPassword(req, res);
    //   },
    // );

    this.app.delete('/api/auth/delete-account', (req, res) => {
      return this.authController.deleteAccount(req, res);
    });

    this.app.get('/api/auth', (req, res) => {
      return this.authController.isAuthenticated(req, res);
    });

    this.app.get('/api/auth/me', isAuth(), (req, res) => {
      return this.authController.me(req, res);
    });
  }
}
