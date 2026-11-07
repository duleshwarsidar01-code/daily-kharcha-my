/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { Navbar } from './components/Navbar';
import { DashboardSummary } from './components/DashboardSummary';
import { ChartSection } from './components/ChartSection';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { FilterBar } from './components/FilterBar';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { BudgetModal } from './components/BudgetModal';
import { ReceiptViewModal } from './components/ReceiptViewModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ExportBackupModal } from './components/ExportBackupModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { FloatingAddButton } from './components/FloatingAddButton';
import { PrintableReport } from './components/PrintableReport';
import { Expense } from './types';
import { Plus, ArrowRight, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { deleteExpense, addExpense, filteredExpenses, categories } = useExpense();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'breakdown'>('dashboard');

  // Modals state
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isExportBackupOpen, setIsExportBackupOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<{ url: string; title: string } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('kharach_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('kharach_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('kharach_theme', 'light');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Handlers
  const handleAddNew = () => {
    setEditingExpense(null);
    setIsExpenseFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseFormOpen(true);
  };

  const handleDuplicateExpense = (expense: Expense) => {
    addExpense({
      title: `${expense.title} (Copy)`,
      amount: expense.amount,
      date: expense.date,
      time: expense.time,
      categoryId: expense.categoryId,
      paymentMode: expense.paymentMode,
      note: expense.note,
      receiptUrl: expense.receiptUrl,
    });
    showToast(`Duplicated "${expense.title}"`);
  };

  const handleRequestDelete = (id: string, title: string) => {
    setItemToDelete({ id, title });
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteExpense(itemToDelete.id);
      showToast(`Deleted "${itemToDelete.title}"`);
      setItemToDelete(null);
    }
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddExpense={handleAddNew}
        onOpenCategories={() => setIsCategoriesOpen(true)}
        onOpenExportBackup={() => setIsExportBackupOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Viewport */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-150 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Filter Bar (Available across views) */}
        <FilterBar />

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <DashboardSummary onOpenBudgetModal={() => setIsBudgetOpen(true)} />
            <ChartSection />
            <CategoryBreakdown
              onEditExpense={handleEditExpense}
              onViewReceipt={(url, title) => setViewingReceipt({ url, title })}
              onRequestDelete={handleRequestDelete}
            />

            {/* Recent activity quick preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Recent Activity
                </h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>View all transactions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <ExpenseList
                onAddNew={handleAddNew}
                onEditExpense={handleEditExpense}
                onViewReceipt={(url, title) => setViewingReceipt({ url, title })}
                onRequestDelete={handleRequestDelete}
                onDuplicateExpense={handleDuplicateExpense}
              />
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <ExpenseList
              onAddNew={handleAddNew}
              onEditExpense={handleEditExpense}
              onViewReceipt={(url, title) => setViewingReceipt({ url, title })}
              onRequestDelete={handleRequestDelete}
              onDuplicateExpense={handleDuplicateExpense}
            />
          </div>
        )}

        {/* Category Breakdown Tab */}
        {activeTab === 'breakdown' && (
          <div className="space-y-6">
            <CategoryBreakdown
              onEditExpense={handleEditExpense}
              onViewReceipt={(url, title) => setViewingReceipt({ url, title })}
              onRequestDelete={handleRequestDelete}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <FloatingAddButton onClick={handleAddNew} />

      {/* Modals */}
      <ExpenseForm
        isOpen={isExpenseFormOpen}
        onClose={() => {
          setIsExpenseFormOpen(false);
          setEditingExpense(null);
        }}
        editingExpense={editingExpense}
      />

      <CategoryManagerModal
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
      />

      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
      />

      <ReceiptViewModal
        receiptUrl={viewingReceipt?.url || null}
        title={viewingReceipt?.title || ''}
        onClose={() => setViewingReceipt(null)}
      />

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        itemTitle={itemToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <ExportBackupModal
        isOpen={isExportBackupOpen}
        onClose={() => setIsExportBackupOpen(false)}
        onTriggerPrint={handleTriggerPrint}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Printable Sheet for Print / PDF Generation */}
      <PrintableReport />

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800 py-6 mt-12 bg-white/50 dark:bg-slate-900/50 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Kharach</span>
            <span>·</span>
            <span>Daily Expense & Budget Tracker</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Offline-First (LocalStorage)</span>
            <span>·</span>
            <span>INR / Multi-Currency Support</span>
            <span>·</span>
            <button
              onClick={() => setIsExportBackupOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Export CSV / PDF
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
