import { describe, it, expect } from 'vitest';
import { formatThousand, formatYoYPercent } from '@/lib/format';

describe('formatThousand', () => {
  it('inserts thousand separators', () => {
    expect(formatThousand(1100000)).toBe('1,100,000');
  });

  it('handles zero', () => expect(formatThousand(0)).toBe('0'));

  it('handles negative', () => expect(formatThousand(-1234)).toBe('-1,234'));
});

describe('formatYoYPercent', () => {
  it('returns "-" for null', () => {
    expect(formatYoYPercent(null)).toBe('-');
  });

  it('rounds to 2 decimals', () => {
    expect(formatYoYPercent(12.345)).toBe('12.35');
    expect(formatYoYPercent(-0.526)).toBe('-0.53');
  });

  it('keeps negative sign', () => {
    expect(formatYoYPercent(-31.04)).toBe('-31.04');
  });

  it('always shows 2 decimals for integer YoY', () => {
    expect(formatYoYPercent(10)).toBe('10.00');
  });
});
