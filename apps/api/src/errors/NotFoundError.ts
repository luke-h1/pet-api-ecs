import ApiError from './ApiError';

export default class NotFoundError extends ApiError {
  constructor(err?: ApiError) {
    super({
      title: err?.title ?? 'The requested resource could not be found.',
      type: 'Not Found',
      statusCode: 404,
      code: err?.code ?? 'NotFound',
      message:
        err?.message ??
        'The requested resource could not be found. Please check your query and try again.',
      errors: err?.errors ?? [],
    });
  }
}
