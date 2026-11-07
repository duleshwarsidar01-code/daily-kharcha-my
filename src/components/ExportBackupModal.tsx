import React, { useRef, useState } from 'react';
import { useExpense, SUPPORTED_CURRENCIES } from '../context/ExpenseContext';
import {
  X,
  FileSpreadsheet,
  Printer,
  Database,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  AlertCircle,
  Coins,
  Smartphone,
} from 'lucide-react';

interface ExportBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerPrint: () => void;
  onOpenInstallModal?: () => void;
}

export const ExportBackupModal: React.FC<ExportBackupModalProps> = ({
  isOpen,
  onClose,
  onTriggerPrint,
  onOpenInstallModal,
}) => {
  const {
    filteredExpenses,
    exportFilteredAsCSV,
    exportDataAsJSON,
    importData,
    resetToMockData,
    clearAllData,
    currency,
    setCurrency,
  } = useExpense();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(null), 3500);
      } else {
        setImportStatus('Failed to import: invalid JSON schema');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Data Management & Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Export spreadsheets, backup offline data, or configure currency
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {importStatus && (
            <div
              className={`p-3 text-xs rounded-lg flex items-center gap-2 ${
                importStatus.includes('success')
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Currency Configuration */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <Coins className="w-4 h-4 text-slate-500" />
              <span>Display Currency & Symbol</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isSelected = currency.code === curr.code;
                return (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr)}
                    className={`p-2 rounded-lg text-left text-xs border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-mono text-sm">{curr.symbol}</div>
                    <div className="text-[11px] truncate opacity-80">{curr.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Reports Section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Export Spending Reports
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  exportFilteredAsCSV();
                  onClose();
                }}
                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                    Download CSV
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    {filteredExpenses.length} filtered items
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onTriggerPrint(), 200);
                }}
                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                    Print / Save PDF
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    Clean summary layout
                  </div>
                </div>
              </button>
            </div>

            {onOpenInstallModal && (
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onOpenInstallModal(), 150);
                }}
                className="w-full mt-2.5 flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Install on Android / Download APK
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      Standalone mobile app with offline storage
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Setup &rarr;
                </span>
              </button>
            )}
          </div>

          {/* Offline-First Backup & Restore */}
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Offline Storage Backup & Restore
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={exportDataAsJSON}
                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Backup JSON
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    Full database file
                  </div>
                </div>
              </button>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Restore JSON
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Load backup file
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Data Reset & Sample Restoration */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                if (window.confirm('Reset all expense data back to default sample records?')) {
                  resetToMockData();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all expenses? This will clear all records.')) {
                  clearAllData();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
