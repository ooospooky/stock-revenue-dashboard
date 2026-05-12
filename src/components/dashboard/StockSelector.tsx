'use client';
import { Autocomplete, TextField, Box } from '@mui/material';
import { useStockList } from '@/hooks/use-stock-list';
import { useStockId } from '@/hooks/use-stock-id';

type Option = { stock_id: string; stock_name: string };

const filterOptions = (options: Option[], { inputValue }: { inputValue: string }): Option[] => {
  const q = inputValue.trim().toLowerCase();
  if (!q) return options.slice(0, 200);
  const prefix: Option[] = [];
  const contains: Option[] = [];
  for (const o of options) {
    if (o.stock_id.startsWith(q)) prefix.push(o);
    else if (o.stock_id.toLowerCase().includes(q) || o.stock_name.toLowerCase().includes(q)) {
      contains.push(o);
    }
  }
  return [...prefix, ...contains].slice(0, 200);
};

export const StockSelector = () => {
  const [stockId, setStockId] = useStockId();
  const { data, isPending } = useStockList();
  const options: Option[] = data?.status === 'ok' ? data.data : [];
  const selected = options.find((o) => o.stock_id === stockId) ?? { stock_id: stockId, stock_name: '' };

  return (
    <Box sx={{ width: 320 }}>
      <Autocomplete
        options={options}
        value={selected}
        loading={isPending}
        disableClearable
        isOptionEqualToValue={(a, b) => a.stock_id === b.stock_id}
        getOptionLabel={(o) => (o.stock_name ? `${o.stock_id} ${o.stock_name}` : o.stock_id)}
        filterOptions={filterOptions}
        onChange={(_, v) => v && setStockId(v.stock_id)}
        renderInput={(params) => (
          <TextField {...params} label="輸入台股代號或名稱" size="small" />
        )}
      />
    </Box>
  );
};
