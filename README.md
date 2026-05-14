# 台股月營收儀表板 — Stock Revenue Dashboard

A single-page dashboard for Taiwan stock monthly revenue, built as a take-home project with a focus on production-grade architecture, predictable data flow, and clear loading/error/empty handling.

🔗 **Live demo**: https://stock-revenue-dashboard.vercel.app/

---

## Quick Start

**環境需求**

- Node.js 20+
- pnpm 9+

**步驟**

1. `pnpm install`
2. 複製 `.env.example` 為 `.env.local`，填入 `FINMIND_TOKEN`
   （免費註冊：[finmindtrade.com](https://finmindtrade.com/analysis/#/data/api)）
3. `pnpm dev` → http://localhost:3000

**Scripts**

| 指令             | 用途                                 |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | 啟動開發伺服器                       |
| `pnpm build`     | Production build                     |
| `pnpm start`     | 啟動 production server（需先 build） |
| `pnpm typecheck` | TypeScript 型別檢查                  |
| `pnpm lint`      | ESLint                               |
| `pnpm test:run`  | 執行 Vitest（48 cases）              |

---

## Tech Stack

- **Next.js 16** — App Router、Route Handlers 作為 BFF proxy
- **React 19** — functional components + hooks
- **TypeScript** — strict mode，禁用 `any` 與不必要 `as`
- **MUI v9** — Theme + `sx` 唯一樣式策略；`AppRouterCacheProvider` 支援 SSR
- **TanStack Query v5** — server state、`placeholderData: keepPreviousData` 平滑切換
- **Recharts** — 雙 Y 軸 `ComposedChart`（bar + line）
- **nuqs v2** — URL state（`?stockId=2330&range=5`）
- **zod v4** — API 回應與 URL 參數驗證
- **Vitest** — pure data layer 單元測試

---

## Spec 對應實作

| 評測項目                          | 實作位置                                                        |
| --------------------------------- | --------------------------------------------------------------- |
| TypeScript                        | `tsconfig.json` strict、全專案無 `any`                          |
| React + functional component      | `src/components/**`，全為 functional + hooks                    |
| Next.js（加分）                   | App Router、Route Handlers 作為 BFF                             |
| MUI（加分）+ Theme                | `src/theme/index.ts`（自訂 palette / typography / breakpoints） |
| 良好元件切分                      | `dashboard/` 為畫面區塊、`states/` 為共用狀態元件               |
| TaiwanStockInfo（股票清單）       | `src/app/api/stocks/route.ts`                                   |
| TaiwanStockMonthRevenue（月營收） | `src/app/api/revenue/route.ts`                                  |

---

## Architecture

專案分為三層：

**Pure data layer** (`src/lib/`)
框架無關的 TypeScript 函式：`calculateYoY`、`buildRevenueSeries`、`getRevenueDateRange`、format helpers。所有業務邏輯集中於此，可用 Vitest 直接測試，零 React / Next.js 依賴。

**BFF / server** (`src/app/api/`)
Next.js Route Handler 代理 FinMind API。`FINMIND_TOKEN` 僅存在於 server（`import 'server-only'` + 無 `NEXT_PUBLIC_` 前綴）。回應經 zod 驗證後才回傳 client。`revalidate: 3600` 提供 1 小時邊緣快取。

**Client UI** (`src/components/`, `src/hooks/`)
TanStack Query hooks 透過 `/api/*` 取資料；URL state 由 nuqs 管理並以 zod fallback 至預設值。每個資料區塊明確處理 loading / error / empty / success 四種狀態。App Router 提供 `error.tsx` / `not-found.tsx` 作為頂層錯誤邊界。

**目錄結構**

```
src/
├── app/
│   ├── api/
│   │   ├── revenue/route.ts      # BFF: TaiwanStockMonthRevenue
│   │   └── stocks/route.ts       # BFF: TaiwanStockInfo
│   ├── error.tsx                 # 全域 error boundary
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx             # QueryClient + Theme + nuqs
├── components/
│   ├── dashboard/                # StockSelector / RangeSelector / RevenueChart / RevenueTable ...
│   └── states/                   # LoadingSkeleton / ErrorState / EmptyState
├── hooks/                        # use-stock-id / use-range / use-stock-list / use-revenue
├── lib/
│   ├── api/                      # FinMind schema、BFF helpers、client fetch
│   └── revenue/                  # 純函式：YoY、series 組裝、日期範圍
└── theme/index.ts                # MUI theme + module augmentation
```

---

## Deployment

部署於 Vercel，與 Next.js App Router 原生整合。

- **環境變數**：`FINMIND_TOKEN`（server-only，不加 `NEXT_PUBLIC_` 前綴）
- **API 快取**：BFF Route Handler 設 `revalidate: 3600`，將 FinMind 免費方案 600 req/hr 的速率限制隔離在 server 端

---

## Testing

測試以純函式為核心：

- YoY 計算邊界（缺前一年資料、跨年回繞）
- 日期範圍生成
- Revenue series 組裝
- StockId 解析與驗證

```bash
pnpm test:run   # 48 cases
pnpm typecheck
pnpm build
```

---
