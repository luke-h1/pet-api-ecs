import bcrypt from 'bcryptjs';

export default class PasswordService {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = 10;
  }

  async isValidPassword({
    plainTextPassword,
    hashedPassword,
  }: {
    plainTextPassword: string;
    hashedPassword: string;
  }): Promise<boolean> {
    const result = await bcrypt.compare(plainTextPassword, hashedPassword);
    return result;
  }

  async hashPassword(plainTextPassword: string): Promise<string> {
    const hash = await bcrypt.hash(plainTextPassword, this.saltRounds);
    return hash;
  }
}
