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
});
