// data/menu.ts

import { MenuItem, MilkOption, Topping } from '@/types/order';

// ประเภทเมนู (ร้อน/เย็น/ปั่น)
export const MENU_TYPES = [
  { value: 'hot', label: 'ร้อน', price: 0 },
  { value: 'iced', label: 'เย็น', price: 0 },
  { value: 'blended', label: 'ปั่น', price: 10 },
];

// รายการเมนู
export const MENU_ITEMS: MenuItem[] = [
  // เมนูที่ต้องการนม
  { id: 'latte', name: 'ลาเต้', basePrice: 50, available: true, requiresMilk: true },
  { id: 'cappuccino', name: 'คาปูชิโน่', basePrice: 55, available: true, requiresMilk: true },
  { id: 'mocha', name: 'มอคค่า', basePrice: 60, available: true, requiresMilk: true },
  { id: 'caramel-macchiato', name: 'คาราเมลมัคคิอาโต้', basePrice: 65, available: true, requiresMilk: true },
  { id: 'matcha-latte', name: 'มัทฉะลาเต้', basePrice: 65, available: true, requiresMilk: true },
  { id: 'chocolate', name: 'ช็อกโกแลต', basePrice: 55, available: true, requiresMilk: true },
  
  // เมนูที่ไม่ต้องการนม
  { id: 'espresso', name: 'เอสเพรสโซ่', basePrice: 45, available: true, requiresMilk: false },
  { id: 'americano', name: 'อเมริกาโน่', basePrice: 45, available: true, requiresMilk: false },
  { id: 'italian-soda', name: 'อิตาเลียนโซดา', basePrice: 50, available: true, requiresMilk: false },
  { id: 'lemon-tea', name: 'ชามะนาว', basePrice: 45, available: true, requiresMilk: false },
  { id: 'green-tea', name: 'ชาเขียว', basePrice: 40, available: true, requiresMilk: true },
];

// ตัวเลือกนม (เพิ่ม "ไม่ใส่นม" สำหรับเมนูที่ไม่ต้องการนม)
export const MILK_OPTIONS: MilkOption[] = [
  { value: 'none', label: 'ไม่ใส่นม', price: 0, available: true },
  { value: 'fresh', label: 'นมสด', price: 0, available: true },
  { value: 'oat', label: 'นมข้าวโอ๊ต', price: 15, available: true },
  { value: 'almond', label: 'นมอัลมอนด์', price: 15, available: true },
  { value: 'soy', label: 'นมถั่วเหลือง', price: 10, available: true },
];

// ท็อปปิ้ง
export const TOPPINGS: Topping[] = [
  { id: 'pearl', name: 'ไข่มุก', price: 10, available: true },
  { id: 'jelly', name: 'เจลลี่', price: 10, available: true },
  { id: 'pudding', name: 'พุดดิ้ง', price: 15, available: true },
  { id: 'whipped-cream', name: 'วิปปิ้งครีม', price: 15, available: true },
  { id: 'chocolate-chips', name: 'ช็อกโกแลตชิป', price: 10, available: true },
];