import { Category } from '../types';

export const PREDEFINED_CATEGORIES: Category[] = [
  {
    id: 'groceries',
    name: 'Groceries & Supermarket',
    icon: 'ShoppingCart',
    color: '#059669', // Emerald 600
    bgLight: 'rgba(5, 150, 105, 0.12)',
    isDefault: true,
    description: 'Provisions, vegetables, fruits, daily staples',
  },
  {
    id: 'milk_dairy',
    name: 'Milk & Dairy',
    icon: 'Milk',
    color: '#0284c7', // Sky 600
    bgLight: 'rgba(2, 132, 199, 0.12)',
    isDefault: true,
    description: 'Milk subscriptions, curd, butter, paneer',
  },
  {
    id: 'fuel',
    name: 'Fuel (Petrol / Diesel / EV Charging)',
    icon: 'Fuel',
    color: '#d97706', // Amber 600
    bgLight: 'rgba(217, 119, 6, 0.12)',
    isDefault: true,
    description: 'Vehicle refuels, charging stations, tolls',
  },
  {
    id: 'utilities',
    name: 'Utility Bills (Electricity, Mobile, Gas, Internet)',
    icon: 'ReceiptText',
    color: '#7c3aed', // Violet 600
    bgLight: 'rgba(124, 58, 237, 0.12)',
    isDefault: true,
    description: 'Electricity, mobile recharges, water, broadband, piped gas',
  },
  {
    id: 'food_dining',
    name: 'Food & Dining / Snacks',
    icon: 'Utensils',
    color: '#e11d48', // Rose 600
    bgLight: 'rgba(225, 29, 72, 0.12)',
    isDefault: true,
    description: 'Restaurants, cafes, food delivery (Swiggy/Zomato), tea/snacks',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    icon: 'HeartPulse',
    color: '#dc2626', // Red 600
    bgLight: 'rgba(220, 38, 38, 0.12)',
    isDefault: true,
    description: 'Doctor visits, pharmacy medicines, diagnostic tests',
  },
  {
    id: 'shopping',
    name: 'Shopping & Personal Care',
    icon: 'Sparkles',
    color: '#4f46e5', // Indigo 600
    bgLight: 'rgba(79, 70, 229, 0.12)',
    isDefault: true,
    description: 'Clothing, grooming, personal care, footwear',
  },
  {
    id: 'transport',
    name: 'Transport & Commute',
    icon: 'Car',
    color: '#2563eb', // Blue 600
    bgLight: 'rgba(37, 99, 235, 0.12)',
    isDefault: true,
    description: 'Metro, cab (Uber/Ola), auto, bus, parking charges',
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Subscriptions',
    icon: 'Tv',
    color: '#c026d3', // Fuchsia 600
    bgLight: 'rgba(192, 38, 211, 0.12)',
    isDefault: true,
    description: 'Movies, streaming apps (Netflix, Prime), outings, hobbies',
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous / Other Expenses',
    icon: 'Coins',
    color: '#475569', // Slate 600
    bgLight: 'rgba(71, 85, 105, 0.12)',
    isDefault: true,
    description: 'One-off repairs, small cash tips, unexpected expenses',
  },
];

export const AVAILABLE_ICONS = [
  'ShoppingCart',
  'Milk',
  'Fuel',
  'ReceiptText',
  'Utensils',
  'HeartPulse',
  'Sparkles',
  'Car',
  'Tv',
  'Coins',
  'BookOpen',
  'Plane',
  'Home',
  'GraduationCap',
  'Dumbbell',
  'Gift',
  'Smartphone',
  'Wifi',
  'Camera',
  'Briefcase',
];

export const AVAILABLE_COLORS = [
  '#059669', // Emerald
  '#0284c7', // Sky
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#e11d48', // Rose
  '#dc2626', // Red
  '#4f46e5', // Indigo
  '#2563eb', // Blue
  '#c026d3', // Fuchsia
  '#475569', // Slate
  '#0d9488', // Teal
  '#ea580c', // Orange
];
