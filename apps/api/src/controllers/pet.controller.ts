import { db } from '@api/db/prisma';
import BadRequestError from '@api/errors/BadRequestError';
import NotFoundError from '@api/errors/NotFoundError';
import {
  CreatePetRequest,
  DeletePetReqeust,
  GetPetRequest,
  UpdatePetRequest,
} from '@api/requests/pet.requests';
import PetService from '@api/services/pet.service';
import createLinks from '@api/utils/createLinks';
import parsePaginationParams from '@api/utils/parsePaginationParams';
import parseSortParams from '@api/utils/parseSortParams';
import { getFullRequestUrl } from '@api/utils/requestUtils';
import { Request, Response } from 'express';

export default class PetController {
  private readonly petService: PetService;

  constructor() {
    this.petService = new PetService();
  }

  async getPets(req: Request, res: Response) {
    const { page = 1, pageSize = 20 } = parsePaginationParams(req.query);
    const { sortOrder } = parseSortParams(req.query);
    const pets = await this.petService.getPets(page, pageSize, sortOrder);

    const totalResults = await db.pet.count();
    const totalPages = pageSize > 0 ? Math.ceil(totalResults / pageSize) : 0;

    return res.status(200).json({
      results: pets,
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

  async getPet(req: GetPetRequest, res: Response) {
    const pet = await this.petService.getPet(req.params.id);

    if (!pet) {
      throw new NotFoundError({
        title: 'Pet not found',
        code: 'PetNotFound',
        message: 'Pet not found',
        statusCode: 404,
      });
    }
    return res.status(200).json(pet);
  }

  async createPet(req: CreatePetRequest, res: Response) {
    const newPet = await this.petService.createPet(
      req.body,
      req.session.userId,
    );

    if (newPet) {
      return res.status(201).json(newPet);
    }
    throw new BadRequestError();
  }

  async updatePet(req: UpdatePetRequest, res: Response) {
    const pet = req.body;
    const updatedPet = await this.petService.updatePet(req.params.id, pet);
    if (updatedPet) {
      return res.status(200).json(updatedPet);
    }
    throw new BadRequestError();
  }

  async deletePet(req: DeletePetReqeust, res: Response) {
    const result = await this.petService.deletePet(req.params.id);
    return res.status(200).json(result);
  }
}
