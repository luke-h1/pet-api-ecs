import petService, { SortOrder } from '@frontend/services/petService';
import { PaginatedList } from '@frontend/services/types/pagination';
import { UseQueryOptions } from '@tanstack/react-query';
import { Pet } from '@validation/schema/pet.schema';

const petQueries = {
  list(query: {
    page: number;
    pageSize: number;
    order?: SortOrder;
  }): UseQueryOptions<PaginatedList<Pet>> {
    return {
      queryKey: ['listPets', query],
      queryFn: () => petService.listPets(query),
    };
  },
  get(petId: string): UseQueryOptions<Pet> {
    return {
      queryKey: ['getPet', petId],
      queryFn: () => petService.getPet(petId),
    };
  },
} as const;

export default petQueries;
