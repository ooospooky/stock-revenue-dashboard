import { describe, it, expect } from 'vitest';
import { calculateYoY } from '@/lib/revenue/calculate-yoy';

describe('calculateYoY', () => {
  it('returns positive percentage when current grew vs previous year', () => {
    expect(calculateYoY(110, 100)).toBeCloseTo(10);
  });
});
