export const calculateYoY = (current: number, previousYear: number | undefined | null): number | null => {
  if (previousYear == null) return null;
  if (previousYear <= 0) return null;
  return (current / previousYear - 1) * 100;
};
