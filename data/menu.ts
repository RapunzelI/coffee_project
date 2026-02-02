// data/menu.ts

import { MenuItem, MenuType, MilkOption, Topping } from '@/types/order';

export const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'เอสเปรสโซ่', basePrice: 45, available: true },
  { id: '2', name: 'อเมริกาโน่', basePrice: 50, available: true },
  { id: '3', name: 'คาปูชิโน่', basePrice: 60, available: true },
  { id: '4', name: 'ลาเต้', basePrice: 65, available: true },
  { id: '5', name: 'มอคค่า', basePrice: 50, available: true },
  { id: '6', name: 'ชาเขียว', basePrice: 50, available: true },
  { id: '7', name: 'ชาไทย', basePrice: 50, available: true },
  { id: '8', name: 'โกโก้', basePrice: 50, available: true },
  { id: '9', name: 'นมสด', basePrice: 50, available: true },
  { id: '10', name: 'ช็อกโกแลต', basePrice: 50, available: true },
  { id: '11', name: 'อิตาเลียนโซดา', basePrice: 55, available: true },
];

export const MENU_TYPES: MenuType[] = [
  { value: 'hot', label: 'ร้อน', price: 5 },
  { value: 'iced', label: 'เย็น', price: 0 },
  { value: 'blended', label: 'ปั่น', price: 10 },
];

export const MILK_OPTIONS: MilkOption[] = [
  { value: 'fresh', label: 'นมสด', price: 0, available: true },
  { value: 'oat', label: 'นมโอ๊ต', price: 10, available: true },
  { value: 'almond', label: 'นมอัลมอนด์', price: 15, available: true },
  { value: 'soy', label: 'นมถั่วเหลือง', price: 10, available: true },
  { value: 'coconut', label: 'นมมะพร้าว', price: 12, available: true },
  { value: 'lowfat', label: 'นมไขมันต่ำ', price: 5, available: true },
];

export const TOPPINGS: Topping[] = [
  
  { id: 'pearl', name: 'ไข่มุก', price: 10, available: true },
  { id: 'jelly', name: 'เจลลี่', price: 10, available: true },
  { id: 'cream', name: 'วิปครีม', price: 15, available: true },
  { id: 'chocolate', name: 'ช็อกโกแลต', price: 10, available: true },
  { id: 'caramel', name: 'คาราเมล', price: 8, available: true },
  { id: 'oreo', name: 'โอรีโอ้', price: 15, available: true },
  { id: 'cheese_foam', name: 'ครีมชีส', price: 20, available: true },
];