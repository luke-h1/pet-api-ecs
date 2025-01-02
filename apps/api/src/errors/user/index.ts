export const userErrorCodes = {
  userNotFound: 'UserNotFound',
} as const;

export type UserErrorCode =
  (typeof userErrorCodes)[keyof typeof userErrorCodes];
