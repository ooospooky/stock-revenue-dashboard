export const formatXAxisTick = (value: string): string => {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return '';
  return match[2] === '01' ? match[1] : '';
};
