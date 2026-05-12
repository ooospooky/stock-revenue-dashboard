import { describe, it, expect } from 'vitest';
import { formatThousand, formatYoYPercent } from '@/lib/format';

describe('formatThousand', () => {
  it('inserts thousand separators', () => {
    expect(formatThousand(1100000)).toBe('1,100,000');
  });
});

describe('formatYoYPercent', () => {
  it('returns "-" for null', () => {
    expect(formatYoYPercent(null)).toBe('-');
  });
});
