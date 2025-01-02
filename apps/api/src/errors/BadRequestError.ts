import ApiError from './ApiError';

export default class BadRequestError extends ApiError {
  constructor(err?: ApiError) {
    super({
      title:
        err?.title ?? 'Request could not be completed due to malformed data',
      type: 'Bad request',
      statusCode: 400,
      errors: err?.errors ?? [],
      message: err?.message ?? 'unknown',
      code: err?.code ?? 'BadRequest',
    });
  }
}
