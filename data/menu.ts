// data/menu.ts

import { MenuItem, MenuType, MilkOption, Topping } from '@/types/order';

export const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Espresso', basePrice: 45, available: true },
  { id: '2', name: 'Americano', basePrice: 50, available: true },
  { id: '3', name: 'Cappuccino', basePrice: 60, available: true },
  { id: '4', name: 'Latte', basePrice: 65, available: true },
  { id: '5', name: 'Mocha', basePrice: 70, available: true },
  { id: '6', name: 'Caramel Macchiato', basePrice: 75, available: true },
];

export const MENU_TYPES: MenuType[] = [
  { value: 'hot', label: 'ร้อน', price: 0 },
  { value: 'iced', label: 'เย็น', price: 5 },
  { value: 'blended', label: 'ปั่น', price: 10 },
];

export const MILK_OPTIONS: MilkOption[] = [
  { value: 'fresh', label: 'นมสด', price: 0, available: true },
  { value: 'oat', label: 'นมโอ๊ต', price: 10, available: true },
  { value: 'almond', label: 'นมอัลมอนด์', price: 15, available: true },
  { value: 'soy', label: 'นมถั่วเหลือง', price: 10, available: true },
];

export const TOPPINGS: Topping[] = [
  { id: 'pearl', name: 'ไข่มุก', price: 10, available: true },
  { id: 'jelly', name: 'เจลลี่', price: 10, available: true },
  { id: 'cream', name: 'วิปครีม', price: 15, available: true },
  { id: 'chocolate', name: 'ช็อกโกแลต', price: 10, available: true },
];