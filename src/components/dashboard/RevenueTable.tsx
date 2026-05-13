'use client';
import { useEffect, useRef } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import type { RevenuePoint } from '@/lib/revenue/types';
import { formatRevenueFullAmount, formatYoYPercent } from '@/lib/format';
import { SectionLabel } from './SectionLabel';

type RevenueTableProps = {
  data: RevenuePoint[];
  stockId: string;
  range: number;
};

type RevenueTableRowConfig = {
  id: 'date' | 'revenue' | 'yoy';
  label: string;
  isStriped: boolean;
  formatValue: (point: RevenuePoint) => string;
  dataCellFontWeight: 'fontWeightMedium' | 'fontWeightRegular';
};

const ROW_LABEL_COLUMN_WIDTH = 160;

const ROW_LABEL_CELL_SX = {
  position: 'sticky',
  left: 0,
  minWidth: ROW_LABEL_COLUMN_WIDTH,
  width: ROW_LABEL_COLUMN_WIDTH,
  maxWidth: ROW_LABEL_COLUMN_WIDTH,
  fontWeight: 'fontWeightMedium',
  zIndex: 2,
  borderRight: '1px solid',
  borderColor: 'divider',
  whiteSpace: 'nowrap',
  pr: 2,
} satisfies SxProps<Theme>;

const DATA_CELL_SX = {
  textAlign: 'right',
  minWidth: 90,
  borderRight: '1px solid',
  borderColor: 'divider',
  whiteSpace: 'nowrap',
} satisfies SxProps<Theme>;

const LAST_CELL_SX = {
  ...DATA_CELL_SX,
  borderRight: 'none',
} satisfies SxProps<Theme>;

const TABLE_SX = {
  width: 'max-content',
  minWidth: 'max-content',
  tableLayout: 'auto',
  borderCollapse: 'separate',
  borderSpacing: 0,
} satisfies SxProps<Theme>;

const TABLE_ROWS: RevenueTableRowConfig[] = [
  {
    id: 'date',
    label: '年度月份',
    isStriped: true,
    formatValue: (point) => point.date.replace('-', ''),
    dataCellFontWeight: 'fontWeightMedium',
  },
  {
    id: 'revenue',
    label: '每月營收',
    isStriped: false,
    formatValue: (point) => formatRevenueFullAmount(point.revenue),
    dataCellFontWeight: 'fontWeightRegular',
  },
  {
    id: 'yoy',
    label: '單月營收年增率 (%)',
    isStriped: true,
    formatValue: (point) => formatYoYPercent(point.yoy),
    dataCellFontWeight: 'fontWeightRegular',
  },
];

const RevenueTableRowItem = ({
  data,
  row,
}: {
  data: RevenuePoint[];
  row: RevenueTableRowConfig;
}) => (
  <TableRow sx={row.isStriped ? { bgcolor: 'tableStripe.main' } : undefined}>
    <TableCell
      sx={{
        ...ROW_LABEL_CELL_SX,
        bgcolor: row.isStriped ? 'tableStripe.main' : 'background.paper',
        boxShadow: (theme) => `1px 0 0 ${theme.palette.divider}`,
      }}
    >
      {row.label}
    </TableCell>
    {data.map((point, index) => (
      <TableCell
        key={`${row.id}-${point.date}`}
        sx={{
          ...(index === data.length - 1 ? LAST_CELL_SX : DATA_CELL_SX),
          fontWeight: row.dataCellFontWeight,
        }}
      >
        {row.formatValue(point)}
      </TableCell>
    ))}
  </TableRow>
);

export const RevenueTable = ({ data, stockId, range }: RevenueTableProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestDate = data[data.length - 1]?.date;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [stockId, range, latestDate]);

  return (
    <Stack spacing={2}>
      <Box sx={{ alignSelf: 'flex-start' }}>
        <SectionLabel>詳細數據</SectionLabel>
      </Box>
      <TableContainer ref={scrollRef} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={TABLE_SX}>
          <TableBody>
            {TABLE_ROWS.map((row) => (
              <RevenueTableRowItem key={row.id} data={data} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
