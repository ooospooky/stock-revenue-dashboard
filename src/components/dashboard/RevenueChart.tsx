'use client';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RevenuePoint } from '@/lib/revenue/types';
import { formatThousand, formatYoYPercent } from '@/lib/format';
import { formatXAxisTick } from '@/lib/format-x-tick';
import { SectionLabel } from './SectionLabel';
import { RangeSelector } from './RangeSelector';

type TooltipPayload = { dataKey: 'revenue' | 'yoy'; value: number | null }[];

const RevenueTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const revenue = payload.find((p) => p.dataKey === 'revenue')?.value;
  const yoy = payload.find((p) => p.dataKey === 'yoy')?.value;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', p: 1, fontSize: 13 }}>
      <div>{label}</div>
      <div>每月營收：{revenue != null ? formatThousand(revenue) : '-'} 千元</div>
      <div>單月營收年增率：{formatYoYPercent(yoy ?? null)} %</div>
    </Box>
  );
};

const CHART_HEADER_SX = {
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1,
};

const UNIT_LABEL_LEFT_SX = {
  position: 'absolute',
  top: 0,
  left: 0,
  color: 'text.secondary',
  zIndex: 1,
};

const UNIT_LABEL_RIGHT_SX = {
  position: 'absolute',
  top: 0,
  right: 0,
  color: 'text.secondary',
  zIndex: 1,
};

export const RevenueChart = ({ data }: { data: RevenuePoint[] }) => {
  const theme = useTheme();
  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={CHART_HEADER_SX}>
        <SectionLabel>每月營收</SectionLabel>
        <RangeSelector />
      </Stack>

      <Box sx={{ position: 'relative', width: '100%' }}>
        <Typography variant="body2" sx={UNIT_LABEL_LEFT_SX}>
          千元
        </Typography>
        <Typography variant="body2" sx={UNIT_LABEL_RIGHT_SX}>
          %
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={{ top: 30, right: 30, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              interval={0}
              tickFormatter={formatXAxisTick}
              tickLine={false}
            />
            <YAxis yAxisId="left" tickFormatter={(v: number) => formatThousand(v)} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => `${v}`} />
            <Tooltip content={<RevenueTooltip />} />
            <Legend
              verticalAlign="top"
              align="left"
              wrapperStyle={{ paddingLeft: 60, paddingBottom: 8 }}
            />
            <Bar yAxisId="left" dataKey="revenue" name="每月營收" fill={theme.palette.revenue.main} />
            <Line
              yAxisId="right"
              type="linear"
              dataKey="yoy"
              name="單月營收年增率"
              stroke={theme.palette.yoy.negative}
              dot={false}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
};
