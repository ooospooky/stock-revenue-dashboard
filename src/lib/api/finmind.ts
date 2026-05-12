import 'server-only';
import { z } from 'zod';
import { FinMindRevenueResponseSchema, FinMindStockInfoResponseSchema } from './finmind-schema';
import type { ApiResponse } from './types';

const FINMIND_BASE = 'https://api.finmindtrade.com/api/v4/data';
const REVALIDATE_SECONDS = 3600;

const fetchFinMind = async <T>(
  params: Record<string, string>,
  schema: z.ZodType<T>,
): Promise<ApiResponse<T>> => {
  const token = process.env.FINMIND_TOKEN;
  if (!token) {
    return { status: 'error', code: 'UNKNOWN_ERROR', message: 'FINMIND_TOKEN not configured' };
  }
  const url = `${FINMIND_BASE}?${new URLSearchParams({ ...params, token })}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      return { status: 'error', code: 'UNKNOWN_ERROR', message: `HTTP ${res.status}` };
    }
    const json = await res.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return { status: 'error', code: 'UNKNOWN_ERROR', message: 'invalid FinMind response shape' };
    }
    return { status: 'ok', data: parsed.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    return { status: 'error', code: 'NETWORK_ERROR', message };
  }
};

export const fetchRevenue = (stockId: string, startDate: string, endDate: string) =>
  fetchFinMind(
    {
      dataset: 'TaiwanStockMonthRevenue',
      data_id: stockId,
      start_date: startDate,
      end_date: endDate,
    },
    FinMindRevenueResponseSchema,
  );

export const fetchStockInfo = () =>
  fetchFinMind({ dataset: 'TaiwanStockInfo' }, FinMindStockInfoResponseSchema);
