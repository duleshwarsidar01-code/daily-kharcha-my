import React from 'react';
import { Plus, Sun, Moon, Database, SlidersHorizontal, Smartphone } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'transactions' | 'breakdown';
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'breakdown') => void;
  onOpenAddExpense: () => void;
  onOpenCategories: () => void;
  onOpenExportBackup: () => void;
  onOpenInstallModal: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddExpense,
  onOpenCategories,
  onOpenExportBackup,
  onOpenInstallModal,
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
            ₹
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            Kharach
          </span>
        </div>

        {/* Zone 2: Clean single-line navigation tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'dashboard'
                ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'transactions'
                ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'breakdown'
                ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Category Logs
          </button>
          <button
            onClick={onOpenCategories}
            className="whitespace-nowrap transition-colors cursor-pointer py-1 hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-300"
          >
            Categories
          </button>
          <button
            onClick={onOpenExportBackup}
            className="whitespace-nowrap transition-colors cursor-pointer py-1 hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-300"
          >
            Reports & Backup
          </button>
          <button
            onClick={onOpenInstallModal}
            className="whitespace-nowrap transition-colors cursor-pointer py-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold flex items-center gap-1"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install APK</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Install APK on mobile */}
          <button
            onClick={onOpenInstallModal}
            className="md:hidden p-2 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
            title="Download APK / Install App"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Quick Category Manager on mobile */}
          <button
            onClick={onOpenCategories}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Manage Categories"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Export & Backup on mobile */}
          <button
            onClick={onOpenExportBackup}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Export / Backup"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Add Expense</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Selector */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800/80 px-2 py-1.5 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-medium">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-1 px-3 rounded-md transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-500'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`py-1 px-3 rounded-md transition-colors cursor-pointer ${
            activeTab === 'transactions'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-500'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`py-1 px-3 rounded-md transition-colors cursor-pointer ${
            activeTab === 'breakdown'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-500'
          }`}
        >
          Categories
        </button>
      </div>
    </header>
  );
};
