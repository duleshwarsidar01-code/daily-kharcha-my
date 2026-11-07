import React, { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDateShort } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';

interface DonutSlice {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
  path: string;
  startAngle: number;
  endAngle: number;
  centerAngle: number;
}

export const ChartSection: React.FC = () => {
  const { filteredExpenses, categories, currency, timeframeInfo } = useExpense();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  // Category Map
  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c]));
  }, [categories]);

  // Aggregate by Category
  const categoryAggregates = useMemo(() => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;

    filteredExpenses.forEach((exp) => {
      totals[exp.categoryId] = (totals[exp.categoryId] || 0) + exp.amount;
      grandTotal += exp.amount;
    });

    const list = Object.entries(totals)
      .map(([catId, amount]) => {
        const cat = categoryMap.get(catId);
        return {
          categoryId: catId,
          name: cat?.name || 'Unknown',
          color: cat?.color || '#64748b',
          icon: cat?.icon || 'HelpCircle',
          amount,
          percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { list, grandTotal };
  }, [filteredExpenses, categoryMap]);

  // Calculate Donut Slices SVG Paths
  const donutSlices = useMemo<DonutSlice[]>(() => {
    const { list, grandTotal } = categoryAggregates;
    if (grandTotal === 0 || list.length === 0) return [];

    const size = 240;
    const center = size / 2;
    const outerRadius = 100;
    const innerRadius = 66;

    let currentAngle = -Math.PI / 2; // start from 12 o'clock

    return list.map((item) => {
      const sliceAngle = (item.amount / grandTotal) * (2 * Math.PI);
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      const centerAngle = startAngle + sliceAngle / 2;

      // Ensure minimal arc gap
      const adjustedStart = startAngle + 0.015;
      const adjustedEnd = endAngle - 0.015;

      const x1 = center + outerRadius * Math.cos(adjustedStart);
      const y1 = center + outerRadius * Math.sin(adjustedStart);
      const x2 = center + outerRadius * Math.cos(adjustedEnd);
      const y2 = center + outerRadius * Math.sin(adjustedEnd);

      const x3 = center + innerRadius * Math.cos(adjustedEnd);
      const y3 = center + innerRadius * Math.sin(adjustedEnd);
      const x4 = center + innerRadius * Math.cos(adjustedStart);
      const y4 = center + innerRadius * Math.sin(adjustedStart);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const path = [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z',
      ].join(' ');

      currentAngle += sliceAngle;

      return {
        categoryId: item.categoryId,
        categoryName: item.name,
        color: item.color,
        amount: item.amount,
        percentage: item.percentage,
        path,
        startAngle,
        endAngle,
        centerAngle,
      };
    });
  }, [categoryAggregates]);

  // Daily / Timeline Spending Trajectory
  const timelineData = useMemo(() => {
    if (filteredExpenses.length === 0) return [];

    // Group by date
    const dailyMap: Record<string, number> = {};
    filteredExpenses.forEach((exp) => {
      dailyMap[exp.date] = (dailyMap[exp.date] || 0) + exp.amount;
    });

    // Sort dates ascending
    const sortedDates = Object.keys(dailyMap).sort();

    // If within a reasonable window (e.g. <= 31 days), fill missing days for smooth timeline
    const startD = new Date(timeframeInfo.start);
    const endD = new Date(timeframeInfo.end);
    const diffDays = Math.ceil(Math.abs(endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 31 && diffDays > 0) {
      const fullList: { date: string; label: string; amount: number }[] = [];
      const cur = new Date(startD);
      while (cur <= endD) {
        const y = cur.getFullYear();
        const m = (cur.getMonth() + 1).toString().padStart(2, '0');
        const d = cur.getDate().toString().padStart(2, '0');
        const dateKey = `${y}-${m}-${d}`;
        fullList.push({
          date: dateKey,
          label: `${cur.getDate()} ${cur.toLocaleDateString('en-US', { month: 'short' })}`,
          amount: dailyMap[dateKey] || 0,
        });
        cur.setDate(cur.getDate() + 1);
      }
      return fullList;
    }

    // Else if multi-month (Quarter or Year), return sorted active entries
    return sortedDates.map((d) => ({
      date: d,
      label: formatDateShort(d),
      amount: dailyMap[d] || 0,
    }));
  }, [filteredExpenses, timeframeInfo]);

  const maxTimelineAmount = useMemo(() => {
    const max = Math.max(...timelineData.map((d) => d.amount), 0);
    return max > 0 ? max : 1000;
  }, [timelineData]);

  // Active highlighted slice details
  const activeSliceInfo = useMemo(() => {
    if (!activeCategoryId) return null;
    return categoryAggregates.list.find((c) => c.categoryId === activeCategoryId);
  }, [activeCategoryId, categoryAggregates]);

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
        <p className="text-sm font-medium">No expenses recorded for this timeframe.</p>
        <p className="text-xs mt-1">Try switching the date preset or add your first expense above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Donut Chart: Category Share */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Expense by Category
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {categoryAggregates.list.length} categories active
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
              {formatCurrency(categoryAggregates.grandTotal, currency.symbol)}
            </span>
          </div>

          {/* SVG Donut */}
          <div className="relative flex justify-center items-center py-6">
            <svg
              viewBox="0 0 240 240"
              className="w-56 h-56 transform transition-transform duration-300 select-none"
            >
              <g>
                {donutSlices.map((slice) => {
                  const isHovered = activeCategoryId === slice.categoryId;
                  return (
                    <path
                      key={slice.categoryId}
                      d={slice.path}
                      fill={slice.color}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        opacity:
                          activeCategoryId === null || isHovered ? 1 : 0.45,
                        transformOrigin: '120px 120px',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      }}
                      onMouseEnter={() => setActiveCategoryId(slice.categoryId)}
                      onMouseLeave={() => setActiveCategoryId(null)}
                      onClick={() =>
                        setActiveCategoryId((prev) =>
                          prev === slice.categoryId ? null : slice.categoryId
                        )
                      }
                    />
                  );
                })}
              </g>
            </svg>

            {/* Donut Hole Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {activeSliceInfo ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-0.5 truncate max-w-[130px]">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: activeSliceInfo.color }}
                    />
                    <span className="truncate font-medium">{activeSliceInfo.name}</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatCurrency(activeSliceInfo.amount, currency.symbol)}
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {activeSliceInfo.percentage.toFixed(1)}% of total
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
                    Total Spend
                  </span>
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                    {formatCurrency(categoryAggregates.grandTotal, currency.symbol)}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Hover to inspect
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legend list */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          {categoryAggregates.list.slice(0, 5).map((item) => (
            <button
              key={item.categoryId}
              onClick={() =>
                setActiveCategoryId((prev) =>
                  prev === item.categoryId ? null : item.categoryId
                )
              }
              onMouseEnter={() => setActiveCategoryId(item.categoryId)}
              onMouseLeave={() => setActiveCategoryId(null)}
              className={`w-full flex items-center justify-between text-left py-1.5 px-2 rounded-lg text-xs transition-colors ${
                activeCategoryId === item.categoryId
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="font-mono text-slate-900 dark:text-slate-100 font-medium tabular-nums">
                  {formatCurrency(item.amount, currency.symbol)}
                </span>
                <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px] w-9 text-right tabular-nums">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </button>
          ))}
          {categoryAggregates.list.length > 5 && (
            <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center pt-1">
              +{categoryAggregates.list.length - 5} more categories below
            </p>
          )}
        </div>
      </div>

      {/* Bar Chart: Spending Trajectory */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Daily Spending Trajectory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution across {timelineData.length} active intervals
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Peak:</span>
              <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(maxTimelineAmount, currency.symbol)}
              </span>
            </div>
          </div>

          {/* Interactive Bar Chart Area */}
          <div className="pt-6 pb-2">
            <div className="h-48 w-full flex items-end gap-1.5 sm:gap-2 px-1 relative">
              {/* Background gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-slate-200 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-200 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-200 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-300 dark:border-slate-700 w-full" />
              </div>

              {timelineData.map((item, index) => {
                const heightPercent =
                  maxTimelineAmount > 0
                    ? Math.max((item.amount / maxTimelineAmount) * 100, item.amount > 0 ? 6 : 2)
                    : 2;
                const isHovered = activeBarIndex === index;
                const isPeak = item.amount === maxTimelineAmount && item.amount > 0;

                return (
                  <div
                    key={item.date + index}
                    className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                    onMouseEnter={() => setActiveBarIndex(index)}
                    onMouseLeave={() => setActiveBarIndex(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 z-20 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs rounded-md py-1.5 px-2.5 shadow-lg whitespace-nowrap pointer-events-none transform -translate-x-1/2 left-1/2">
                        <div className="font-semibold font-mono">
                          {formatCurrency(item.amount, currency.symbol)}
                        </div>
                        <div className="text-[10px] opacity-75">{item.label}</div>
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      className={`w-full max-w-[28px] rounded-t-sm transition-all duration-200 ${
                        item.amount === 0
                          ? 'bg-slate-200 dark:bg-slate-800 opacity-60'
                          : isPeak
                          ? 'bg-emerald-600 dark:bg-emerald-500 shadow-sm'
                          : isHovered
                          ? 'bg-indigo-600 dark:bg-indigo-400'
                          : 'bg-indigo-500/80 dark:bg-indigo-500/70'
                      }`}
                      style={{
                        height: `${heightPercent}%`,
                        transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                        transformOrigin: 'bottom',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 pt-3 px-1 border-t border-slate-100 dark:border-slate-800">
              {timelineData.length > 0 && (
                <>
                  <span>{timelineData[0].label}</span>
                  {timelineData.length > 4 && (
                    <span>{timelineData[Math.floor(timelineData.length / 2)].label}</span>
                  )}
                  <span>{timelineData[timelineData.length - 1].label}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Trajectory Insights Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-emerald-600 dark:bg-emerald-500 inline-block" />
            <span>Highest Day: {formatCurrency(maxTimelineAmount, currency.symbol)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" />
            <span>Regular Spending Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
