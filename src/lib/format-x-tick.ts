export const formatXAxisTick = (value: string): string => {
  if (!value || typeof value !== 'string') return '';
  const [year, month] = value.split('-');
  if (month === '01') return year;
  return '';
};
