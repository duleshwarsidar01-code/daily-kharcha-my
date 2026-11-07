import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Expense,
  Category,
  DateFilter,
  SortOrder,
  CurrencyConfig,
  BudgetConfig,
  PaymentMode,
} from '../types';
import { PREDEFINED_CATEGORIES } from '../utils/categories';
import { getInitialSeedExpenses } from '../utils/mockData';
import { getDateRangeForPreset } from '../utils/dateUtils';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  currency: CurrencyConfig;
  setCurrency: (currency: CurrencyConfig) => void;
  budget: BudgetConfig;
  setBudget: (budget: BudgetConfig) => void;
  dateFilter: DateFilter;
  setDateFilter: React.Dispatch<React.SetStateAction<DateFilter>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPaymentModes: PaymentMode[];
  setSelectedPaymentModes: React.Dispatch<React.SetStateAction<PaymentMode[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  filteredExpenses: Expense[];
  timeframeInfo: { start: string; end: string; label: string };
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetToMockData: () => void;
  clearAllData: () => void;
  importData: (jsonData: string) => boolean;
  exportDataAsJSON: () => void;
  exportFilteredAsCSV: () => void;
}

const STORAGE_KEYS = {
  EXPENSES: 'kharach_expenses_v1',
  CATEGORIES: 'kharach_categories_v1',
  CURRENCY: 'kharach_currency_v1',
  BUDGET: 'kharach_budget_v1',
};

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { symbol: '₹', code: 'INR', label: 'INR (₹) - Indian Rupee' },
  { symbol: '$', code: 'USD', label: 'USD ($) - US Dollar' },
  { symbol: '€', code: 'EUR', label: 'EUR (€) - Euro' },
  { symbol: '£', code: 'GBP', label: 'GBP (£) - British Pound' },
  { symbol: '¥', code: 'JPY', label: 'JPY (¥) - Japanese Yen' },
  { symbol: 'AED', code: 'AED', label: 'AED - UAE Dirham' },
  { symbol: 'C$', code: 'CAD', label: 'CAD (C$) - Canadian Dollar' },
  { symbol: 'A$', code: 'AUD', label: 'AUD (A$) - Australian Dollar' },
];

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load expenses from LocalStorage or seed data
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return getInitialSeedExpenses();
  });

  // Load categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return PREDEFINED_CATEGORIES;
  });

  // Currency
  const [currency, setCurrencyState] = useState<CurrencyConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return SUPPORTED_CURRENCIES[0];
  });

  // Monthly Budget limit
  const [budget, setBudgetState] = useState<BudgetConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return { monthlyLimit: 35000, enabled: true };
  });

  // Filter states
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    preset: 'this_month',
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPaymentModes, setSelectedPaymentModes] = useState<PaymentMode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('date_desc');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch {
      // storage full or disabled
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  const setCurrency = (c: CurrencyConfig) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(c));
    } catch {
      // ignore
    }
  };

  const setBudget = (b: BudgetConfig) => {
    setBudgetState(b);
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(b));
    } catch {
      // ignore
    }
  };

  // Calculate timeframe bounds
  const timeframeInfo = useMemo(() => {
    return getDateRangeForPreset(dateFilter.preset, dateFilter.startDate, dateFilter.endDate);
  }, [dateFilter]);

  // Filtered & Sorted Expenses
  const filteredExpenses = useMemo(() => {
    const { start, end } = timeframeInfo;

    return expenses
      .filter((expense) => {
        // Date range match
        if (expense.date < start || expense.date > end) {
          return false;
        }

        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(expense.categoryId)) {
          return false;
        }

        // Payment mode filter
        if (
          selectedPaymentModes.length > 0 &&
          !selectedPaymentModes.includes(expense.paymentMode)
        ) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const categoryName = categories.find((c) => c.id === expense.categoryId)?.name || '';
          const matchTitle = expense.title.toLowerCase().includes(q);
          const matchNote = expense.note?.toLowerCase().includes(q) || false;
          const matchCategory = categoryName.toLowerCase().includes(q);
          const matchAmount = expense.amount.toString().includes(q);
          if (!matchTitle && !matchNote && !matchCategory && !matchAmount) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'date_desc') {
          const dateDiff = b.date.localeCompare(a.date);
          if (dateDiff !== 0) return dateDiff;
          return (b.time || '').localeCompare(a.time || '') || b.createdAt - a.createdAt;
        }
        if (sortOrder === 'date_asc') {
          const dateDiff = a.date.localeCompare(b.date);
          if (dateDiff !== 0) return dateDiff;
          return (a.time || '').localeCompare(b.time || '') || a.createdAt - b.createdAt;
        }
        if (sortOrder === 'amount_desc') {
          return b.amount - a.amount;
        }
        if (sortOrder === 'amount_asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [
    expenses,
    timeframeInfo,
    selectedCategories,
    selectedPaymentModes,
    searchQuery,
    sortOrder,
    categories,
  ]);

  // Actions
  const addExpense = (newExp: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const created: Expense = {
      ...newExp,
      id: `exp-${now}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    setExpenses((prev) => [created, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated, updatedAt: Date.now() } : item))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const newCategory: Category = {
      ...cat,
      id,
      isDefault: false,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCategory = (id: string) => {
    // Reassign any expense in this category to 'miscellaneous'
    setExpenses((prev) =>
      prev.map((e) => (e.categoryId === id ? { ...e, categoryId: 'miscellaneous' } : e))
    );
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
  };

  const resetToMockData = () => {
    const seeds = getInitialSeedExpenses();
    setExpenses(seeds);
    setCategories(PREDEFINED_CATEGORIES);
    setSelectedCategories([]);
    setSelectedPaymentModes([]);
    setSearchQuery('');
    setDateFilter({ preset: 'this_month' });
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(seeds));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(PREDEFINED_CATEGORIES));
    } catch {
      // ignore
    }
  };

  const clearAllData = () => {
    setExpenses([]);
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  const exportDataAsJSON = () => {
    const data = {
      app: 'Kharach Expense Tracker',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      currency,
      budget,
      categories,
      expenses,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kharach_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.expenses)) {
        setExpenses(parsed.expenses);
        if (Array.isArray(parsed.categories)) {
          setCategories(parsed.categories);
        }
        if (parsed.currency) {
          setCurrency(parsed.currency);
        }
        if (parsed.budget) {
          setBudget(parsed.budget);
        }
        return true;
      }
    } catch (err) {
      console.error('Import failed', err);
    }
    return false;
  };

  const exportFilteredAsCSV = () => {
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    const headers = ['ID', 'Date', 'Time', 'Title / Merchant', 'Category', 'Amount', 'Payment Mode', 'Notes'];
    
    const rows = filteredExpenses.map((e) => [
      `"${e.id}"`,
      `"${e.date}"`,
      `"${e.time || ''}"`,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${(categoryMap.get(e.categoryId) || e.categoryId).replace(/"/g, '""')}"`,
      e.amount,
      `"${e.paymentMode}"`,
      `"${(e.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kharach_expenses_${dateFilter.preset}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        currency,
        setCurrency,
        budget,
        setBudget,
        dateFilter,
        setDateFilter,
        selectedCategories,
        setSelectedCategories,
        selectedPaymentModes,
        setSelectedPaymentModes,
        searchQuery,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        filteredExpenses,
        timeframeInfo,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToMockData,
        clearAllData,
        importData,
        exportDataAsJSON,
        exportFilteredAsCSV,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
