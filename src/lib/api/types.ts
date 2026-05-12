export type ErrorCode = 'NETWORK_ERROR' | 'UNKNOWN_ERROR';

export type ApiResponse<T> =
  | { status: 'ok'; data: T }
  | { status: 'error'; code: ErrorCode; message: string };
