import parsePaginationParams from '../parsePaginationParams';

describe('parsePaginationParams', () => {
  test('should parse valid page and pageSize as numbers', () => {
    const query = {
      page: '2',
      pageSize: '10',
    };

    const result = parsePaginationParams(query);
    expect(result).toEqual({
      page: 2,
      pageSize: 10,
    });
  });

  test('should turn negative numbers into the default paging', () => {
    const query = {
      page: '-1',
      pageSize: '-11111110',
    };

    const result = parsePaginationParams(query);
    expect(result).toEqual({
      page: 1,
      pageSize: 10,
    });
  });

  test('should return undefined for empty query', () => {
    const query = {};
    const result = parsePaginationParams(query);
    expect(result).toEqual({ page: undefined, pageSize: undefined });
  });

  test('should return undefined for invalid page and pageSize', () => {
    const query = { page: 'abc', pageSize: 'xyz' };
    const result = parsePaginationParams(query);
    expect(result).toEqual({ page: undefined, pageSize: undefined });
  });
});
