'use client';
import { Box, Skeleton, Stack, Typography, LinearProgress, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useStockId } from '@/hooks/use-stock-id';
import { useRange } from '@/hooks/use-range';
import { useRevenue } from '@/hooks/use-revenue';
import { useStockList } from '@/hooks/use-stock-list';
import { getRevenueDateRange } from '@/lib/revenue/get-date-range';
import { buildRevenueSeries } from '@/lib/revenue/build-revenue-series';
import type { RevenuePoint, RangePreset } from '@/lib/revenue/types';
import { StockSelector } from './StockSelector';
import { RevenueChart } from './RevenueChart';
import { RevenueTable } from './RevenueTable';
import { LoadingSkeleton } from '../states/LoadingSkeleton';
import { ErrorState } from '../states/ErrorState';
import { EmptyState } from '../states/EmptyState';

const CARD_SX = { p: { xs: 2, md: 3 } };

type DashboardContentProps = {
  revenue: ReturnType<typeof useRevenue>;
  series: RevenuePoint[];
  stockId: string;
  range: RangePreset;
};

const DashboardContent = ({
  revenue,
  series,
  stockId,
  range,
}: DashboardContentProps) => {
  if (revenue.isPending) {
    return (
      <>
        <Paper variant="outlined" sx={CARD_SX}>
          <LoadingSkeleton height={400} />
        </Paper>
        <Paper variant="outlined" sx={CARD_SX}>
          <LoadingSkeleton height={200} />
        </Paper>
      </>
    );
  }
  if (revenue.isError) {
    return (
      <Paper variant="outlined" sx={CARD_SX}>
        <ErrorState code="NETWORK_ERROR" onRetry={() => revenue.refetch()} />
      </Paper>
    );
  }
  if (revenue.data?.status === 'error') {
    return (
      <Paper variant="outlined" sx={CARD_SX}>
        <ErrorState
          code={revenue.data.code}
          onRetry={() => revenue.refetch()}
        />
      </Paper>
    );
  }
  if (series.length === 0) {
    return (
      <Paper variant="outlined" sx={CARD_SX}>
        <EmptyState stockId={stockId} />
      </Paper>
    );
  }
  return (
    <>
      <Paper variant="outlined" sx={CARD_SX}>
        <RevenueChart data={series} />
      </Paper>
      <Paper variant="outlined" sx={CARD_SX}>
        <RevenueTable data={series} stockId={stockId} range={range} />
      </Paper>
    </>
  );
};

export const RevenueDashboard = () => {
  const theme = useTheme();
  const [stockId, , rawStockId] = useStockId();
  const [range] = useRange();
  const stockList = useStockList();
  const dateRange = getRevenueDateRange(range, new Date());
  const revenue = useRevenue(stockId ?? '', dateRange.fetchStart, dateRange.fetchEnd, {
    enabled: stockId !== null,
  });

  const series =
    revenue.data?.status === 'ok'
      ? buildRevenueSeries(
          revenue.data.data,
          dateRange.displayStart,
          dateRange.displayEnd,
        )
      : [];

  const stockName =
    stockList.data?.status === 'ok'
      ? (stockList.data.data.find((stock) => stock.stock_id === stockId)
          ?.stock_name ?? '')
      : '';

  if (stockId === null) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: theme.breakpoints.values.pageMax, mx: 'auto' }}>
        <Stack spacing={2}>
          <StockSelector />
          <Paper variant="outlined" sx={CARD_SX}>
            <EmptyState stockId={rawStockId ?? ''} invalid />
          </Paper>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: theme.breakpoints.values.pageMax, mx: 'auto' }}>
      {revenue.isFetching && !revenue.isPending && (
        <LinearProgress
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: theme.zIndex.modal }}
        />
      )}
      <Stack spacing={2}>
        <StockSelector />

        <Paper variant="outlined" sx={CARD_SX}>
          {stockList.isPending ? (
            <Skeleton variant="text" width={200} sx={{ fontSize: 'h2.fontSize' }} />
          ) : (
            <Typography variant="h2">
              {stockName ? `${stockName} (${stockId})` : `(${stockId})`}
            </Typography>
          )}
        </Paper>

        <DashboardContent
          revenue={revenue}
          series={series}
          stockId={stockId}
          range={range}
        />
      </Stack>
    </Box>
  );
};
