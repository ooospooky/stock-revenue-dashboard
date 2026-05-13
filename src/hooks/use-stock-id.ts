'use client';
import { useQueryState, parseAsString } from 'nuqs';
import { STOCK_ID_DEFAULT, stockIdSchema } from '@/lib/stock-id';

export const useStockId = () => {
  const [raw, setRaw] = useQueryState(
    'stockId',
    parseAsString.withDefault(STOCK_ID_DEFAULT),
  );
  const parsed = stockIdSchema.safeParse(raw);
  const value = parsed.success ? parsed.data : STOCK_ID_DEFAULT;
  return [value, setRaw] as const;
};
