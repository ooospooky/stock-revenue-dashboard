import { z } from 'zod';

export const STOCK_ID_DEFAULT = '2867';

const TAIWAN_SECURITY_ID_PATTERN = /^[0-9A-Z]{4,6}$/;

export const stockIdSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.string().regex(TAIWAN_SECURITY_ID_PATTERN));
