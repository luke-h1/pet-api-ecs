import ApiError from './ApiError';

export default class ForbiddenError extends ApiError {
  constructor(err?: ApiError) {
    super({
      title: err?.title ?? 'You are not authorized to perform this action',
      type: 'Forbidden',
      statusCode: 401,
      code: err?.code ?? 'Forbidden',
      message: err?.message ?? 'You are not authorized to perform this action',
      errors: err?.errors ?? [],
      stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    });
  }
}
