import UserController from '@api/controllers/user.controller';
import isAuth from '@api/middleware/isAuth';
import isUser from '@api/middleware/isUser';
import validateResource from '@api/middleware/validateResource';
import { GetUserRequest, PatchUserRequest } from '@api/requests/user.requests';
import {
  getUserSchema,
  updateUserSchema,
} from '@validation/schema/user.schema';
import { Express } from 'express';

export default class UserRoutes {
  private readonly app: Express;

  private readonly userController: UserController;

  constructor(app: Express) {
    this.app = app;
    this.userController = new UserController();
  }

  public setupRoutes(): void {
    this.app.get('/api/users', (req, res) => {
      return this.userController.getUsers(req, res);
    });

    this.app.get(
      '/api/users/:id',
      validateResource<GetUserRequest>(getUserSchema),
      (req, res) => {
        return this.userController.getUser(req, res);
      },
    );

    this.app.patch(
      '/api/users/:id',
      validateResource<PatchUserRequest>(updateUserSchema),
      isAuth(),
      isUser(),
      (req, res) => {
        return this.userController.updateUser(req, res);
      },
    );
  }
}
