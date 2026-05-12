import { Alert, Button } from '@mui/material';
import type { ErrorCode } from '@/lib/api/types';

const MESSAGES: Record<ErrorCode, string> = {
  NETWORK_ERROR: '無法連線至資料來源，請檢查網路或稍後再試',
  UNKNOWN_ERROR: '資料載入失敗，請稍後再試',
};

export const ErrorState = ({ code, onRetry }: { code: ErrorCode; onRetry?: () => void }) => (
  <Alert
    severity="error"
    action={
      onRetry ? (
        <Button color="inherit" size="small" onClick={onRetry}>
          重試
        </Button>
      ) : null
    }
  >
    {MESSAGES[code]}
  </Alert>
);
