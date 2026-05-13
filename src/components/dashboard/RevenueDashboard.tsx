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
import { RevenueChart } from './RevenueChart';
import { RevenueTable } from './RevenueTable';
import { LoadingSkeleton } from '../states/LoadingSkeleton';
import { ErrorState } from '../states/ErrorState';
import { EmptyState } from '../states/EmptyState';

const CARD_SX = { p: { xs: 2, md: 3 } };

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

  const renderDataCards = () => {
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
    if (revenue.data?.status === 'error') {
      return (
        <Paper variant="outlined" sx={CARD_SX}>
          <ErrorState code={revenue.data.code} onRetry={() => revenue.refetch()} />
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1280, mx: 'auto' }}>
      {revenue.isFetching && !revenue.isPending && (
        <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300 }} />
      )}
      <Stack spacing={3}>
        <StockSelector />

        <Paper variant="outlined" sx={CARD_SX}>
          <Typography variant="h2">
            {stockName || '－'} ({stockId})
          </Typography>
        </Paper>

        {renderDataCards()}
      </Stack>
    </Box>
  );
};
