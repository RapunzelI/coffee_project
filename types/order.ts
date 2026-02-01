// /types/order.ts

export interface Order {
  _id: string;
  id?: string;                    
  orderNumber: string;
  customerText: string;
  paymentMethod: 'promptpay' | 'counter';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  price: number;
  items?: CartItem[];
  createdAt: string;              
  updatedAt: string;              
}

export interface CartItem {
  key: number;
  menuName: string;
  type: string;
  milk: string;
  toppings: string[];
  quantity: number;
  specialNote: string;
  basePrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  available: boolean; // เพิ่มมานี้สำหรับเปิด/ปิดเมนู
}

export interface MenuType {
  value: 'hot' | 'iced' | 'blended';
  label: string;
  price: number;
}

export interface MilkOption {
  value: 'fresh' | 'oat' | 'almond' | 'soy';
  label: string;
  price: number;
  available: boolean; // เพิ่มสำหรับเปิด/ปิดนม
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  available: boolean; // เพิ่มสำหรับเปิด/ปิดท็อปปิ้ง
}