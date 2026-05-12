import { describe, it, expect } from 'vitest';
import { getRevenueDateRange } from '@/lib/revenue/get-date-range';

describe('getRevenueDateRange', () => {
  it('5-year preset: displayEnd is previous month, displayStart is 5 years before, fetchStart adds 12-month lookback', () => {
    const now = new Date('2026-05-12');
    const range = getRevenueDateRange(5, now);
    expect(range.displayEnd).toBe('2026-04');
    expect(range.displayStart).toBe('2021-05');
    expect(range.fetchEnd).toBe('2026-04-30');
    expect(range.fetchStart).toBe('2020-05-01');
  });

  it('3-year preset works', () => {
    const r = getRevenueDateRange(3, new Date('2026-05-12'));
    expect(r.displayStart).toBe('2023-05');
    expect(r.displayEnd).toBe('2026-04');
  });

  it('8-year preset works', () => {
    const r = getRevenueDateRange(8, new Date('2026-05-12'));
    expect(r.displayStart).toBe('2018-05');
  });

  it('January boundary: displayEnd is previous December', () => {
    const r = getRevenueDateRange(5, new Date('2026-01-15'));
    expect(r.displayEnd).toBe('2025-12');
    expect(r.displayStart).toBe('2021-01');
    expect(r.fetchStart).toBe('2020-01-01');
  });
});
