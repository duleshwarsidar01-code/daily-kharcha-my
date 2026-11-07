import React from 'react';
import { X, Download } from 'lucide-react';

interface ReceiptViewModalProps {
  receiptUrl: string | null;
  title: string;
  onClose: () => void;
}

export const ReceiptViewModal: React.FC<ReceiptViewModalProps> = ({
  receiptUrl,
  title,
  onClose,
}) => {
  if (!receiptUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = receiptUrl;
    a.download = `receipt_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="truncate pr-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h3>
            <span className="text-[11px] text-slate-500">Attached Receipt Document</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center bg-slate-950/5 dark:bg-black/40 min-h-[250px] max-h-[70vh] overflow-auto">
          <img
            src={receiptUrl}
            alt={title}
            className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
