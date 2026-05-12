'use client';
import { useMemo } from 'react';
import { Box, Stack, Typography, LinearProgress, Paper } from '@mui/material';
import { useStockId } from '@/hooks/use-stock-id';
import { useRange } from '@/hooks/use-range';
import { useRevenue } from '@/hooks/use-revenue';
import { useStockList } from '@/hooks/use-stock-list';
import { getRevenueDateRange } from '@/lib/revenue/get-date-range';
import { buildRevenueSeries } from '@/lib/revenue/build-revenue-series';
import { StockSelector } from './StockSelector';
import { RangeSelector } from './RangeSelector';
import { RevenueChart } from './RevenueChart';
import { RevenueTable } from './RevenueTable';
import { LoadingSkeleton } from '../states/LoadingSkeleton';
import { ErrorState } from '../states/ErrorState';
import { EmptyState } from '../states/EmptyState';

export const RevenueDashboard = () => {
  const [stockId] = useStockId();
  const [range] = useRange();
  const stockList = useStockList();
  const dateRange = useMemo(() => getRevenueDateRange(range, new Date()), [range]);
  const revenue = useRevenue(stockId, dateRange.fetchStart, dateRange.fetchEnd);

  const stockName =
    stockList.data?.status === 'ok'
      ? (stockList.data.data.find((s) => s.stock_id === stockId)?.stock_name ?? '')
      : '';

  const series = useMemo(() => {
    if (revenue.data?.status !== 'ok') return [];
    return buildRevenueSeries(revenue.data.data, dateRange.displayStart, dateRange.displayEnd);
  }, [revenue.data, dateRange.displayStart, dateRange.displayEnd]);

  const renderDataBlock = () => {
    if (revenue.isPending) return <LoadingSkeleton height={500} />;
    if (revenue.data?.status === 'error') {
      return <ErrorState code={revenue.data.code} onRetry={() => revenue.refetch()} />;
    }
    if (series.length === 0) return <EmptyState stockId={stockId} />;
    return (
      <Stack spacing={3}>
        <RevenueChart data={series} />
        <RevenueTable data={series} stockId={stockId} range={range} />
      </Stack>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1280, mx: 'auto' }}>
      {revenue.isFetching && !revenue.isPending && (
        <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300 }} />
      )}
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
        >
          <StockSelector />
          <RangeSelector />
        </Stack>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            {stockName || '－'} ({stockId})
          </Typography>
          {renderDataBlock()}
        </Paper>
      </Stack>
    </Box>
  );
};
