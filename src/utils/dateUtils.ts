import { TimeframePreset } from '../types';

export const padZero = (n: number) => n.toString().padStart(2, '0');

export const toISODateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = padZero(date.getMonth() + 1);
  const d = padZero(date.getDate());
  return `${y}-${m}-${d}`;
};

export const getDateRangeForPreset = (
  preset: TimeframePreset,
  customStart?: string,
  customEnd?: string
): { start: string; end: string; label: string } => {
  const now = new Date();
  const currentYear = now.getFullYear();

  switch (preset) {
    case 'today': {
      const todayStr = toISODateString(now);
      return { start: todayStr, end: todayStr, label: 'Today' };
    }
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = toISODateString(yesterday);
      return { start: yStr, end: yStr, label: 'Yesterday' };
    }
    case 'this_week': {
      // Monday as first day of week
      const current = new Date(now);
      const day = current.getDay();
      const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(current.setDate(diffToMonday));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return {
        start: toISODateString(monday),
        end: toISODateString(sunday),
        label: 'This Week',
      };
    }
    case 'this_month': {
      const firstDay = new Date(currentYear, now.getMonth(), 1);
      const lastDay = new Date(currentYear, now.getMonth() + 1, 0);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return {
        start: toISODateString(firstDay),
        end: toISODateString(lastDay),
        label: `${monthNames[now.getMonth()]} ${currentYear}`,
      };
    }
    case 'last_month': {
      const firstDay = new Date(currentYear, now.getMonth() - 1, 1);
      const lastDay = new Date(currentYear, now.getMonth(), 0);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return {
        start: toISODateString(firstDay),
        end: toISODateString(lastDay),
        label: `${monthNames[firstDay.getMonth()]} ${firstDay.getFullYear()}`,
      };
    }
    case 'q1': {
      return {
        start: `${currentYear}-01-01`,
        end: `${currentYear}-03-31`,
        label: `Q1 (Jan - Mar ${currentYear})`,
      };
    }
    case 'q2': {
      return {
        start: `${currentYear}-04-01`,
        end: `${currentYear}-06-30`,
        label: `Q2 (Apr - Jun ${currentYear})`,
      };
    }
    case 'q3': {
      return {
        start: `${currentYear}-07-01`,
        end: `${currentYear}-09-30`,
        label: `Q3 (Jul - Sep ${currentYear})`,
      };
    }
    case 'q4': {
      return {
        start: `${currentYear}-10-01`,
        end: `${currentYear}-12-31`,
        label: `Q4 (Oct - Dec ${currentYear})`,
      };
    }
    case 'this_year': {
      return {
        start: `${currentYear}-01-01`,
        end: `${currentYear}-12-31`,
        label: `Year ${currentYear}`,
      };
    }
    case 'last_year': {
      const prevYear = currentYear - 1;
      return {
        start: `${prevYear}-01-01`,
        end: `${prevYear}-12-31`,
        label: `Year ${prevYear}`,
      };
    }
    case 'custom': {
      const start = customStart || toISODateString(now);
      const end = customEnd || toISODateString(now);
      return {
        start,
        end,
        label: `${formatDateShort(start)} – ${formatDateShort(end)}`,
      };
    }
    default: {
      const todayStr = toISODateString(now);
      return { start: todayStr, end: todayStr, label: 'Today' };
    }
  }
};

export const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const now = new Date();
  const todayStr = toISODateString(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toISODateString(yesterday);

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const formatCurrency = (amount: number, symbol: string = '₹'): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  let formatted = '';
  if (symbol === '₹') {
    // Indian formatting (Lakhs and Crores: 1,50,000)
    formatted = absAmount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: absAmount % 1 !== 0 ? 2 : 0,
    });
  } else {
    formatted = absAmount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: absAmount % 1 !== 0 ? 2 : 0,
    });
  }

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
};

export const getDaysElapsedInInterval = (startDateStr: string, endDateStr: string): number => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // If the interval extends into the future, cap it at today for realistic daily average
  const effectiveEnd = end > today ? today : end;
  
  if (effectiveEnd < start) {
    return 1;
  }

  const diffTime = Math.abs(effectiveEnd.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
};
