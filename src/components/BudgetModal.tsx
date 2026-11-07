import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/dateUtils';
import { X, Target, Check } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { budget, setBudget, currency } = useExpense();
  const [monthlyLimit, setMonthlyLimit] = useState(budget.monthlyLimit.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(monthlyLimit);
    if (!isNaN(val) && val >= 0) {
      setBudget({
        monthlyLimit: val,
        enabled: true,
      });
      onClose();
    }
  };

  const quickLimits = [15000, 25000, 35000, 50000, 75000, 100000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Monthly Budget Goal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Set your target monthly expense cap to track savings and get visual warnings when approaching your limit.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Limit ({currency.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold font-mono text-slate-400">
                {currency.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm font-bold font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
              Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {quickLimits.map((lim) => (
                <button
                  key={lim}
                  type="button"
                  onClick={() => setMonthlyLimit(lim.toString())}
                  className={`py-1 px-2 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                    parseFloat(monthlyLimit) === lim
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {formatCurrency(lim, currency.symbol)}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90 cursor-pointer"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
