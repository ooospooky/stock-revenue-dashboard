import { NextResponse } from 'next/server';
import { fetchStockInfo } from '@/lib/api/finmind';

export const GET = async () => {
  const result = await fetchStockInfo();
  if (result.status === 'error') {
    return NextResponse.json(result, { status: 502 });
  }
  // FinMind type values: 'twse' (上市), 'tpex' (上櫃), 'emerging' (興櫃)
  // Exclude 'emerging' — lower liquidity, revenue data less reliable
  const onlyStocks = result.data.data.filter((r) => r.type === 'twse' || r.type === 'tpex');
  return NextResponse.json({
    status: 'ok',
    data: onlyStocks.map((r) => ({ stock_id: r.stock_id, stock_name: r.stock_name })),
  });
};
