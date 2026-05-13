import { describe, it, expect } from 'vitest';
import {
  formatRevenueFullAmount,
  formatRevenueByUnit,
  formatThousand,
  formatYoYPercent,
  getRevenueDisplayUnit,
} from '@/lib/format';

describe('formatThousand', () => {
  it('inserts thousand separators', () => {
    expect(formatThousand(1100000)).toBe('1,100,000');
  });

  it('handles zero', () => expect(formatThousand(0)).toBe('0'));

  it('handles negative', () => expect(formatThousand(-1234)).toBe('-1,234'));
});

describe('formatRevenueFullAmount', () => {
  it('converts 千元-domain revenue back to full NTD amount', () => {
    expect(formatRevenueFullAmount(96137)).toBe('96,137,000');
  });
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

describe('getRevenueDisplayUnit', () => {
  it('keeps small revenue values in 千元', () => {
    expect(getRevenueDisplayUnit([96137]).label).toBe('千元');
  });

  it('uses 萬元 for medium revenue values', () => {
    expect(getRevenueDisplayUnit([120000]).label).toBe('萬元');
  });

  it('uses 億元 for large revenue values', () => {
    expect(getRevenueDisplayUnit([250000000]).label).toBe('億元');
  });

  it('uses absolute values for negative chart domains', () => {
    expect(getRevenueDisplayUnit([-1000000]).label).toBe('億元');
  });
});

describe('formatRevenueByUnit', () => {
  it('formats revenue in 千元', () => {
    const unit = getRevenueDisplayUnit([96137]);

    expect(formatRevenueByUnit(96137, unit)).toBe('96,137');
  });

  it('formats revenue in 萬元', () => {
    const unit = getRevenueDisplayUnit([120000]);

    expect(formatRevenueByUnit(96137, unit)).toBe('9,613.7');
  });

  it('formats revenue in 億元', () => {
    const unit = getRevenueDisplayUnit([250000000]);

    expect(formatRevenueByUnit(250610000, unit)).toBe('2,506.1');
  });
});
