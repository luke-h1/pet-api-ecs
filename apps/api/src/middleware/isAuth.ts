import ForbiddenError from '@api/errors/ForbiddenError';
import { NextFunction, Request, Response } from 'express';

const isAuth = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      throw new ForbiddenError({
        message: 'You are not authorized to perform this action',
        code: 'Forbidden',
        statusCode: 401,
        title: 'Forbidden',
        errors: [],
      });
    }
    next();
    // eslint-disable-next-line consistent-return, no-useless-return
    return;
  };
};
export default isAuth;
