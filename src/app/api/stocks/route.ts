import { NextResponse } from 'next/server';
import { fetchStockInfo } from '@/lib/api/finmind';

export const GET = async () => {
  const result = await fetchStockInfo();
  if (result.status === 'error') {
    return NextResponse.json(result, { status: 502 });
  }
  const onlyStocks = result.data.data.filter((r) => r.type === '股票');
  return NextResponse.json({
    status: 'ok',
    data: onlyStocks.map((r) => ({ stock_id: r.stock_id, stock_name: r.stock_name })),
  });
};
