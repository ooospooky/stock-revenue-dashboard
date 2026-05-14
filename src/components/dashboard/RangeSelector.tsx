'use client';
import { MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRange } from '@/hooks/use-range';
import type { RangePreset } from '@/lib/revenue/types';

const PRESETS: RangePreset[] = [3, 5, 8];

export const RangeSelector = () => {
  const theme = useTheme();
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
      sx={{
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.typography.body2.fontSize,
        borderRadius: `${theme.shape.borderRadiusBadge}px`,
        '& .MuiSelect-icon': { color: theme.palette.primary.contrastText },
      }}
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
