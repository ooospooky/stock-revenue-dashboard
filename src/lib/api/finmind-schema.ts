import { z } from 'zod';

export const FinMindRevenueRowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  stock_id: z.string(),
  country: z.string(),
  revenue: z.number(),
  revenue_month: z.number(),
  revenue_year: z.number(),
});

export const FinMindRevenueResponseSchema = z.object({
  msg: z.string(),
  status: z.number(),
  data: z.array(FinMindRevenueRowSchema),
});

export const FinMindStockInfoRowSchema = z.object({
  industry_category: z.string(),
  stock_id: z.string(),
  stock_name: z.string(),
  type: z.string(),
  date: z.string(),
});

export const FinMindStockInfoResponseSchema = z.object({
  msg: z.string(),
  status: z.number(),
  data: z.array(FinMindStockInfoRowSchema),
});

export type FinMindRevenueRow = z.infer<typeof FinMindRevenueRowSchema>;
export type FinMindStockInfoRow = z.infer<typeof FinMindStockInfoRowSchema>;
