import { calculateYoY } from './calculate-yoy';
import type { RawRevenueRow, RevenuePoint } from './types';

const toYearMonth = (ymd: string): string => ymd.slice(0, 7);
const previousYear = (ym: string): string => {
  const [y, m] = ym.split('-');
  return `${Number(y) - 1}-${m}`;
};
const inRange = (ym: string, start: string, end: string) => ym >= start && ym <= end;

export const buildRevenueSeries = (
  raw: RawRevenueRow[],
  displayStart: string,
  displayEnd: string,
): RevenuePoint[] => {
  const byMonth = new Map<string, number>();
  for (const row of raw) {
    byMonth.set(toYearMonth(row.date), row.revenue);
  }
  const points: RevenuePoint[] = [];
  for (const row of raw) {
    const ym = toYearMonth(row.date);
    if (!inRange(ym, displayStart, displayEnd)) continue;
    const prev = byMonth.get(previousYear(ym));
    points.push({
      date: ym,
      revenueInThousands: row.revenue / 1000,
      yoy: calculateYoY(row.revenue, prev),
    });
  }
  return points.sort((a, b) => a.date.localeCompare(b.date));
};
