import React, { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDateDisplay } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';
import { Expense } from '../types';
import {
  ChevronDown,
  ChevronRight,
  Receipt,
  Edit2,
  Trash2,
  Layers,
} from 'lucide-react';

interface CategoryBreakdownProps {
  onEditExpense: (expense: Expense) => void;
  onViewReceipt: (url: string, title: string) => void;
  onRequestDelete: (id: string, title: string) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  onEditExpense,
  onViewReceipt,
  onRequestDelete,
}) => {
  const { filteredExpenses, categories, currency } = useExpense();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Group expenses by category
  const breakdownData = useMemo(() => {
    let grandTotal = 0;
    const map: Record<string, { total: number; items: Expense[] }> = {};

    filteredExpenses.forEach((exp) => {
      grandTotal += exp.amount;
      if (!map[exp.categoryId]) {
        map[exp.categoryId] = { total: 0, items: [] };
      }
      map[exp.categoryId].total += exp.amount;
      map[exp.categoryId].items.push(exp);
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const list = Object.entries(map)
      .map(([catId, data]) => {
        const cat = categoryMap.get(catId);
        return {
          category: cat || {
            id: catId,
            name: 'Unknown Category',
            icon: 'HelpCircle',
            color: '#64748b',
            bgLight: 'rgba(100, 116, 139, 0.12)',
          },
          total: data.total,
          count: data.items.length,
          percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
          items: data.items.sort((a, b) => b.date.localeCompare(a.date) || (b.time || '').localeCompare(a.time || '')),
        };
      })
      .sort((a, b) => b.total - a.total);

    return { list, grandTotal };
  }, [filteredExpenses, categories]);

  const toggleExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    breakdownData.list.forEach((item) => {
      allExpanded[item.category.id] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  if (breakdownData.list.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Category Breakdown & Itemized Logs
          </h3>
          <span className="text-xs text-slate-400">
            ({breakdownData.list.length} categories)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={expandAll}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <button
            onClick={collapseAll}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-1">
        {breakdownData.list.map(({ category, total, count, percentage, items }) => {
          const isExpanded = !!expandedCategories[category.id];

          return (
            <div key={category.id} className="py-2.5">
              {/* Category Header Row (Clickable Accordion) */}
              <button
                onClick={() => toggleExpand(category.id)}
                className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${category.color}18` }}
                  >
                    <CategoryIcon name={category.icon} color={category.color} size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                      <span>{count} {count === 1 ? 'transaction' : 'transactions'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{percentage.toFixed(1)}% of total</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCurrency(total, currency.symbol)}
                    </div>
                    {/* Small progress meter */}
                    <div className="w-16 sm:w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Itemized Logs Drawer */}
              {isExpanded && (
                <div className="mt-2 pl-4 sm:pl-11 pr-2 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 text-xs hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                            {item.paymentMode}
                          </span>
                          {item.receiptUrl && (
                            <button
                              onClick={() => onViewReceipt(item.receiptUrl!, item.title)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 inline-flex items-center gap-0.5 text-[10px]"
                              title="View Receipt"
                            >
                              <Receipt className="w-3 h-3" />
                              <span>Receipt</span>
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                          <span>{formatDateDisplay(item.date)}</span>
                          {item.time && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{item.time}</span>
                            </>
                          )}
                          {item.note && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="italic truncate max-w-[200px] text-slate-600 dark:text-slate-400">
                                {item.note}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          {formatCurrency(item.amount, currency.symbol)}
                        </span>
                        <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditExpense(item)}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit entry"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onRequestDelete(item.id, item.title)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
