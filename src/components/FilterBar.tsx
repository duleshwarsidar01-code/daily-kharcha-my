import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { TimeframePreset, PaymentMode } from '../types';
import { CategoryIcon } from './CategoryIcon';
import {
  Search,
  Calendar,
  Filter,
  ArrowUpDown,
  X,
  ChevronDown,
  Check,
  RotateCcw,
} from 'lucide-react';

const TIMEFRAME_BUTTONS: { id: TimeframePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'q1', label: 'Q1' },
  { id: 'q2', label: 'Q2' },
  { id: 'q3', label: 'Q3' },
  { id: 'q4', label: 'Q4' },
  { id: 'this_year', label: 'Current Year' },
  { id: 'last_year', label: 'Last Year' },
  { id: 'custom', label: 'Custom' },
];

const PAYMENT_MODES: PaymentMode[] = [
  'UPI',
  'Cash',
  'Credit Card',
  'Debit Card',
  'Net Banking',
];

export const FilterBar: React.FC = () => {
  const {
    dateFilter,
    setDateFilter,
    categories,
    selectedCategories,
    setSelectedCategories,
    selectedPaymentModes,
    setSelectedPaymentModes,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    timeframeInfo,
  } = useExpense();

  const [showCustomRangeModal, setShowCustomRangeModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [customStart, setCustomStart] = useState(dateFilter.startDate || '');
  const [customEnd, setCustomEnd] = useState(dateFilter.endDate || '');

  const hasActiveFilters =
    dateFilter.preset !== 'this_month' ||
    selectedCategories.length > 0 ||
    selectedPaymentModes.length > 0 ||
    searchQuery.trim().length > 0 ||
    sortOrder !== 'date_desc';

  const resetAllFilters = () => {
    setDateFilter({ preset: 'this_month' });
    setSelectedCategories([]);
    setSelectedPaymentModes([]);
    setSearchQuery('');
    setSortOrder('date_desc');
  };

  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) return;
    setDateFilter({
      preset: 'custom',
      startDate: customStart,
      endDate: customEnd,
    });
    setShowCustomRangeModal(false);
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const togglePaymentMode = (mode: PaymentMode) => {
    setSelectedPaymentModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
      {/* Row 1: Timeframe Segmented Preset Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none">
          {TIMEFRAME_BUTTONS.map((item) => {
            const isActive = dateFilter.preset === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'custom') {
                    setShowCustomRangeModal(true);
                  } else {
                    setDateFilter({ preset: item.id });
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Current Active Window Label */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {timeframeInfo.label}
          </span>
        </div>
      </div>

      {/* Row 2: Search, Category Filter, Payment Mode, Sort, Clear */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, note, or merchant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDropdown((prev) => !prev);
                setShowPaymentDropdown(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategories.length > 0
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50 dark:border-indigo-400 dark:text-indigo-300 dark:bg-indigo-950/30'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>
                {selectedCategories.length === 0
                  ? 'All Categories'
                  : `${selectedCategories.length} Categories`}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-1 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Filter Categories
                  </span>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="text-indigo-600 dark:text-indigo-400 text-[11px] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate text-slate-700 dark:text-slate-300">
                          {cat.name}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Mode Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPaymentDropdown((prev) => !prev);
                setShowCategoryDropdown(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                selectedPaymentModes.length > 0
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50 dark:border-indigo-400 dark:text-indigo-300 dark:bg-indigo-950/30'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800'
              }`}
            >
              <span>
                {selectedPaymentModes.length === 0
                  ? 'Payment Mode'
                  : `${selectedPaymentModes.length} Modes`}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPaymentDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-1">
                <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Payment</span>
                  {selectedPaymentModes.length > 0 && (
                    <button
                      onClick={() => setSelectedPaymentModes([])}
                      className="text-indigo-600 dark:text-indigo-400 text-[11px] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {PAYMENT_MODES.map((mode) => {
                  const isChecked = selectedPaymentModes.includes(mode);
                  return (
                    <button
                      key={mode}
                      onClick={() => togglePaymentMode(mode)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <span className="text-slate-700 dark:text-slate-300">{mode}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sort Order Selector */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="appearance-none flex items-center gap-1.5 pl-3 pr-8 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showCustomRangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Custom Date Range
              </h3>
              <button
                onClick={() => setShowCustomRangeModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyCustomRange} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomRangeModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90"
                >
                  Apply Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
