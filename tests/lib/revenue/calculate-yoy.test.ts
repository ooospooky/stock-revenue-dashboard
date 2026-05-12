import { describe, it, expect } from 'vitest';
import { calculateYoY } from '@/lib/revenue/calculate-yoy';

describe('calculateYoY', () => {
  it('returns positive percentage when current grew vs previous year', () => {
    expect(calculateYoY(110, 100)).toBeCloseTo(10);
  });

  it('returns negative percentage when current shrank', () => {
    expect(calculateYoY(80, 100)).toBeCloseTo(-20);
  });

  it('returns -100 when current is zero (legitimate, not null)', () => {
    expect(calculateYoY(0, 100)).toBe(-100);
  });

  it('returns null when previousYear is zero (division undefined)', () => {
    expect(calculateYoY(100, 0)).toBeNull();
  });

  it('returns null when previousYear is negative', () => {
    expect(calculateYoY(100, -50)).toBeNull();
  });
});
