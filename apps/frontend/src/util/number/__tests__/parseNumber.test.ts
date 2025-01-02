import parseNumber from '../parseNumber';

describe('parseNumber', () => {
  test('should parse a valid number string', () => {
    expect(parseNumber('123')).toBe(123);
  });

  test('should return undefined for an invalid number string', () => {
    expect(parseNumber('abc')).toBeUndefined();
  });

  test('should return undefined for an empty string', () => {
    expect(parseNumber('')).toBeUndefined();
  });

  test('should return the number testself if a number is passed', () => {
    expect(parseNumber(123)).toBe(123);
  });

  test('should return undefined for NaN', () => {
    expect(parseNumber(NaN)).toBeUndefined();
  });

  test('should return undefined for undefined', () => {
    expect(parseNumber(undefined)).toBeUndefined();
  });

  test('should return undefined for null', () => {
    expect(parseNumber(null)).toBeUndefined();
  });

  test('should return undefined for an object', () => {
    expect(parseNumber({})).toBeUndefined();
  });

  test('should return undefined for an array', () => {
    expect(parseNumber([])).toBeUndefined();
  });
});
