'use client';
import { useEffect, useRef } from 'react';
import { Box, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material';
import type { RevenuePoint } from '@/lib/revenue/types';
import { formatThousand, formatYoYPercent } from '@/lib/format';
import { SectionLabel } from './SectionLabel';

const STRIPE_SX = { bgcolor: 'tableStripe.main' };

const ROW_LABEL_CELL_SX = {
  position: 'sticky',
  left: 0,
  bgcolor: 'inherit',
  fontWeight: 600,
  zIndex: 2,
  borderRight: '1px solid',
  borderColor: 'divider',
  whiteSpace: 'nowrap',
};

const DATA_CELL_SX = {
  textAlign: 'right',
  minWidth: 90,
  borderRight: '1px solid',
  borderColor: 'divider',
  whiteSpace: 'nowrap',
};

const LAST_CELL_SX = { ...DATA_CELL_SX, borderRight: 'none' };

export const RevenueTable = ({
  data,
  stockId,
  range,
}: {
  data: RevenuePoint[];
  stockId: string;
  range: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestDate = data[data.length - 1]?.date;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [stockId, range, latestDate]);

  const lastIndex = data.length - 1;

  const renderRow = (
    label: string,
    formatter: (p: RevenuePoint) => string,
    stripe: boolean,
  ) => (
    <TableRow sx={stripe ? STRIPE_SX : undefined}>
      <TableCell sx={ROW_LABEL_CELL_SX}>{label}</TableCell>
      {data.map((p, idx) => (
        <TableCell key={p.date} sx={idx === lastIndex ? LAST_CELL_SX : DATA_CELL_SX}>
          {formatter(p)}
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <Stack spacing={2}>
      <SectionLabel>詳細數據</SectionLabel>
      <Box ref={scrollRef} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ tableLayout: 'auto' }}>
          <TableBody>
            {renderRow('年度月份', (p) => p.date.replace('-', ''), true)}
            {renderRow('每月營收', (p) => formatThousand(p.revenue), false)}
            {renderRow('單月營收年增率 (%)', (p) => formatYoYPercent(p.yoy), true)}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  );
};
