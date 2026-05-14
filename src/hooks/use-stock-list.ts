'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchApiResponse } from '@/lib/api/client-fetch';
import type { ApiResponse } from '@/lib/api/types';

type StockListItem = { stock_id: string; stock_name: string };

const fetchStockList = async (): Promise<ApiResponse<StockListItem[]>> => {
  return fetchApiResponse('/api/stocks');
};

export const useStockList = () =>
  useQuery({
    queryKey: ['stock-list'],
    queryFn: fetchStockList,
    staleTime: Infinity,
  });
