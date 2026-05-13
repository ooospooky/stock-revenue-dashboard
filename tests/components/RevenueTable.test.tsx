import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme';
import { RevenueTable } from '@/components/dashboard/RevenueTable';
import type { RevenuePoint } from '@/lib/revenue/types';

const sampleData: RevenuePoint[] = [
  { date: '2024-01', revenueInThousands: 1000, yoy: 10 },
  { date: '2024-02', revenueInThousands: 2000, yoy: 20 },
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

  it('renders the first column with sticky width and nowrap labels', () => {
    renderTable();
    const labelCell = screen.getByText('單月營收年增率 (%)');
    expect(labelCell).toHaveStyle({
      whiteSpace: 'nowrap',
      minWidth: '160px',
      width: '160px',
      maxWidth: '160px',
    });
  });

  it('formats date column as YYYYMM', () => {
    renderTable();
    expect(screen.getByText('202401')).toHaveStyle({ fontWeight: '500' });
    expect(screen.getByText('202402')).toHaveStyle({ fontWeight: '500' });
  });

  it('renders monthly revenue as full amount in NTD', () => {
    renderTable();
    expect(screen.getByText('1,000,000')).toHaveStyle({ fontWeight: '400' });
    expect(screen.getByText('2,000,000')).toHaveStyle({ fontWeight: '400' });
  });

  it('renders yoy values with regular font weight', () => {
    renderTable();
    expect(screen.getByText('10.00')).toHaveStyle({ fontWeight: '400' });
    expect(screen.getByText('20.00')).toHaveStyle({ fontWeight: '400' });
  });

  it('renders the table with content-based width instead of filling the container', () => {
    const { container } = renderTable();
    const table = container.querySelector('table');

    expect(table).toHaveStyle({
      width: 'max-content',
      minWidth: 'max-content',
      borderCollapse: 'separate',
    });
  });
});
