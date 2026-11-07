import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDateShort } from '../utils/dateUtils';

export const PrintableReport: React.FC = () => {
  const { filteredExpenses, categories, currency, timeframeInfo, budget } = useExpense();

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const grandTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category for summary
  const catTotals: Record<string, { name: string; amount: number; count: number }> = {};
  filteredExpenses.forEach((exp) => {
    if (!catTotals[exp.categoryId]) {
      catTotals[exp.categoryId] = {
        name: categoryMap.get(exp.categoryId) || exp.categoryId,
        amount: 0,
        count: 0,
      };
    }
    catTotals[exp.categoryId].amount += exp.amount;
    catTotals[exp.categoryId].count += 1;
  });

  const categorySummaryList = Object.values(catTotals).sort((a, b) => b.amount - a.amount);

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans text-xs">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex justify-between items-baseline">
          <h1 className="text-2xl font-bold tracking-tight">KHARACH EXPENSE STATEMENT</h1>
          <span className="font-mono text-sm">Generated: {new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-700 mt-2 font-medium">
          <div>Report Timeframe: <span className="font-bold text-black">{timeframeInfo.label}</span></div>
          <div>Period: <span className="font-mono">{formatDateShort(timeframeInfo.start)} – {formatDateShort(timeframeInfo.end)}</span></div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-4 gap-4 p-4 border border-gray-300 rounded-md mb-6">
        <div>
          <div className="text-gray-500 uppercase text-[10px] font-semibold">Total Expenditure</div>
          <div className="text-lg font-bold font-mono mt-1">{formatCurrency(grandTotal, currency.symbol)}</div>
        </div>
        <div>
          <div className="text-gray-500 uppercase text-[10px] font-semibold">Total Records</div>
          <div className="text-lg font-bold font-mono mt-1">{filteredExpenses.length}</div>
        </div>
        <div>
          <div className="text-gray-500 uppercase text-[10px] font-semibold">Monthly Budget</div>
          <div className="text-lg font-bold font-mono mt-1">{formatCurrency(budget.monthlyLimit, currency.symbol)}</div>
        </div>
        <div>
          <div className="text-gray-500 uppercase text-[10px] font-semibold">Active Categories</div>
          <div className="text-lg font-bold font-mono mt-1">{categorySummaryList.length}</div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">
          Category Summary
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-400 font-semibold text-[11px]">
              <th className="py-1">Category</th>
              <th className="py-1 text-center">Transactions</th>
              <th className="py-1 text-right">Amount</th>
              <th className="py-1 text-right">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {categorySummaryList.map((cat, idx) => {
              const pct = grandTotal > 0 ? (cat.amount / grandTotal) * 100 : 0;
              return (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-1">{cat.name}</td>
                  <td className="py-1 text-center font-mono">{cat.count}</td>
                  <td className="py-1 text-right font-mono font-semibold">
                    {formatCurrency(cat.amount, currency.symbol)}
                  </td>
                  <td className="py-1 text-right font-mono">{pct.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Itemized Transactions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">
          Itemized Transactions
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-400 font-semibold text-[11px]">
              <th className="py-1">Date</th>
              <th className="py-1">Title / Merchant</th>
              <th className="py-1">Category</th>
              <th className="py-1">Payment Mode</th>
              <th className="py-1">Notes</th>
              <th className="py-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="border-b border-gray-200">
                <td className="py-1 font-mono">{exp.date}</td>
                <td className="py-1 font-medium">{exp.title}</td>
                <td className="py-1">{categoryMap.get(exp.categoryId) || exp.categoryId}</td>
                <td className="py-1">{exp.paymentMode}</td>
                <td className="py-1 text-gray-600 italic">{exp.note || '-'}</td>
                <td className="py-1 text-right font-mono font-semibold">
                  {formatCurrency(exp.amount, currency.symbol)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-gray-500 text-[10px]">
        Kharach Expense & Budget Tracker · Offline-First Personal Finance
      </div>
    </div>
  );
};
