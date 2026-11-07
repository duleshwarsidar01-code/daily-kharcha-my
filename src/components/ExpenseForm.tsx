import React, { useState, useEffect, useRef } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Expense, PaymentMode } from '../types';
import { toISODateString, padZero } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';
import {
  X,
  Upload,
  Camera,
  Trash2,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
}

const PAYMENT_MODES: PaymentMode[] = [
  'UPI',
  'Cash',
  'Credit Card',
  'Debit Card',
  'Net Banking',
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  editingExpense,
}) => {
  const { categories, currency, addExpense, updateExpense } = useExpense();

  const now = new Date();
  const defaultDate = toISODateString(now);
  const defaultTime = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'groceries');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [note, setNote] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when editingExpense changes or modal opens
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setDate(editingExpense.date);
      setTime(editingExpense.time || defaultTime);
      setCategoryId(editingExpense.categoryId);
      setPaymentMode(editingExpense.paymentMode);
      setNote(editingExpense.note || '');
      setReceiptUrl(editingExpense.receiptUrl);
    } else {
      setTitle('');
      setAmount('');
      setDate(toISODateString(new Date()));
      const d = new Date();
      setTime(`${padZero(d.getHours())}:${padZero(d.getMinutes())}`);
      setCategoryId(categories[0]?.id || 'groceries');
      setPaymentMode('UPI');
      setNote('');
      setReceiptUrl(undefined);
    }
    setError(null);
  }, [editingExpense, isOpen, categories]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError('Receipt image must be under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptUrl(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid expense amount greater than 0');
      return;
    }

    // If title is empty, default to category name
    const selectedCategory = categories.find((c) => c.id === categoryId);
    const finalTitle = title.trim() || selectedCategory?.name || 'Expense';

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        title: finalTitle,
        amount: parsedAmount,
        date,
        time,
        categoryId,
        paymentMode,
        note: note.trim() || undefined,
        receiptUrl,
      });
    } else {
      addExpense({
        title: finalTitle,
        amount: parsedAmount,
        date,
        time,
        categoryId,
        paymentMode,
        note: note.trim() || undefined,
        receiptUrl,
      });
    }

    onClose();
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingExpense ? 'Edit Expense Record' : 'Record New Expense'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter transaction details and receipt
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount Field (Hero numeric input) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Amount ({currency.symbol}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-slate-400">
                {currency.symbol}
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus={!editingExpense}
                className="w-full pl-10 pr-4 py-2.5 text-lg font-bold font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Merchant / Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. DMart Supermarket, Petrol Refill, Swiggy..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Category Selector (Visual Icon Grid or Picker) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                      isSelected
                        ? 'border-indigo-600 bg-white dark:bg-slate-800 shadow-xs'
                        : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <CategoryIcon name={cat.icon} color={cat.color} size={14} />
                    </span>
                    <span
                      className={`truncate text-xs ${
                        isSelected
                          ? 'font-bold text-slate-900 dark:text-slate-100'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date *</span>
                </span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Time</span>
                </span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Payment Mode *</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_MODES.map((mode) => {
                const isSelected = paymentMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note / Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Notes / Description (Optional)</span>
              </span>
            </label>
            <textarea
              rows={2}
              placeholder="Add extra context, item details or invoice number..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-none"
            />
          </div>

          {/* Receipt Image Upload Placeholder & Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Receipt / Bill Photo (Optional)
            </label>

            {receiptUrl ? (
              <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <img
                  src={receiptUrl}
                  alt="Receipt Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    Receipt attached
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Saved with transaction
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptUrl(undefined)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-400 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span>Attach receipt or bill image (Max 3MB)</span>
                </button>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              {editingExpense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
