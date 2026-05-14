'use client';
import { useMemo } from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';
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
import {
  formatRevenueByUnit,
  formatYoYPercent,
  getRevenueDisplayUnit,
} from '@/lib/format';
import type { RevenueDisplayUnit } from '@/lib/format';
import { formatXAxisTick } from '@/lib/format-x-tick';
import { SectionLabel } from './SectionLabel';
import { RangeSelector } from './RangeSelector';

type TooltipPayload = {
  dataKey: 'revenueInThousands' | 'yoy';
  value: number | null;
}[];
type LegendPayloadItem = {
  dataKey?: string | number;
  value?: string;
};

const RevenueTooltip = ({
  active,
  payload,
  label,
  revenueUnit,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string;
  revenueUnit: RevenueDisplayUnit;
}) => {
  if (!active || !payload?.length) return null;
  const revenue = payload.find(
    (p) => p.dataKey === 'revenueInThousands',
  )?.value;
  const yoy = payload.find((p) => p.dataKey === 'yoy')?.value;
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        p: 1,
      }}
    >
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2">
        每月營收：
        {revenue != null ? formatRevenueByUnit(revenue, revenueUnit) : '-'}{' '}
        {revenueUnit.label}
      </Typography>
      <Typography variant="body2">
        單月營收年增率：{formatYoYPercent(yoy ?? null)} %
      </Typography>
    </Box>
  );
};

const LEGEND_ITEM_ORDER: Record<'revenueInThousands' | 'yoy', number> = {
  revenueInThousands: 0,
  yoy: 1,
};

const getLegendItemOrder = (dataKey: LegendPayloadItem['dataKey']): number => {
  if (dataKey === 'revenueInThousands')
    return LEGEND_ITEM_ORDER.revenueInThousands;
  if (dataKey === 'yoy') return LEGEND_ITEM_ORDER.yoy;
  return Number.MAX_SAFE_INTEGER;
};

const renderLegendIcon = (entry: LegendPayloadItem, theme: Theme) => {
  const color =
    entry.dataKey === 'revenueInThousands'
      ? theme.palette.revenue.main
      : theme.palette.yoy.negative;

  return (
    <Box
      component="span"
      sx={{
        width: 16,
        height: 10,
        bgcolor: color,
        flexShrink: 0,
      }}
    />
  );
};

const RevenueLegend = ({
  payload,
  theme,
}: {
  payload?: LegendPayloadItem[];
  theme: Theme;
}) => {
  if (!payload?.length) return null;

  const sortedPayload = [...payload].sort((firstItem, secondItem) => {
    return (
      getLegendItemOrder(firstItem.dataKey) -
      getLegendItemOrder(secondItem.dataKey)
    );
  });

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        pl: `${CHART_MARGIN.left + LEFT_Y_AXIS_WIDTH}px`,
        pb: 1,
        flexWrap: 'wrap',
      }}
    >
      {sortedPayload.map((entry) => (
        <Stack
          key={entry.dataKey}
          direction="row"
          spacing={0.75}
          sx={{
            alignItems: 'center',
            color: 'text.primary',
          }}
        >
          {renderLegendIcon(entry, theme)}
          <Typography variant="body2" component="span">
            {entry.value ?? ''}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const CHART_HEADER_SX = {
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1,
};

const CHART_MARGIN = {
  top: 30,
  right: 24,
  bottom: 10,
  left: 24,
};

const LEFT_Y_AXIS_WIDTH = 72;
const RIGHT_Y_AXIS_WIDTH = 44;
const UNIT_LABEL_PADDING = 0.5;

const UNIT_LABEL_LEFT_SX = {
  position: 'absolute',
  top: 0,
  left: CHART_MARGIN.left,
  width: LEFT_Y_AXIS_WIDTH,
  pr: UNIT_LABEL_PADDING,
  textAlign: 'right',
  color: 'text.secondary',
  zIndex: 1,
};

const UNIT_LABEL_RIGHT_SX = {
  position: 'absolute',
  top: 0,
  right: CHART_MARGIN.right,
  width: RIGHT_Y_AXIS_WIDTH,
  pl: UNIT_LABEL_PADDING,
  textAlign: 'left',
  color: 'text.secondary',
  zIndex: 1,
};

export const RevenueChart = ({ data }: { data: RevenuePoint[] }) => {
  const theme = useTheme();
  const revenueUnit = useMemo(
    () => getRevenueDisplayUnit(data.map((point) => point.revenueInThousands)),
    [data],
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={CHART_HEADER_SX}>
        <SectionLabel>每月營收</SectionLabel>
        <RangeSelector />
      </Stack>

      <Box sx={{ position: 'relative', width: '100%' }}>
        <Typography variant="body2" sx={UNIT_LABEL_LEFT_SX}>
          {revenueUnit.label}
        </Typography>
        <Typography variant="body2" sx={UNIT_LABEL_RIGHT_SX}>
          %
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              interval={0}
              tickFormatter={formatXAxisTick}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              width={LEFT_Y_AXIS_WIDTH}
              tickMargin={8}
              tickFormatter={(v: number) => formatRevenueByUnit(v, revenueUnit)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={RIGHT_Y_AXIS_WIDTH}
              tickMargin={8}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip content={<RevenueTooltip revenueUnit={revenueUnit} />} />
            <Legend
              verticalAlign="top"
              align="left"
              content={<RevenueLegend theme={theme} />}
            />
            <Bar
              yAxisId="left"
              dataKey="revenueInThousands"
              name="每月營收"
              fill={theme.palette.revenue.fill}
              stroke={theme.palette.revenue.main}
              strokeWidth={1}
              maxBarSize={10}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="linear"
              dataKey="yoy"
              name="單月營收年增率 (%)"
              stroke={theme.palette.yoy.negative}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
};
