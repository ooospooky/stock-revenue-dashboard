'use client';
import {
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
  type Ref,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Alert, Autocomplete, Box, Skeleton, TextField } from '@mui/material';
import {
  List,
  type ListImperativeAPI,
  type RowComponentProps,
} from 'react-window';
import { useStockList } from '@/hooks/use-stock-list';
import { useStockId } from '@/hooks/use-stock-id';
import { ErrorState } from '../states/ErrorState';

type Option = { stock_id: string; stock_name: string };

const ROW_HEIGHT = 36;
const LIST_MAX_HEIGHT = 320;
const SELECTOR_SX = { width: { xs: '100%', sm: 320 } };

const assignRef = <T,>(ref: Ref<T> | undefined, value: T) => {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
};

const filterOptions = (
  options: Option[],
  { inputValue }: { inputValue: string },
): Option[] => {
  const q = inputValue.trim().toLowerCase();
  if (!q) return options;
  const prefix: Option[] = [];
  const contains: Option[] = [];
  for (const stock of options) {
    if (stock.stock_id.startsWith(q)) prefix.push(stock);
    else if (
      stock.stock_id.toLowerCase().includes(q) ||
      stock.stock_name.toLowerCase().includes(q)
    ) {
      contains.push(stock);
    }
  }
  return [...prefix, ...contains];
};

type OptionElement = ReactElement<HTMLAttributes<HTMLElement>>;
type RowProps = { items: OptionElement[] };

const Row = ({ index, style, items }: RowComponentProps<RowProps>) => {
  const child = items[index];
  const mergedStyle: CSSProperties = {
    ...(child.props.style ?? {}),
    ...style,
    margin: 0,
  };
  return cloneElement(child, { style: mergedStyle });
};

type ListboxProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  ownerState?: unknown;
};

const isOptionElement = (
  child: ReactNode,
): child is ReactElement<HTMLAttributes<HTMLElement>> =>
  isValidElement<HTMLAttributes<HTMLElement>>(child);

const VirtualListbox = forwardRef<HTMLDivElement, ListboxProps>(
  function VirtualListbox(props, ref) {
    // ownerState is MUI-internal and must not reach the DOM
    const { children, ownerState, style, ...other } = props;
    void ownerState;
    const items = Children.toArray(children).filter(isOptionElement);
    const height = Math.min(LIST_MAX_HEIGHT, items.length * ROW_HEIGHT);
    const listStyle: CSSProperties = {
      ...style,
      height,
      width: '100%',
      padding: 0,
    };

    const handleListRef = (instance: ListImperativeAPI | null) => {
      // MUI needs the actual scroll container element to keep keyboard
      // highlight and scroll position in sync with the virtualized list.
      assignRef(ref, instance?.element ?? null);
    };

    return (
      <List<RowProps>
        {...other}
        listRef={handleListRef}
        rowComponent={Row}
        rowCount={items.length}
        rowHeight={ROW_HEIGHT}
        rowProps={{ items }}
        style={listStyle}
        overscanCount={8}
      />
    );
  },
);

export const StockSelector = () => {
  const [stockId, setStockId] = useStockId();
  const stockList = useStockList();

  if (stockList.isPending) {
    return (
      <Box sx={SELECTOR_SX}>
        <Skeleton variant="rounded" height={40} />
      </Box>
    );
  }

  if (stockList.isError) {
    return (
      <Box sx={SELECTOR_SX}>
        <ErrorState code="NETWORK_ERROR" onRetry={() => stockList.refetch()} />
      </Box>
    );
  }

  if (stockList.data?.status === 'error') {
    return (
      <Box sx={SELECTOR_SX}>
        <ErrorState
          code={stockList.data.code}
          onRetry={() => stockList.refetch()}
        />
      </Box>
    );
  }

  const options: Option[] = stockList.data?.data ?? [];

  if (options.length === 0) {
    return (
      <Box sx={SELECTOR_SX}>
        <Alert severity="info">目前沒有可選股票資料，請稍後再試</Alert>
      </Box>
    );
  }

  const selected = options.find((stock) => stock.stock_id === stockId) ?? {
    stock_id: stockId,
    stock_name: '',
  };

  const handleChange = (_: unknown, value: Option) => {
    setStockId(value.stock_id);
  };

  return (
    <Box sx={SELECTOR_SX}>
      <Autocomplete
        options={options}
        value={selected}
        disableClearable
        disableListWrap
        isOptionEqualToValue={(a, b) => a.stock_id === b.stock_id}
        getOptionLabel={(o) =>
          o.stock_name ? `${o.stock_id} ${o.stock_name}` : o.stock_id
        }
        filterOptions={filterOptions}
        onChange={handleChange}
        slots={{ listbox: VirtualListbox }}
        slotProps={{ listbox: { style: { maxHeight: LIST_MAX_HEIGHT } } }}
        renderOption={(props, stock) => {
          const { key, ...liProps } = props;
          return (
            <Box
              component="li"
              key={key}
              {...liProps}
              sx={{
                listStyle: 'none',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                cursor: 'pointer',
                minHeight: ROW_HEIGHT,
                height: ROW_HEIGHT,
                px: 2,
                '&:hover, &.Mui-focused': {
                  bgcolor: 'action.hover',
                },
                '&.Mui-focusVisible': {
                  bgcolor: 'action.focus',
                },
                '&[aria-selected="true"]': {
                  bgcolor: 'action.selected',
                },
                '&[aria-selected="true"]:hover, &[aria-selected="true"].Mui-focused':
                  {
                    bgcolor: 'action.selected',
                  },
              }}
            >
              {stock.stock_name
                ? `${stock.stock_id} ${stock.stock_name}`
                : stock.stock_id}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="輸入台股代號或名稱" size="small" />
        )}
      />
    </Box>
  );
};
