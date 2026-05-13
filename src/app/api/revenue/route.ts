import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchRevenue } from '@/lib/api/finmind';
import { stockIdSchema } from '@/lib/stock-id';

const QuerySchema = z.object({
  stockId: stockIdSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const parsed = QuerySchema.safeParse({
    stockId: searchParams.get('stockId'),
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', code: 'UNKNOWN_ERROR', message: 'invalid query' },
      { status: 400 },
    );
  }
  const { stockId, startDate, endDate } = parsed.data;
  const result = await fetchRevenue(stockId, startDate, endDate);
  if (result.status === 'error') {
    return NextResponse.json(result, { status: 502 });
  }
  return NextResponse.json({ status: 'ok', data: result.data.data });
};
