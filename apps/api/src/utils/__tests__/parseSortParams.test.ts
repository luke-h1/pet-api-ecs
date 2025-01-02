import parseSortParams from '../parseSortParams';

describe('parseSortParams', () => {
  test('should parse valid sortOrder as strings', () => {
    const query = {
      order: 'asc',
    };

    const result = parseSortParams(query);

    expect(result).toEqual({ sortOrder: 'asc' });
  });

  test('should return undefined for empty query', () => {
    const query = {};

    const result = parseSortParams(query);

    expect(result).toEqual({ sortOrder: undefined });
  });

  test('should return undefined for invalid order', () => {
    const query = {
      order: 'hello',
    };

    const result = parseSortParams(query);

    expect(result).toEqual({ sortOrder: undefined });
  });
});
