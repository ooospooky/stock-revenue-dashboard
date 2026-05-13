import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme';
import { RevenueTable } from '@/components/dashboard/RevenueTable';
import type { RevenuePoint } from '@/lib/revenue/types';

const sampleData: RevenuePoint[] = [
  { date: '2024-01', revenue: 1000, yoy: 10 },
  { date: '2024-02', revenue: 2000, yoy: 20 },
];

const renderTable = () =>
  render(
    <ThemeProvider theme={theme}>
      <RevenueTable data={sampleData} stockId="2330" range={5} />
    </ThemeProvider>,
  );

describe('RevenueTable', () => {
  it('renders the 詳細數據 section label', () => {
    renderTable();
    expect(screen.getByText('詳細數據')).toBeInTheDocument();
  });

  it('renders the first column with nowrap labels', () => {
    renderTable();
    const labelCell = screen.getByText('單月營收年增率 (%)');
    expect(labelCell).toHaveStyle({ whiteSpace: 'nowrap' });
  });

  it('formats date column as YYYYMM', () => {
    renderTable();
    expect(screen.getByText('202401')).toBeInTheDocument();
    expect(screen.getByText('202402')).toBeInTheDocument();
  });
});
