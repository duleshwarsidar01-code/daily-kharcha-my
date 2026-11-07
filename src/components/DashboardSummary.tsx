import React, { useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, getDaysElapsedInInterval } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';
import { TrendingUp, Calendar, AlertCircle, CheckCircle2, Sliders } from 'lucide-react';

interface TopCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  amount: number;
  percentage: number;
  count: number;
}

interface DashboardSummaryProps {
  onOpenBudgetModal: () => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ onOpenBudgetModal }) => {
  const { filteredExpenses, categories, currency, budget, timeframeInfo } = useExpense();

  // Metrics Calculations
  const metrics = useMemo<{
    totalSpend: number;
    transactionCount: number;
    daysElapsed: number;
    dailyAverage: number;
    topCategory: TopCategory | null;
    budgetLimit: number;
    budgetUsedPercentage: number;
    remainingBudget: number;
  }>(() => {
    let totalSpend = 0;
    const categoryTotals: Record<string, { amount: number; count: number }> = {};

    filteredExpenses.forEach((exp) => {
      totalSpend += exp.amount;
      if (!categoryTotals[exp.categoryId]) {
        categoryTotals[exp.categoryId] = { amount: 0, count: 0 };
      }
      categoryTotals[exp.categoryId].amount += exp.amount;
      categoryTotals[exp.categoryId].count += 1;
    });

    // Daily Average
    const daysElapsed = getDaysElapsedInInterval(timeframeInfo.start, timeframeInfo.end);
    const dailyAverage = totalSpend / daysElapsed;

    // Highest Spending Category
    let topCategory: TopCategory | null = null;
    let highestAmount = 0;

    Object.entries(categoryTotals).forEach(([catId, data]) => {
      if (data.amount > highestAmount) {
        highestAmount = data.amount;
        const categoryMeta = categories.find((c) => c.id === catId);
        topCategory = {
          id: catId,
          name: categoryMeta?.name || 'Unknown',
          color: categoryMeta?.color || '#64748b',
          icon: categoryMeta?.icon || 'HelpCircle',
          amount: data.amount,
          percentage: totalSpend > 0 ? (data.amount / totalSpend) * 100 : 0,
          count: data.count,
        };
      }
    });

    // Budget Comparison
    const budgetLimit = budget.monthlyLimit;
    const budgetUsedPercentage = budgetLimit > 0 ? (totalSpend / budgetLimit) * 100 : 0;
    const remainingBudget = budgetLimit - totalSpend;

    return {
      totalSpend,
      transactionCount: filteredExpenses.length,
      daysElapsed,
      dailyAverage,
      topCategory,
      budgetLimit,
      budgetUsedPercentage,
      remainingBudget,
    };
  }, [filteredExpenses, categories, timeframeInfo, budget]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Spend */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Spend
          </span>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
            {timeframeInfo.label}
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {formatCurrency(metrics.totalSpend, currency.symbol)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-mono tabular-nums">{metrics.transactionCount}</span>
            <span>transactions recorded</span>
          </div>
        </div>
      </div>

      {/* 2. Daily Average Spend */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Daily Average Spend
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-mono">{metrics.daysElapsed} days</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {formatCurrency(metrics.dailyAverage, currency.symbol)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculated across active period
          </div>
        </div>
      </div>

      {/* 3. Highest Spending Category */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Top Spending Category
          </span>
          {metrics.topCategory && (
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              {metrics.topCategory.percentage.toFixed(0)}% of spend
            </span>
          )}
        </div>
        <div className="mt-3">
          {metrics.topCategory ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${metrics.topCategory.color}20` }}
                >
                  <CategoryIcon
                    name={metrics.topCategory.icon}
                    size={13}
                    color={metrics.topCategory.color}
                  />
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {metrics.topCategory.name}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                {formatCurrency(metrics.topCategory.amount, currency.symbol)}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 py-2">No category data yet</div>
          )}
        </div>
      </div>

      {/* 4. Monthly Budget Progress */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Monthly Budget Goal
          </span>
          <button
            onClick={onOpenBudgetModal}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-0.5"
            title="Configure monthly budget"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {formatCurrency(metrics.remainingBudget, currency.symbol)}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              of {formatCurrency(metrics.budgetLimit, currency.symbol)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                metrics.budgetUsedPercentage > 100
                  ? 'bg-rose-500'
                  : metrics.budgetUsedPercentage > 85
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(metrics.budgetUsedPercentage, 100)}%` }}
            />
          </div>

          {/* Status text */}
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {metrics.budgetUsedPercentage.toFixed(0)}% utilized
            </span>
            <span
              className={`font-medium ${
                metrics.remainingBudget < 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {metrics.remainingBudget < 0 ? 'Over budget' : 'On track'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
