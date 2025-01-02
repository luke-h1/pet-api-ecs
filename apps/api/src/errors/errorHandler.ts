import logger from '@api/utils/logger';
import { ErrorRequestHandler } from 'express';
import ApiError from './ApiError';
import BadRequestError from './BadRequestError';
import ForbiddenError from './ForbiddenError';
import InternalServerError from './InternalServerError';
import NotFoundError from './NotFoundError';

const errorHandler: ErrorRequestHandler<{}, ApiError | string> = (
  err,
  req,
  res,
  _,
) => {
  // eslint-disable-next-line no-shadow
  const handleApiError = (err: unknown) => {
    if (err instanceof ApiError) {
      return err;
    }

    if (err instanceof NotFoundError) {
      return new ApiError({
        title: 'The requested resource could not be found.',
        statusCode: 404,
        message:
          'The requested resource could not be found. Please check the URL and try again.',
        type: 'Not Found',
        code: 'NotFound',
      });
    }

    if (err instanceof BadRequestError) {
      return new ApiError({
        title: 'The request is invalid.',
        statusCode: 400,
        message:
          'The request is invalid. Please check the request and try again.',
        type: 'Bad Request',
        code: 'BadRequest',
      });
    }

    if (err instanceof ForbiddenError) {
      return new ApiError({
        title: 'You are not authorized to perform this action',
        statusCode: 401,
        message: 'You are not authorized to perform this action',
        type: 'Forbidden',
        code: 'Forbidden',
      });
    }

    logger.error(
      `[errorHandler]: An unexpected error occurred: err -> ${JSON.stringify(err, null, 2)}`,
    );

    return new InternalServerError();
  };

  const apiError = handleApiError(err);

  res.status(apiError.statusCode).send(apiError).end();
};
export default errorHandler;
