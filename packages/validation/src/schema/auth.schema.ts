import { z } from '@validation/util/validation';
import omit from 'lodash/omit';

export const loginPayload = {
  email: z.string().email(),
  password: z.string().min(6),
};

export const registerPayload = {
  ...loginPayload,
  firstName: z.string(),
  lastName: z.string(),
};

export const createUserSchema = z.object({
  body: z.object({
    ...registerPayload,
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    ...loginPayload,
  }),
});

export const resetPasswordSchmea = z.object({
  body: z.object({
    ...omit(loginPayload, 'password'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchmea>;
