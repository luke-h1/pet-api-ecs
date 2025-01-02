import { PaginatedLinks } from '@validation/schema/links.schema';

export interface PaginatedList<T> {
  results: T[];
  _links: PaginatedLinks;
  paging: Paging;
}

export interface Paging {
  query: string;
  page: number;
  totalPages: number;
  totalResults: number;
}
