'use client';
import { useTheme } from '@mui/material';
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

type TooltipPayload = { dataKey: 'revenue' | 'yoy'; value: number | null }[];

const RevenueTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload; // Recharts types this as any[] upstream; narrowed locally per CLAUDE.md exception
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const revenue = payload.find((p) => p.dataKey === 'revenue')?.value;
  const yoy = payload.find((p) => p.dataKey === 'yoy')?.value;
  return (
    <div style={{ background: 'white', border: '1px solid #ccc', padding: 8, fontSize: 13 }}>
      <div>{label}</div>
      <div>每月營收：{revenue != null ? formatThousand(revenue) : '-'} 千元</div>
      <div>單月營收年增率：{formatYoYPercent(yoy ?? null)} %</div>
    </div>
  );
};

export const RevenueChart = ({ data }: { data: RevenuePoint[] }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data} margin={{ top: 20, right: 60, bottom: 50, left: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          angle={-45}
          textAnchor="end"
          interval="preserveStartEnd"
          height={60}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(v: number) => formatThousand(v)}
          label={{ value: '千元', angle: -90, position: 'insideLeft' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(v: number) => `${v}`}
          label={{ value: '%', angle: 90, position: 'insideRight' }}
        />
        <Tooltip content={<RevenueTooltip />} />
        <Legend />
        <Bar yAxisId="left" dataKey="revenue" name="每月營收" fill={theme.palette.revenue.main} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="yoy"
          name="單月營收年增率"
          stroke={theme.palette.yoy.negative}
          dot={false}
          connectNulls={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
