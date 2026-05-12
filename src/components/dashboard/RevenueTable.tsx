'use client';
import { useEffect, useRef } from 'react';
import { Box, Table, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import type { RevenuePoint } from '@/lib/revenue/types';
import { formatThousand, formatYoYPercent } from '@/lib/format';

const ROW_LABEL_CELL_SX = {
  position: 'sticky',
  left: 0,
  bgcolor: 'background.paper',
  fontWeight: 600,
  zIndex: 2,
  borderRight: '1px solid',
  borderColor: 'divider',
} as const;

const DATA_CELL_SX = { textAlign: 'right', minWidth: 90 } as const;

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

  return (
    <Paper variant="outlined">
      <Box ref={scrollRef} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ tableLayout: 'auto' }}>
          <TableBody>
            <TableRow>
              <TableCell sx={ROW_LABEL_CELL_SX}>年度月份</TableCell>
              {data.map((p) => (
                <TableCell key={p.date} sx={DATA_CELL_SX}>
                  {p.date.replace('-', '')}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={ROW_LABEL_CELL_SX}>每月營收</TableCell>
              {data.map((p) => (
                <TableCell key={p.date} sx={DATA_CELL_SX}>
                  {formatThousand(p.revenue)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={ROW_LABEL_CELL_SX}>單月營收年增率 (%)</TableCell>
              {data.map((p) => (
                <TableCell key={p.date} sx={DATA_CELL_SX}>
                  {formatYoYPercent(p.yoy)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};
