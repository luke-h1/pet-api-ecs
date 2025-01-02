import { db } from '@api/db/prisma';
import { petErrorCodes } from '@api/errors/pet';
import logger from '@api/utils/logger';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to validate if the user is the owner of the pet
 */
const isPetOwner = <TRequest extends Request>() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line consistent-return
  return async (req: TRequest, res: Response, next: NextFunction) => {
    try {
      const pet = await db.pet.findFirst({
        where: {
          id: req.params.id,
        },
      });

      if (!pet) {
        return res.status(404).json({
          code: 'PetNotFound',
          message: 'Pet not found. Please check your query and try again',
          statusCode: 404,
          title: 'pet not found',
        });
      }

      if (pet.creatorId !== req.session.userId) {
        logger.info(
          `${petErrorCodes.PetUpdateNotAuthorised} triggered. User ${req.session.userId} is not authorised to perform operations on ${pet.id}`,
        );

        return res.status(401).json({
          code: 'forbidden',
          message: 'You are not authorized to perform this action',
          statusCode: 401,
          title: 'You are not authorized to perform this action',
          type: 'Forbidden',
          errors: [],
        });
      }

      logger.info('[isPetOwner]: validation passed');
      next();
    } catch (error) {
      logger.warn('isPetOwner exception caught', error);
    }
  };
};
export default isPetOwner;
