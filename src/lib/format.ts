export const formatThousand = (value: number): string =>
  new Intl.NumberFormat('en-US').format(value);

export const formatYoYPercent = (value: number | null): string => {
  if (value == null) return '-';
  return value.toFixed(2);
};
