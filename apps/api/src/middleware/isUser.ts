import ForbiddenError from '@api/errors/ForbiddenError';
import { NextFunction, Request, Response } from 'express';

const isUser = <TRequest extends Request>() => {
  return async (req: TRequest, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      throw new ForbiddenError({
        message: 'You are not authorized to perform this action',
        code: 'Forbidden',
        statusCode: 401,
        title: 'Forbidden',
        errors: [],
      });
    }

    if (req.session.userId !== req.params.id) {
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
export default isUser;
