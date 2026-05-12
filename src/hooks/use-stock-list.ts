'use client';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@/lib/api/types';

type StockListItem = { stock_id: string; stock_name: string };

const fetchStockList = async (): Promise<ApiResponse<StockListItem[]>> => {
  const res = await fetch('/api/stocks');
  return res.json();
};

export const useStockList = () =>
  useQuery({
    queryKey: ['stock-list'],
    queryFn: fetchStockList,
    staleTime: Infinity,
  });
