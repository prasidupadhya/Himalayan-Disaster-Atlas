import type { ValidateFunction } from 'ajv';

/** Compile a synchronous schema only when its feature actually validates data.
 * The same AJV validator and error details are retained after first use. */
export function lazyValidator<T>(compile: () => ValidateFunction<T>): ValidateFunction<T> {
  let compiled: ValidateFunction<T> | undefined;
  const validate = ((value: unknown): value is T => {
    compiled ??= compile();
    const valid = compiled(value);
    validate.errors = compiled.errors;
    if (typeof valid !== 'boolean') throw new Error('Only synchronous validators are supported');
    return valid;
  }) as ValidateFunction<T>;
  return validate;
}
