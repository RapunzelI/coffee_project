import { MenuItem, MenuType, MilkOption, Topping } from '@/types/order';

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'ลาเต้', basePrice: 50 },
  { id: 2, name: 'คาปูชิโน่', basePrice: 55 },
  { id: 3, name: 'อเมริกาโน่', basePrice: 45 },
  { id: 4, name: 'มอคค่า', basePrice: 60 },
  { id: 5, name: 'เอสเพรสโซ', basePrice: 40 },
  { id: 6, name: 'ชาเขียว', basePrice: 50 },
];

export const MENU_TYPES: MenuType[] = [
  { value: 'hot', label: 'ร้อน', price: 0 },
  { value: 'iced', label: 'เย็น', price: 0 },
  { value: 'blended', label: 'ปั่น', price: 10 }
];

export const MILK_OPTIONS: MilkOption[] = [
  { value: 'fresh', label: 'นมสด', price: 0 },
  { value: 'oat', label: 'นมโอ๊ต', price: 15 },
  { value: 'almond', label: 'นมอัลมอนด์', price: 15 },
  { value: 'soy', label: 'นมถั่วเหลือง', price: 10 }
];

export const TOPPINGS: Topping[] = [
  { id: 'shot', name: 'เพิ่มช็อต', price: 20 },
  { id: 'whip', name: 'วิปครีม', price: 10 },
  { id: 'pearl', name: 'ไข่มุก', price: 15 },
  { id: 'jelly', name: 'เยลลี่', price: 10 }
];