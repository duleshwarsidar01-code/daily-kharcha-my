import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="no-print fixed bottom-6 right-6 z-40 md:hidden flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
      aria-label="Add new expense"
    >
      <Plus className="w-6 h-6 stroke-[2.5]" />
    </button>
  );
};
