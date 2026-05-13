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
    expect(result[0].revenueInThousands).toBe(1100);
    expect(result[0].yoy).toBeCloseTo(10);
  });

  it('returns yoy=null when previous year row is missing from raw data', () => {
    const raw = [row('2021-06-01', 1000_000)]; // no 2020-06 row
    expect(buildRevenueSeries(raw, '2021-06', '2021-06')).toEqual([
      { date: '2021-06', revenueInThousands: 1000, yoy: null },
    ]);
  });

  it('returns yoy=null when previous-year revenue is 0', () => {
    const raw = [row('2020-03-01', 0), row('2021-03-01', 5_000_000)];
    expect(buildRevenueSeries(raw, '2021-03', '2021-03')).toEqual([
      { date: '2021-03', revenueInThousands: 5000, yoy: null },
    ]);
  });

  it('excludes lookback rows from result even if data exists', () => {
    const raw = [
      row('2020-12-01', 1000_000),
      row('2021-01-01', 1100_000),
      row('2021-02-01', 1200_000),
    ];
    const out = buildRevenueSeries(raw, '2021-01', '2021-02');
    expect(out.map((p) => p.date)).toEqual(['2021-01', '2021-02']);
  });

  it('sorts output by date ascending even if input is shuffled', () => {
    const raw = [
      row('2021-03-01', 3000_000),
      row('2021-01-01', 1000_000),
      row('2021-02-01', 2000_000),
    ];
    const dates = buildRevenueSeries(raw, '2021-01', '2021-03').map((p) => p.date);
    expect(dates).toEqual(['2021-01', '2021-02', '2021-03']);
  });

  it('returns empty array when raw is empty', () => {
    expect(buildRevenueSeries([], '2021-01', '2021-12')).toEqual([]);
  });
});
