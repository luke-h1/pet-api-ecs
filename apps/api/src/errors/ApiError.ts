import { z } from '@validation/util/validation';

type ErrorCode = 'InternalServerError' | 'NotFound' | 'BadRequest' | string;

interface ApiErrorOptions {
  title: string;
  statusCode: number;
  type?: string;
  code: ErrorCode;
  message: string;
  errors?: z.ZodIssue[];
  stack?: string;
}

export default class ApiError implements ApiErrorOptions {
  public title: string;

  public statusCode: number;

  public type?: string;

  public code: ErrorCode;

  public errors?: z.ZodIssue[];

  public message: string;

  public stack?: string;

  constructor({
    title,
    type,
    code,
    errors,
    statusCode,
    message,
    stack,
  }: ApiErrorOptions) {
    this.title = title;
    this.type = type;
    this.code = code;
    this.errors = errors;
    this.statusCode = statusCode;
    this.message = message;
    this.stack = stack;
  }
}
