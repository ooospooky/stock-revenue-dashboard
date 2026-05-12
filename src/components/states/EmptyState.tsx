import { Alert } from '@mui/material';

export const EmptyState = ({ stockId }: { stockId: string }) => (
  <Alert severity="info">
    查無 {stockId} 的月營收資料 — 請確認股票代號或重新選擇
  </Alert>
);
