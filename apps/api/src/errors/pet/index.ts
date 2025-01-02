export const petErrorCodes = {
  PetNotFound: 'PetNotFound',
  PetsNotFound: 'PetsNotFound',
  PetUpdateNotAuthorised: 'PetUpdateNotAuthorised',
} as const;

export type PetErrorCode = (typeof petErrorCodes)[keyof typeof petErrorCodes];
