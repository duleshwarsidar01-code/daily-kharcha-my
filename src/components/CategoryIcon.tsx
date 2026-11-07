import React from 'react';
import {
  ShoppingCart,
  Milk,
  Fuel,
  ReceiptText,
  Utensils,
  HeartPulse,
  Sparkles,
  Car,
  Tv,
  Coins,
  BookOpen,
  Plane,
  Home,
  GraduationCap,
  Dumbbell,
  Gift,
  Smartphone,
  Wifi,
  Camera,
  Briefcase,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  ShoppingCart,
  Milk,
  Fuel,
  ReceiptText,
  Utensils,
  HeartPulse,
  Sparkles,
  Car,
  Tv,
  Coins,
  BookOpen,
  Plane,
  Home,
  GraduationCap,
  Dumbbell,
  Gift,
  Smartphone,
  Wifi,
  Camera,
  Briefcase,
};

interface CategoryIconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = 'w-5 h-5',
  color,
  size = 20,
}) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} style={color ? { color } : undefined} size={size} />;
};
