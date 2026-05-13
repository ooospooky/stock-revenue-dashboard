export type RevenueDisplayUnit = {
  label: '千元' | '萬元' | '億元';
  divisor: number;
  maximumFractionDigits: number;
};

const REVENUE_THOUSAND_TO_NTD_MULTIPLIER = 1000;
const TEN_THOUSAND_UNIT_THRESHOLD = 100_000;
const HUNDRED_MILLION_UNIT_THRESHOLD = 1_000_000;

const THOUSAND_UNIT: RevenueDisplayUnit = {
  label: '千元',
  divisor: 1,
  maximumFractionDigits: 0,
};

const TEN_THOUSAND_UNIT: RevenueDisplayUnit = {
  label: '萬元',
  divisor: 10,
  maximumFractionDigits: 1,
};

const HUNDRED_MILLION_UNIT: RevenueDisplayUnit = {
  label: '億元',
  divisor: 100_000,
  maximumFractionDigits: 1,
};

const numberFormatter = (
  maximumFractionDigits: number,
): Intl.NumberFormat =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  });

export const formatThousand = (value: number): string =>
  new Intl.NumberFormat('en-US').format(value);

export const formatRevenueFullAmount = (valueInThousands: number): string =>
  formatThousand(valueInThousands * REVENUE_THOUSAND_TO_NTD_MULTIPLIER);

export const formatYoYPercent = (value: number | null): string => {
  if (value == null) return '-';
  return value.toFixed(2);
};

export const getRevenueDisplayUnit = (values: number[]): RevenueDisplayUnit => {
  const maxAbsValue = values.reduce(
    (currentMax, value) => Math.max(currentMax, Math.abs(value)),
    0,
  );

  if (maxAbsValue >= HUNDRED_MILLION_UNIT_THRESHOLD) {
    return HUNDRED_MILLION_UNIT;
  }

  if (maxAbsValue >= TEN_THOUSAND_UNIT_THRESHOLD) {
    return TEN_THOUSAND_UNIT;
  }

  return THOUSAND_UNIT;
};

export const formatRevenueByUnit = (
  value: number,
  unit: RevenueDisplayUnit,
): string => numberFormatter(unit.maximumFractionDigits).format(value / unit.divisor);
