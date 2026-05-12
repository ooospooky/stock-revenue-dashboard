'use client';
import { useQueryState, parseAsInteger } from 'nuqs';
import { z } from 'zod';
import type { RangePreset } from '@/lib/revenue/types';

const RANGE_DEFAULT: RangePreset = 5;
const rangeSchema = z.union([z.literal(3), z.literal(5), z.literal(8)]);

export const useRange = () => {
  const [raw, setRaw] = useQueryState('range', parseAsInteger.withDefault(RANGE_DEFAULT));
  const parsed = rangeSchema.safeParse(raw);
  const value: RangePreset = parsed.success ? parsed.data : RANGE_DEFAULT;
  const setValue = (next: RangePreset) => setRaw(next);
  return [value, setValue] as const;
};
