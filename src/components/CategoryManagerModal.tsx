import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Category } from '../types';
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from '../utils/categories';
import { CategoryIcon } from './CategoryIcon';
import { X, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useExpense();
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(AVAILABLE_ICONS[0]);
  const [color, setColor] = useState(AVAILABLE_COLORS[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const startEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setDescription(cat.description || '');
    setIsAdding(false);
    setError(null);
  };

  const startCreate = () => {
    setIsAdding(true);
    setEditingCatId(null);
    setName('');
    setIcon(AVAILABLE_ICONS[0]);
    setColor(AVAILABLE_COLORS[0]);
    setDescription('');
    setError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    if (editingCatId) {
      updateCategory(editingCatId, {
        name: name.trim(),
        icon,
        color,
        description: description.trim() || undefined,
      });
      setEditingCatId(null);
    } else {
      addCategory({
        name: name.trim(),
        icon,
        color,
        bgLight: `${color}18`,
        description: description.trim() || undefined,
      });
      setIsAdding(false);
    }

    setName('');
    setDescription('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Manage Spending Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize categories, icons, and colors
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Create or Edit Form */}
          {(isAdding || editingCatId) && (
            <form
              onSubmit={handleSave}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {editingCatId ? 'Edit Category' : 'Create Custom Category'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingCatId(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gym & Fitness, Pet Care, Books..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Icon selector */}
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Select Icon
                </label>
                <div className="flex items-center gap-1.5 flex-wrap max-h-24 overflow-y-auto p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  {AVAILABLE_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        icon === ic ? 'bg-slate-200 dark:bg-slate-700' : ''
                      }`}
                    >
                      <CategoryIcon name={ic} size={15} color={color} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Select Accent Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90 cursor-pointer"
                >
                  {editingCatId ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          )}

          {/* Add New Category Trigger */}
          {!isAdding && !editingCatId && (
            <button
              onClick={startCreate}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Category</span>
            </button>
          )}

          {/* Category List */}
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between py-2 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <CategoryIcon name={cat.icon} color={cat.color} size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {cat.name}
                    </span>
                    {cat.description && (
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate block font-medium">
                        {cat.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {!cat.isDefault && (
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
