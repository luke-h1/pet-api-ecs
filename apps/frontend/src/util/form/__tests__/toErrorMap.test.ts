import { ServerValidationError } from '@validation/schema/response.schema';
import toErrorMap from '../toErrorMap';

describe('toErrorMap', () => {
  test('should return empty array when there are no errors', () => {
    const result = toErrorMap(null);
    expect(result).toEqual([]);
  });

  test('should map errors to form fields correctly', () => {
    const errors: ServerValidationError['errors'] = [
      {
        code: 'email',
        expected: 'A valid email',
        received: 'invalid email format',
        message: 'Invalid email format',
        path: ['body', 'email'],
      },
      {
        code: 'password',
        expected: 'At least 8 characters',
        received: 'too short',
        message: 'Password too short',
        path: ['body', 'password'],
      },
    ];

    const result = toErrorMap(errors);
    expect(result).toEqual([
      {
        field: 'email',
        message: 'Invalid email format',
      },
      {
        field: 'password',
        message: 'Password too short',
      },
    ]);
  });

  test('should return field as first path element when path length is 1', () => {
    const errors: ServerValidationError['errors'] = [
      {
        code: 'email',
        expected: 'a valid email',
        message: 'Invalid email format',
        path: ['email'],
        received: 'invalid email',
      },
    ];

    const result = toErrorMap(errors);
    expect(result).toEqual([
      { field: 'email', message: 'Invalid email format' },
    ]);
  });
});
