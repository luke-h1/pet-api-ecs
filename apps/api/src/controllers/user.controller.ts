import { db } from '@api/db/prisma';
import NotFoundError from '@api/errors/NotFoundError';
import { userErrorCodes } from '@api/errors/user';
import { GetUserRequest, PatchUserRequest } from '@api/requests/user.requests';
import UserService from '@api/services/user.service';
import createLinks from '@api/utils/createLinks';
import parsePaginationParams from '@api/utils/parsePaginationParams';
import parseSortParams from '@api/utils/parseSortParams';
import { getFullRequestUrl } from '@api/utils/requestUtils';
import { Request, Response } from 'express';

export default class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUser(req: GetUserRequest, res: Response) {
    const user = await this.userService.getUser(req.params.id);

    if (!user) {
      throw new NotFoundError({
        title: 'User not found',
        code: 'UserNotFound',
        message: 'User not found',
        statusCode: 404,
      });
    }

    return res.status(200).json(user);
  }

  async getUsers(req: Request, res: Response) {
    const { page = 1, pageSize = 20 } = parsePaginationParams(req.query);
    const { sortOrder } = parseSortParams(req.query);
    const users = await this.userService.getUsers(page, pageSize, sortOrder);

    const totalResults = await db.user.count();
    const totalPages = pageSize > 0 ? Math.ceil(totalResults / pageSize) : 0;

    return res.status(200).json({
      users,
      _links: createLinks({
        self: {
          url: getFullRequestUrl(req),
          method: req.method,
        },
        paging: {
          query: req.query,
          page,
          totalPages,
          totalResults,
        },
      }),
      paging: {
        query: req.query,
        page: page ?? undefined,
        totalPages,
        totalResults,
      },
    });
  }

  async updateUser(req: PatchUserRequest, res: Response) {
    const result = await this.userService.updateUser(req.params.id, req.body);
    if (result === userErrorCodes.userNotFound) {
      throw new NotFoundError();
    }
    return res.status(200).json(result);
  }
}
