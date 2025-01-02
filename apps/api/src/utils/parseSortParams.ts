import { ParsedQs } from 'qs';

export interface SortParams {
  sortOrder?: 'asc' | 'desc';
}

export default function parseSortParams(query: ParsedQs): SortParams {
  const sortOrder = query.order as 'asc' | 'desc';

  if (!sortOrder) {
    return {
      sortOrder: undefined,
    };
  }

  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    return {
      sortOrder: undefined,
    };
  }

  return {
    sortOrder,
  };
}
