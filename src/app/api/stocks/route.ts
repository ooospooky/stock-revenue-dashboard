import { NextResponse } from 'next/server';
import { fetchStockInfo } from '@/lib/api/finmind';

// These categories have no monthly revenue data (indices, ETFs, depositary receipts, etc.)
const EXCLUDED_INDUSTRY_CATEGORIES = new Set([
  'ETF',
  '上櫃指數股票型基金(ETF)',
  'Index',
  '大盤',
  '指數投資證券(ETN)',
  '受益證券',
  '存託憑證',
]);

export const GET = async () => {
  const result = await fetchStockInfo();
  if (result.status === 'error') {
    return NextResponse.json(result, { status: 502 });
  }
  const seen = new Map<string, { stock_id: string; stock_name: string }>();
  for (const r of result.data.data) {
    if (EXCLUDED_INDUSTRY_CATEGORIES.has(r.industry_category)) continue;
    if (!seen.has(r.stock_id)) {
      seen.set(r.stock_id, { stock_id: r.stock_id, stock_name: r.stock_name });
    }
  }
  return NextResponse.json({ status: 'ok', data: Array.from(seen.values()) });
};
