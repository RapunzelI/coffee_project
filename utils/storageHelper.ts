// utils/storageHelper.ts

import { MilkOption, Topping, MenuItem } from '@/types/order';
import { MILK_OPTIONS, TOPPINGS, MENU_ITEMS } from '@/data/menu';

/**
 * ตรวจสอบว่าอยู่ฝั่ง client หรือไม่
 */
const isClient = typeof window !== 'undefined';

/**
 * Merge ข้อมูลจาก localStorage กับข้อมูลใหม่จาก menu.ts
 * - รายการเก่าที่มีใน localStorage: ใช้ค่า available จาก localStorage
 * - รายการใหม่ที่ไม่มีใน localStorage: ใช้ค่าจาก menu.ts
 */

export function getMergedMilkOptions(): MilkOption[] {
  if (!isClient) {
    // ถ้าอยู่ฝั่ง server ให้คืนค่าจาก menu.ts
    return MILK_OPTIONS;
  }

  const savedMilk = localStorage.getItem('milkOptions');
  
  if (!savedMilk) {
    // ครั้งแรก: ใช้ข้อมูลจาก menu.ts
    localStorage.setItem('milkOptions', JSON.stringify(MILK_OPTIONS));
    return MILK_OPTIONS;
  }
  
  try {
    const savedData: MilkOption[] = JSON.parse(savedMilk);
    const savedMap = new Map(savedData.map(m => [m.value, m]));
    
    // Merge: รายการใหม่ + รายการเก่า
    const merged = MILK_OPTIONS.map(newMilk => {
      const saved = savedMap.get(newMilk.value);
      if (saved) {
        // รายการเก่า: ใช้ available จาก localStorage
        return { ...newMilk, available: saved.available };
      }
      // รายการใหม่: ใช้ค่าจาก menu.ts
      return newMilk;
    });
    
    // บันทึกกลับ localStorage
    localStorage.setItem('milkOptions', JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error('Error parsing milkOptions:', error);
    localStorage.setItem('milkOptions', JSON.stringify(MILK_OPTIONS));
    return MILK_OPTIONS;
  }
}

export function getMergedToppings(): Topping[] {
  if (!isClient) {
    // ถ้าอยู่ฝั่ง server ให้คืนค่าจาก menu.ts
    return TOPPINGS;
  }

  const savedToppings = localStorage.getItem('toppings');
  
  if (!savedToppings) {
    // ครั้งแรก: ใช้ข้อมูลจาก menu.ts
    localStorage.setItem('toppings', JSON.stringify(TOPPINGS));
    return TOPPINGS;
  }
  
  try {
    const savedData: Topping[] = JSON.parse(savedToppings);
    const savedMap = new Map(savedData.map(t => [t.id, t]));
    
    // Merge: รายการใหม่ + รายการเก่า
    const merged = TOPPINGS.map(newTopping => {
      const saved = savedMap.get(newTopping.id);
      if (saved) {
        // รายการเก่า: ใช้ available จาก localStorage
        return { ...newTopping, available: saved.available };
      }
      // รายการใหม่: ใช้ค่าจาก menu.ts
      return newTopping;
    });
    
    // บันทึกกลับ localStorage
    localStorage.setItem('toppings', JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error('Error parsing toppings:', error);
    localStorage.setItem('toppings', JSON.stringify(TOPPINGS));
    return TOPPINGS;
  }
}

/**
 * Merge เมนูจาก menu.ts กับ localStorage
 * รองรับ property requiresMilk
 */
export function getMergedMenuItems(): MenuItem[] {
  if (!isClient) {
    // ถ้าอยู่ฝั่ง server ให้คืนค่าจาก menu.ts
    return MENU_ITEMS;
  }

  const savedMenuItems = localStorage.getItem('menuItems');
  
  if (!savedMenuItems) {
    // ครั้งแรก: ใช้ข้อมูลจาก menu.ts
    localStorage.setItem('menuItems', JSON.stringify(MENU_ITEMS));
    return MENU_ITEMS;
  }
  
  try {
    const savedData: MenuItem[] = JSON.parse(savedMenuItems);
    const savedMap = new Map(savedData.map(m => [m.id, m]));
    
    // Merge: รายการใหม่ + รายการเก่า
    const merged = MENU_ITEMS.map(newMenu => {
      const saved = savedMap.get(newMenu.id);
      if (saved) {
        // รายการเก่า: ใช้ available จาก localStorage แต่เก็บ requiresMilk จาก menu.ts
        return { 
          ...newMenu, 
          available: saved.available,
          requiresMilk: newMenu.requiresMilk // ใช้ค่าจาก menu.ts เสมอ
        };
      }
      // รายการใหม่: ใช้ค่าจาก menu.ts
      return newMenu;
    });
    
    // บันทึกกลับ localStorage
    localStorage.setItem('menuItems', JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error('Error parsing menuItems:', error);
    localStorage.setItem('menuItems', JSON.stringify(MENU_ITEMS));
    return MENU_ITEMS;
  }
}

/**
 * บังคับให้ reset localStorage เป็นค่าจาก menu.ts
 * (ใช้เมื่อต้องการล้างข้อมูลเก่าทั้งหมด)
 */
export function resetToDefault() {
  if (!isClient) return;
  
  localStorage.setItem('milkOptions', JSON.stringify(MILK_OPTIONS));
  localStorage.setItem('toppings', JSON.stringify(TOPPINGS));
  localStorage.setItem('menuItems', JSON.stringify(MENU_ITEMS));
}