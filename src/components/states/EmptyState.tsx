import { Alert } from '@mui/material';

type EmptyStateProps = {
  stockId: string;
  stockName?: string;
  invalid?: boolean;
};

const formatStockLabel = (stockId: string, stockName?: string) =>
  stockName ? `${stockName} (${stockId})` : stockId;

export const EmptyState = ({ stockId, stockName, invalid }: EmptyStateProps) => (
  <Alert severity="info">
    {invalid
      ? `「${stockId}」不是有效的股票代號 — 請確認股票代號或重新選擇`
      : `查無 ${formatStockLabel(stockId, stockName)} 的月營收資料，請確認股票代號或重新選擇`}
  </Alert>
);
