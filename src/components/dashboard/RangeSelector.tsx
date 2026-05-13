'use client';
import { MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useRange } from '@/hooks/use-range';
import type { RangePreset } from '@/lib/revenue/types';

const PRESETS: RangePreset[] = [3, 5, 8];

const SELECT_SX = {
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  fontWeight: 500,
  minWidth: 120,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.dark' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.dark' },
  '& .MuiSelect-icon': { color: 'primary.contrastText' },
};

export const RangeSelector = () => {
  const [range, setRange] = useRange();

  const handleChange = (event: SelectChangeEvent<RangePreset>) => {
    const next = event.target.value;
    if (typeof next === 'number') setRange(next);
  };

  return (
    <Select<RangePreset>
      value={range}
      onChange={handleChange}
      size="small"
      sx={SELECT_SX}
      inputProps={{ 'aria-label': '時間範圍' }}
    >
      {PRESETS.map((p) => (
        <MenuItem key={p} value={p}>
          近 {p} 年
        </MenuItem>
      ))}
    </Select>
  );
};
