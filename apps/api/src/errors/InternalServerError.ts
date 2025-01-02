import ApiError from './ApiError';

const showStack =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export default class InternalServerError extends ApiError {
  constructor(err?: { title?: string; stack?: string }) {
    super({
      title:
        err?.title ?? 'An unexpected error occurred. Please try again later',
      type: 'Internal Server Error',
      statusCode: 500,
      message:
        'An unexpected error occurred. Please try again later or contact support',
      code: 'InternalServerError',
      stack: showStack ? err?.stack : undefined,
    });
  }
}
