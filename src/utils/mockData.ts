import { Expense } from '../types';
import { toISODateString } from './dateUtils';

export const getInitialSeedExpenses = (): Expense[] => {
  const now = new Date();

  // Helper to get date N days offset from today
  const getDateOffset = (daysAgo: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return toISODateString(d);
  };

  // Helper to get specific month date in current year
  const getSpecificDate = (monthIndex: number, day: number): string => {
    const d = new Date(now.getFullYear(), monthIndex, day);
    return toISODateString(d);
  };

  const seed: Expense[] = [
    // Today
    {
      id: 'exp-today-1',
      title: 'Country Delight Milk & Curd',
      amount: 145,
      date: getDateOffset(0),
      time: '07:30',
      categoryId: 'milk_dairy',
      paymentMode: 'UPI',
      note: 'Fresh cow milk 1L and artisanal curd 400g delivery',
      createdAt: Date.now() - 3600000 * 3,
      updatedAt: Date.now() - 3600000 * 3,
    },
    {
      id: 'exp-today-2',
      title: 'Chai & Snacks with colleagues',
      amount: 180,
      date: getDateOffset(0),
      time: '11:15',
      categoryId: 'food_dining',
      paymentMode: 'UPI',
      note: 'Ginger tea and samosas at local cafe',
      createdAt: Date.now() - 3600000 * 2,
      updatedAt: Date.now() - 3600000 * 2,
    },
    {
      id: 'exp-today-3',
      title: 'Metro Smart Card Recharge',
      amount: 500,
      date: getDateOffset(0),
      time: '13:00',
      categoryId: 'transport',
      paymentMode: 'UPI',
      note: 'Auto top-up via Paytm Metro Gate',
      createdAt: Date.now() - 3600000 * 1,
      updatedAt: Date.now() - 3600000 * 1,
    },

    // Yesterday
    {
      id: 'exp-yest-1',
      title: 'Indian Oil Petrol Refuel',
      amount: 1200,
      date: getDateOffset(1),
      time: '08:45',
      categoryId: 'fuel',
      paymentMode: 'Credit Card',
      note: '11.4 Litres petrol for scooter and city commute',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
    },
    {
      id: 'exp-yest-2',
      title: 'Blinkit Instant Groceries',
      amount: 685,
      date: getDateOffset(1),
      time: '19:20',
      categoryId: 'groceries',
      paymentMode: 'UPI',
      note: 'Tomatoes, onions, coriander, cooking oil & bread',
      createdAt: Date.now() - 86400000 + 3600000,
      updatedAt: Date.now() - 86400000 + 3600000,
    },
    {
      id: 'exp-yest-3',
      title: 'Apollo Pharmacy Medicines',
      amount: 420,
      date: getDateOffset(1),
      time: '20:40',
      categoryId: 'healthcare',
      paymentMode: 'Debit Card',
      note: 'Multivitamins, Paracetamol and pain relief spray',
      createdAt: Date.now() - 86400000 + 7200000,
      updatedAt: Date.now() - 86400000 + 7200000,
    },

    // 3 Days Ago
    {
      id: 'exp-3days-1',
      title: 'Tata Power Electricity Bill',
      amount: 2450,
      date: getDateOffset(3),
      time: '10:00',
      categoryId: 'utilities',
      paymentMode: 'Net Banking',
      note: 'Monthly consumer electricity bill payment',
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'exp-3days-2',
      title: 'Zomato Gourmet Dinner',
      amount: 890,
      date: getDateOffset(3),
      time: '21:15',
      categoryId: 'food_dining',
      paymentMode: 'UPI',
      note: 'Paneer Butter Masala, garlic naans and biryani',
      createdAt: Date.now() - 86400000 * 3 + 1000000,
      updatedAt: Date.now() - 86400000 * 3 + 1000000,
    },

    // 5 Days Ago
    {
      id: 'exp-5days-1',
      title: 'Airtel Xstream Fiber Broadband',
      amount: 1179,
      date: getDateOffset(5),
      time: '14:20',
      categoryId: 'utilities',
      paymentMode: 'Credit Card',
      note: 'Monthly 200 Mbps unlimited fiber connection',
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now() - 86400000 * 5,
    },
    {
      id: 'exp-5days-2',
      title: 'PVR Cinema Movie Tickets & Popcorn',
      amount: 940,
      date: getDateOffset(5),
      time: '18:30',
      categoryId: 'entertainment',
      paymentMode: 'Credit Card',
      note: 'Weekend evening show 2 tickets',
      createdAt: Date.now() - 86400000 * 5 + 4000000,
      updatedAt: Date.now() - 86400000 * 5 + 4000000,
    },

    // 8 Days Ago
    {
      id: 'exp-8days-1',
      title: 'DMart Supermarket Monthly Restock',
      amount: 4350,
      date: getDateOffset(8),
      time: '16:00',
      categoryId: 'groceries',
      paymentMode: 'UPI',
      note: 'Basmati rice 10kg, atta, pulses, spices, cleaning detergents',
      createdAt: Date.now() - 86400000 * 8,
      updatedAt: Date.now() - 86400000 * 8,
    },
    {
      id: 'exp-8days-2',
      title: 'Uber Cab to Client Office',
      amount: 380,
      date: getDateOffset(8),
      time: '09:10',
      categoryId: 'transport',
      paymentMode: 'UPI',
      note: 'Peak hour ride across business park',
      createdAt: Date.now() - 86400000 * 8 - 1000000,
      updatedAt: Date.now() - 86400000 * 8 - 1000000,
    },

    // 12 Days Ago
    {
      id: 'exp-12days-1',
      title: 'Westside Apparel & Shoes',
      amount: 2890,
      date: getDateOffset(12),
      time: '17:45',
      categoryId: 'shopping',
      paymentMode: 'Credit Card',
      note: 'Cotton casual shirts and footwear',
      createdAt: Date.now() - 86400000 * 12,
      updatedAt: Date.now() - 86400000 * 12,
    },
    {
      id: 'exp-12days-2',
      title: 'House Plumbing Tap Replacement',
      amount: 650,
      date: getDateOffset(12),
      time: '12:00',
      categoryId: 'miscellaneous',
      paymentMode: 'Cash',
      note: 'Kitchen brass tap fixture and plumber service fee',
      createdAt: Date.now() - 86400000 * 12 + 3000000,
      updatedAt: Date.now() - 86400000 * 12 + 3000000,
    },

    // 16 Days Ago
    {
      id: 'exp-16days-1',
      title: 'HPCL Petrol Fuel Tank',
      amount: 1500,
      date: getDateOffset(16),
      time: '11:30',
      categoryId: 'fuel',
      paymentMode: 'Credit Card',
      note: 'Full tank fuel for weekend highway drive',
      createdAt: Date.now() - 86400000 * 16,
      updatedAt: Date.now() - 86400000 * 16,
    },
    {
      id: 'exp-16days-2',
      title: 'Dental Checkup & Cleaning',
      amount: 1500,
      date: getDateOffset(16),
      time: '15:15',
      categoryId: 'healthcare',
      paymentMode: 'UPI',
      note: 'Routine dental scaling and consultation',
      createdAt: Date.now() - 86400000 * 16 + 2000000,
      updatedAt: Date.now() - 86400000 * 16 + 2000000,
    },

    // 22 Days Ago
    {
      id: 'exp-22days-1',
      title: 'Netflix & Spotify Premium Family',
      amount: 949,
      date: getDateOffset(22),
      time: '04:00',
      categoryId: 'entertainment',
      paymentMode: 'Credit Card',
      note: 'Auto-debit recurring subscription renewal',
      createdAt: Date.now() - 86400000 * 22,
      updatedAt: Date.now() - 86400000 * 22,
    },
    {
      id: 'exp-22days-2',
      title: 'Amul Dairy Booth',
      amount: 320,
      date: getDateOffset(22),
      time: '08:10',
      categoryId: 'milk_dairy',
      paymentMode: 'Cash',
      note: 'Paneer 500g and table butter slab',
      createdAt: Date.now() - 86400000 * 22 + 4000000,
      updatedAt: Date.now() - 86400000 * 22 + 4000000,
    },

    // 28 Days Ago (Last month items)
    {
      id: 'exp-28days-1',
      title: 'Indane Cooking Gas LPG Cylinder',
      amount: 850,
      date: getDateOffset(28),
      time: '12:45',
      categoryId: 'utilities',
      paymentMode: 'UPI',
      note: 'Refill booking 14.2kg domestic cylinder',
      createdAt: Date.now() - 86400000 * 28,
      updatedAt: Date.now() - 86400000 * 28,
    },
    {
      id: 'exp-28days-2',
      title: 'Nature Basket Organic Provisions',
      amount: 1820,
      date: getDateOffset(28),
      time: '17:30',
      categoryId: 'groceries',
      paymentMode: 'Credit Card',
      note: 'Cold-pressed oils, almond butter & organic honey',
      createdAt: Date.now() - 86400000 * 28 + 2000000,
      updatedAt: Date.now() - 86400000 * 28 + 2000000,
    },

    // Additional historical entries spread across earlier quarters in the year
    {
      id: 'exp-q1-1',
      title: 'Q1 Annual Car Insurance Renewal',
      amount: 7200,
      date: getSpecificDate(1, 15), // Feb 15
      time: '11:00',
      categoryId: 'transport',
      paymentMode: 'Net Banking',
      note: 'Comprehensive zero-dep vehicle policy',
      createdAt: Date.now() - 86400000 * 180,
      updatedAt: Date.now() - 86400000 * 180,
    },
    {
      id: 'exp-q1-2',
      title: 'Q1 Electronic Appliance Repair',
      amount: 1400,
      date: getSpecificDate(2, 10), // March 10
      time: '16:00',
      categoryId: 'miscellaneous',
      paymentMode: 'UPI',
      note: 'Microwave oven magnetron servicing',
      createdAt: Date.now() - 86400000 * 150,
      updatedAt: Date.now() - 86400000 * 150,
    },
    {
      id: 'exp-q2-1',
      title: 'Q2 Summer AC Servicing & Gas Charge',
      amount: 2200,
      date: getSpecificDate(4, 8), // May 8
      time: '14:30',
      categoryId: 'utilities',
      paymentMode: 'UPI',
      note: 'Dual split AC deep cleaning and gas top-up',
      createdAt: Date.now() - 86400000 * 100,
      updatedAt: Date.now() - 86400000 * 100,
    },
    {
      id: 'exp-q2-2',
      title: 'Q2 Fastrack Sunglasses & Grooming',
      amount: 1950,
      date: getSpecificDate(5, 20), // June 20
      time: '19:00',
      categoryId: 'shopping',
      paymentMode: 'Credit Card',
      note: 'Polarized sunglasses & salon package',
      createdAt: Date.now() - 86400000 * 70,
      updatedAt: Date.now() - 86400000 * 70,
    },
    {
      id: 'exp-q3-1',
      title: 'Q3 Monsoon Vehicle Tires & Alignment',
      amount: 5600,
      date: getSpecificDate(7, 12), // August 12
      time: '10:30',
      categoryId: 'fuel',
      paymentMode: 'Debit Card',
      note: 'Front tubeless tires replacement and wheel balance',
      createdAt: Date.now() - 86400000 * 40,
      updatedAt: Date.now() - 86400000 * 40,
    },
    {
      id: 'exp-q3-2',
      title: 'Q3 Family Celebration Dinner Buffet',
      amount: 3400,
      date: getSpecificDate(8, 25), // Sep 25
      time: '20:30',
      categoryId: 'food_dining',
      paymentMode: 'Credit Card',
      note: 'Barbeque Nation buffet 4 pax',
      createdAt: Date.now() - 86400000 * 25,
      updatedAt: Date.now() - 86400000 * 25,
    },
  ];

  return seed;
};
