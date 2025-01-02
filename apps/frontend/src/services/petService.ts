import {
  CreatePetInput,
  Pet,
  UpdatePetInput,
} from '@validation/schema/pet.schema';
import { ServerValidationError } from '@validation/schema/response.schema';
import { petApi } from './api';
import { PaginatedList } from './types/pagination';

export type SortOrder = 'asc' | 'desc';

export interface PetListRequest {
  page: number;
  pageSize: number;
  order?: SortOrder;
}

const petService = {
  listPets: (params: PetListRequest): Promise<PaginatedList<Pet>> => {
    return petApi.get('/pets', {
      params,
    });
  },

  getPet: (id: string): Promise<Pet> => {
    return petApi.get(`/pets/${id}`);
  },
  createPet: (input: CreatePetInput): Promise<Pet> => {
    return petApi.post('/pets', input);
  },
  updatePet: (
    id: string,
    input: UpdatePetInput,
  ): Promise<Pet | ServerValidationError> => {
    return petApi.put(`/pets/${id}`, input);
  },
  deletePet: (id: string): Promise<void> => {
    return petApi.delete(`/pets/${id}`);
  },
  searchPets: (text: string): Promise<{ results: Pet[] }> => {
    return petApi.get(`/pets/search?name=${text}`);
  },
} as const;

export default petService;
