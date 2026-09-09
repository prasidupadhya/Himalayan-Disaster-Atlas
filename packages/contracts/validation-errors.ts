import type { ErrorObject } from 'ajv';
export interface CompiledValidator<T> {
  (value: unknown): value is T;
  errors?: ErrorObject[] | null;
}
/** AJV's default error text, without importing its runtime compiler. */
export function validationErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors?.length) return 'No errors';
  return errors.map(error => `data${error.instancePath} ${error.message}`).join(', ');
}

/** Attach the schema's TypeScript type to AJV's generated boolean validator. */
export function compiledValidator<T>(source: ((value: unknown) => boolean) & { errors?: ErrorObject[] | null }): CompiledValidator<T> {
  const validate: CompiledValidator<T> = (value: unknown): value is T => {
    const valid = source(value);
    validate.errors = source.errors;
    return valid;
  };
  return validate;
}
