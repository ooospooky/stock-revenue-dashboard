/**
 * Raw row as returned by FinMind TaiwanStockMonthRevenue.
 * Date is YYYY-MM-DD (always first of month).
 * revenue unit: NTD (元, not 千元).
 */
export type RawRevenueRow = {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
};

/**
 * A point in the display series.
 * date: YYYY-MM (domain format)
 * revenue: 千元 (already divided by 1000 from the raw 元)
 * yoy: percentage (e.g. 12.34 for +12.34%); null when previousYear ≤ 0
 */
export type RevenuePoint = {
  date: string;
  revenue: number;
  yoy: number | null;
};

/**
 * Fetch range uses YYYY-MM-DD (FinMind API needs daily format).
 * Display range uses YYYY-MM (domain format).
 * The asymmetry is intentional — see design.md Q4.
 */
export type RevenueDateRange = {
  fetchStart: string;
  fetchEnd: string;
  displayStart: string;
  displayEnd: string;
};

export type RangePreset = 3 | 5 | 8;
