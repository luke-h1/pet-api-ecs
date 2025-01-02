import { db } from '@api/db/prisma';
import { userErrorCodes } from '@api/errors/user';
import UserCacheRepository from '@api/repository/userCacheRepository';
import { SortParams } from '@api/utils/parseSortParams';
import { PatchUserInput } from '@validation/index';

export default class UserService {
  private readonly userCacheRepository: UserCacheRepository;

  constructor() {
    this.userCacheRepository = new UserCacheRepository();
  }

  async getUser(id: string) {
    try {
      const cacheUser = await this.userCacheRepository.getUser(id);

      if (cacheUser) {
        return cacheUser;
      }

      const user = await db.user.findFirst({
        where: {
          id,
        },
        select: this.getSelectOptions(),
      });

      if (user) {
        await this.userCacheRepository.setUser(user);
      }
      return user;
    } catch (e) {
      return null;
    }
  }

  async getUsers(
    page: number,
    pageSize: number,
    sortOrder: SortParams['sortOrder'],
  ) {
    try {
      const cachedUsers = await this.userCacheRepository.getUsers(
        page,
        pageSize,
        sortOrder,
      );

      if (!cachedUsers.length) {
        const users = await db.user.findMany({
          select: this.getSelectOptions(),
        });

        await this.userCacheRepository.setUsers(users);
        return users.slice((page - 1) * pageSize, page * pageSize);
      }

      return cachedUsers;
    } catch (e) {
      return null;
    }
  }

  async updateUser(
    id: PatchUserInput['params']['id'],
    user: PatchUserInput['body'],
  ) {
    const existingUser = await db.user.findFirst({
      where: { id },
    });

    if (!existingUser) {
      return userErrorCodes.userNotFound;
    }

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        ...user,
      },
      select: this.getSelectOptions(),
    });
    await this.userCacheRepository.deleteUser(id);
    return updatedUser;
  }

  async deleteUser(id: string) {
    try {
      await db.user.delete({
        where: { id },
      });
      await this.userCacheRepository.deleteUser(id);
    } catch (error) {
      return null;
    }
    return null;
  }

  private getSelectOptions() {
    return {
      id: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      password: false,
    };
  }
}
