export const authErrorCodes = {
  EmailAlreadyExists: 'EmailAlreadyExists',
  UserNotFound: 'UserNotFound',
  InvalidCredentials: 'InvalidCredentials',
} as const;

export type AuthErrorCode =
  (typeof authErrorCodes)[keyof typeof authErrorCodes];
