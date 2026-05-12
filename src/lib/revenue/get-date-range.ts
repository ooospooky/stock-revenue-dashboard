import type { RangePreset, RevenueDateRange } from './types';

const pad2 = (n: number) => String(n).padStart(2, '0');

const toYearMonth = (year: number, month: number) => `${year}-${pad2(month)}`;
const toFirstOfMonth = (year: number, month: number) => `${year}-${pad2(month)}-01`;
const toLastOfMonth = (year: number, month: number) => {
  const last = new Date(year, month, 0).getDate();
  return `${year}-${pad2(month)}-${pad2(last)}`;
};

export const getRevenueDateRange = (range: RangePreset, now: Date): RevenueDateRange => {
  let endYear = now.getFullYear();
  let endMonth = now.getMonth(); // 0-indexed current → 1-indexed previous month

  if (endMonth === 0) {
    endYear -= 1;
    endMonth = 12;
  }

  const displayEnd = toYearMonth(endYear, endMonth);
  const fetchEnd = toLastOfMonth(endYear, endMonth);

  const displayStartYear = endYear - range;
  const displayStartMonth = endMonth + 1;
  const ds =
    displayStartMonth > 12
      ? { y: displayStartYear + 1, m: displayStartMonth - 12 }
      : { y: displayStartYear, m: displayStartMonth };

  const displayStart = toYearMonth(ds.y, ds.m);
  const fetchStart = toFirstOfMonth(ds.y - 1, ds.m);

  return { displayStart, displayEnd, fetchStart, fetchEnd };
};
