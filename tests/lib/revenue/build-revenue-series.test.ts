import { describe, it, expect } from 'vitest';
import { buildRevenueSeries } from '@/lib/revenue/build-revenue-series';
import type { RawRevenueRow } from '@/lib/revenue/types';

const row = (date: string, revenue: number): RawRevenueRow => ({
  date,
  stock_id: '2867',
  country: 'Taiwan',
  revenue,
  revenue_year: Number(date.slice(0, 4)),
  revenue_month: Number(date.slice(5, 7)),
});

describe('buildRevenueSeries', () => {
  it('filters to display range and computes YoY using lookback rows', () => {
    const raw: RawRevenueRow[] = [
      row('2020-01-01', 1000_000), // lookback only
      row('2021-01-01', 1100_000), // display, yoy uses 2020-01
    ];
    const result = buildRevenueSeries(raw, '2021-01', '2021-01');
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2021-01');
    expect(result[0].revenue).toBe(1100);
    expect(result[0].yoy).toBeCloseTo(10);
  });

  it('returns yoy=null when previous year row is missing from raw data', () => {
    const raw = [row('2021-06-01', 1000_000)]; // no 2020-06 row
    expect(buildRevenueSeries(raw, '2021-06', '2021-06')).toEqual([
      { date: '2021-06', revenue: 1000, yoy: null },
    ]);
  });
});
