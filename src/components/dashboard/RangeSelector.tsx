'use client';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useRange } from '@/hooks/use-range';
import type { RangePreset } from '@/lib/revenue/types';

const PRESETS: RangePreset[] = [3, 5, 8];

export const RangeSelector = () => {
  const [range, setRange] = useRange();
  return (
    <ToggleButtonGroup
      value={range}
      exclusive
      size="small"
      onChange={(_, v: RangePreset | null) => v && setRange(v)}
    >
      {PRESETS.map((p) => (
        <ToggleButton key={p} value={p}>
          近 {p} 年
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
