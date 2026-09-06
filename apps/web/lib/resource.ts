export type Resource<T> =
  | { status: 'loading' }
  | { status: 'ready' | 'empty' | 'stale'; data: T }
  | { status: 'error' | 'unavailable'; message: string };
