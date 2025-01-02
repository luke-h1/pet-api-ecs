import PasswordService from '../password.service';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeAll(() => {
    passwordService = new PasswordService();
  });

  describe('hashPassword', () => {
    test('hashes plain text password', async () => {
      const plainTextPasword = 'password';
      const hashedPassword =
        await passwordService.hashPassword(plainTextPasword);

      expect(hashedPassword).not.toBe(plainTextPasword);
      expect(hashedPassword).toMatch(/^\$2[ayb]\$.{56}$/);
    });
  });

  describe('isValidPassword', () => {
    test('returns true for a valid password', async () => {
      const plainTextPassword = 'password';
      const hashedPassword =
        await passwordService.hashPassword(plainTextPassword);

      const isValid = await passwordService.isValidPassword({
        plainTextPassword,
        hashedPassword,
      });
      expect(isValid).toBe(true);
    });
  });
});
