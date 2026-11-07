import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Expense } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';
import {
  Receipt,
  Edit2,
  Trash2,
  Copy,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from 'lucide-react';

interface ExpenseListProps {
  onAddNew: () => void;
  onEditExpense: (expense: Expense) => void;
  onViewReceipt: (url: string, title: string) => void;
  onRequestDelete: (id: string, title: string) => void;
  onDuplicateExpense: (expense: Expense) => void;
}

const ITEMS_PER_PAGE = 12;

export const ExpenseList: React.FC<ExpenseListProps> = ({
  onAddNew,
  onEditExpense,
  onViewReceipt,
  onRequestDelete,
  onDuplicateExpense,
}) => {
  const { filteredExpenses, categories, currency } = useExpense();
  const [currentPage, setCurrentPage] = useState(1);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <ListFilter className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No transactions found
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
          There are no expenses matching your current filters or date range. Clear filters or record a new expense.
        </p>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Transaction History
          </h3>
          <p className="text-xs text-slate-500">
            Showing {filteredExpenses.length} records in current view
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Item rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {paginatedItems.map((item) => {
          const category = categoryMap.get(item.categoryId);
          const catColor = category?.color || '#64748b';
          const catIcon = category?.icon || 'HelpCircle';
          const catName = category?.name || 'Miscellaneous';

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 sm:px-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                {/* Category Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${catColor}15` }}
                >
                  <CategoryIcon name={catIcon} color={catColor} size={18} />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      {item.paymentMode}
                    </span>
                    {item.receiptUrl && (
                      <button
                        onClick={() => onViewReceipt(item.receiptUrl!, item.title)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center gap-0.5 text-[10px] cursor-pointer"
                        title="View Receipt Image"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{catName}</span>
                    <span aria-hidden="true">·</span>
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
                        <span className="italic truncate max-w-[180px] sm:max-w-xs text-slate-600 dark:text-slate-400">
                          {item.note}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatCurrency(item.amount, currency.symbol)}
                </span>

                <div className="flex items-center gap-1 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDuplicateExpense(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Duplicate entry"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEditExpense(item)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit entry"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRequestDelete(item.id, item.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Page <span className="font-semibold text-slate-700 dark:text-slate-300">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
