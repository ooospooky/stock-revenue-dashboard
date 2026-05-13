import { describe, it, expect } from 'vitest';
import { formatXAxisTick } from '@/lib/format-x-tick';

describe('formatXAxisTick', () => {
  it('returns year only when month is 01', () => {
    expect(formatXAxisTick('2024-01')).toBe('2024');
  });

  it('returns empty string for non-January months', () => {
    expect(formatXAxisTick('2024-02')).toBe('');
    expect(formatXAxisTick('2024-12')).toBe('');
  });

  it('handles malformed input gracefully', () => {
    expect(formatXAxisTick('')).toBe('');
  });

  it('ignores ISO date strings with day component', () => {
    expect(formatXAxisTick('2024-01-15')).toBe('');
  });
});
