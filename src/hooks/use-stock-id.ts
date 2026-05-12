'use client';
import { useQueryState, parseAsString } from 'nuqs';
import { z } from 'zod';

const STOCK_ID_DEFAULT = '2867';
const stockIdSchema = z.string().regex(/^\d{4}$/);

export const useStockId = () => {
  const [raw, setRaw] = useQueryState(
    'stockId',
    parseAsString.withDefault(STOCK_ID_DEFAULT),
  );
  const parsed = stockIdSchema.safeParse(raw);
  const value = parsed.success ? parsed.data : STOCK_ID_DEFAULT;
  return [value, setRaw] as const;
};
