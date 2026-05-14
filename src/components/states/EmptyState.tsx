import { Alert } from '@mui/material';

type EmptyStateProps = {
  stockId: string;
  invalid?: boolean;
};

export const EmptyState = ({ stockId, invalid }: EmptyStateProps) => (
  <Alert severity="info">
    {invalid
      ? `「${stockId}」不是有效的股票代號 — 請確認股票代號或重新選擇`
      : `查無 ${stockId} 的月營收資料 — 請確認股票代號或重新選擇`}
  </Alert>
);
