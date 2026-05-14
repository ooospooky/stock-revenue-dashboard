'use client';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchApiResponse } from '@/lib/api/client-fetch';
import type { ApiResponse } from '@/lib/api/types';
import type { RawRevenueRow } from '@/lib/revenue/types';

const fetchRevenueRaw = async (
  stockId: string,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<RawRevenueRow[]>> => {
  const params = new URLSearchParams({ stockId, startDate, endDate });
  return fetchApiResponse(`/api/revenue?${params}`);
};

export const useRevenue = (stockId: string, startDate: string, endDate: string) =>
  useQuery({
    queryKey: ['revenue', stockId, startDate, endDate],
    queryFn: () => fetchRevenueRaw(stockId, startDate, endDate),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
