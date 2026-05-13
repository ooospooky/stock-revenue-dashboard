import { describe, expect, it } from 'vitest';
import { STOCK_ID_DEFAULT, stockIdSchema } from '@/lib/stock-id';

describe('stockIdSchema', () => {
  it('accepts the default four-digit stock id', () => {
    expect(stockIdSchema.parse(STOCK_ID_DEFAULT)).toBe(STOCK_ID_DEFAULT);
  });

  it('accepts alphanumeric Taiwan security ids such as bond ETF symbols', () => {
    expect(stockIdSchema.parse('00880B')).toBe('00880B');
  });

  it('normalizes lowercase letters from URL input', () => {
    expect(stockIdSchema.parse('00880b')).toBe('00880B');
  });

  it('rejects unsafe or out-of-shape query input', () => {
    expect(stockIdSchema.safeParse('00880B;DROP').success).toBe(false);
    expect(stockIdSchema.safeParse('123').success).toBe(false);
  });
});
