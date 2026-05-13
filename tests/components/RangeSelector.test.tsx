import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme';
import { RangeSelector } from '@/components/dashboard/RangeSelector';

const renderWithProviders = (search = '?range=5') =>
  render(
    <NuqsTestingAdapter searchParams={search}>
      <ThemeProvider theme={theme}>
        <RangeSelector />
      </ThemeProvider>
    </NuqsTestingAdapter>,
  );

describe('RangeSelector', () => {
  it('shows current range as 近 5 年 by default', () => {
    renderWithProviders();
    expect(screen.getByRole('combobox')).toHaveTextContent('近 5 年');
  });

  it('opens dropdown with 3/5/8 options when clicked', async () => {
    renderWithProviders();
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: '近 3 年' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '近 5 年' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '近 8 年' })).toBeInTheDocument();
  });
});
