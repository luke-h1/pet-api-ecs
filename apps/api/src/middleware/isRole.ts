import { db } from '@api/db/prisma';
import ForbiddenError from '@api/errors/ForbiddenError';
import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const isRole = <TRole extends Role>(role: TRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      throw new ForbiddenError({
        message: 'You are not authorized to perform this action',
        code: 'Forbidden',
        statusCode: 401,
        title: 'Forbidden',
        errors: [],
      });
    }

    const user = await db.user.findFirst({
      where: {
        id: req.session.userId,
      },
    });

    if (!user) {
      throw new ForbiddenError({
        message: 'You are not authorized to perform this action',
        code: 'Forbidden',
        statusCode: 401,
        title: 'Forbidden',
        errors: [],
      });
    }

    if (user.role !== role) {
      throw new ForbiddenError({
        message: 'You are not authorized to perform this action',
        code: 'Forbidden',
        statusCode: 401,
        title: 'Forbidden',
        errors: [],
      });
    }

    next();
  };
};
export default isRole;
