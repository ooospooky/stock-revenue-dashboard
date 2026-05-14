'use client';
import { useEffect, useRef } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
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
  dataCellFontWeight: number;
};

const ROW_LABEL_COLUMN_WIDTH = 160;

const TABLE_ROWS: RevenueTableRowConfig[] = [
  {
    id: 'date',
    label: '年度月份',
    isStriped: true,
    formatValue: (point) => point.date.replace('-', ''),
    dataCellFontWeight: 500,
  },
  {
    id: 'revenue',
    label: '每月營收',
    isStriped: false,
    formatValue: (point) => formatRevenueFullAmount(point.revenueInThousands),
    dataCellFontWeight: 400,
  },
  {
    id: 'yoy',
    label: '單月營收年增率 (%)',
    isStriped: true,
    formatValue: (point) => formatYoYPercent(point.yoy),
    dataCellFontWeight: 400,
  },
];

const TABLE_SX = {
  width: 'max-content',
  minWidth: 'max-content',
  tableLayout: 'auto',
  borderCollapse: 'separate',
  borderSpacing: 0,
} satisfies SxProps<Theme>;

const RevenueTableRowItem = ({
  data,
  row,
  rowLabelCellSx,
  dataCellSx,
  lastCellSx,
}: {
  data: RevenuePoint[];
  row: RevenueTableRowConfig;
  rowLabelCellSx: SxProps<Theme>;
  dataCellSx: SxProps<Theme>;
  lastCellSx: SxProps<Theme>;
}) => (
  <TableRow sx={row.isStriped ? { bgcolor: 'tableStripe.main' } : undefined}>
    <TableCell
      sx={{
        ...rowLabelCellSx,
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
          ...(index === data.length - 1 ? lastCellSx : dataCellSx),
          fontWeight: row.dataCellFontWeight,
        }}
      >
        {row.formatValue(point)}
      </TableCell>
    ))}
  </TableRow>
);

export const RevenueTable = ({ data, stockId, range }: RevenueTableProps) => {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestDate = data[data.length - 1]?.date;

  const rowLabelCellSx = {
    position: 'sticky',
    left: 0,
    minWidth: ROW_LABEL_COLUMN_WIDTH,
    width: ROW_LABEL_COLUMN_WIDTH,
    maxWidth: ROW_LABEL_COLUMN_WIDTH,
    fontWeight: theme.typography.fontWeightMedium,
    zIndex: 2,
    borderRight: '1px solid',
    borderColor: 'divider',
    whiteSpace: 'nowrap',
    pr: 2,
  } satisfies SxProps<Theme>;

  const dataCellSx = {
    textAlign: 'right',
    minWidth: 90,
    borderRight: '1px solid',
    borderColor: 'divider',
    whiteSpace: 'nowrap',
    px: 2.25,
    py: 1.5,
  } satisfies SxProps<Theme>;

  const lastCellSx = {
    ...dataCellSx,
    borderRight: 'none',
    px: 2.625,
    py: 1.5,
  } satisfies SxProps<Theme>;

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
              <RevenueTableRowItem
                key={row.id}
                data={data}
                row={row}
                rowLabelCellSx={rowLabelCellSx}
                dataCellSx={dataCellSx}
                lastCellSx={lastCellSx}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
