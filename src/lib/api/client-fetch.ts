import type { ApiResponse, ErrorCode } from './types';

const ERROR_CODES = new Set<string>(['NETWORK_ERROR', 'UNKNOWN_ERROR']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isErrorCode = (value: unknown): value is ErrorCode =>
  typeof value === 'string' && ERROR_CODES.has(value);

const isApiErrorResponse = (value: unknown): value is ApiResponse<never> =>
  isRecord(value) &&
  value.status === 'error' &&
  isErrorCode(value.code) &&
  typeof value.message === 'string';

const isApiOkResponse = <T>(value: unknown): value is ApiResponse<T> =>
  isRecord(value) && value.status === 'ok' && 'data' in value;

export const fetchApiResponse = async <T>(
  input: RequestInfo | URL,
): Promise<ApiResponse<T>> => {
  const response = await fetch(input);
  const json: unknown = await response.json();

  if (isApiErrorResponse(json)) {
    return json;
  }

  if (!response.ok) {
    throw new Error(`Request failed with HTTP ${response.status}`);
  }

  if (isApiOkResponse<T>(json)) {
    return json;
  }

  throw new Error('Invalid API response shape');
};
