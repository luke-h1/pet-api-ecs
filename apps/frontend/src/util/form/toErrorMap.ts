import { ServerValidationError } from '@validation/schema/response.schema';

interface FormFieldError {
  field: string;
  message: string;
}

type Maybe<T> = T | null | undefined;

export default function toErrorMap(
  errors: Maybe<ServerValidationError['errors']>,
): FormFieldError[] {
  if (!errors) {
    return [];
  }

  return errors.map(err => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - types are slightly off here - need to improve
    field: err.path[1] || err.path[0],
    message: err.message,
  }));
}
