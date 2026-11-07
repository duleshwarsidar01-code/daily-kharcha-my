export type PaymentMode = 'UPI' | 'Cash' | 'Credit Card' | 'Debit Card' | 'Net Banking';

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // Hex color code
  bgLight: string; // Light tint for icon background
  isDefault?: boolean;
  description?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  categoryId: string;
  paymentMode: PaymentMode;
  note?: string;
  receiptUrl?: string; // base64 data URL
  createdAt: number;
  updatedAt: number;
}

export type TimeframePreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'last_month'
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'this_year'
  | 'last_year'
  | 'custom';

export interface DateFilter {
  preset: TimeframePreset;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export type SortOrder = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export interface CurrencyConfig {
  symbol: string;
  code: string;
  label: string;
}

export interface BudgetConfig {
  monthlyLimit: number;
  enabled: boolean;
}
