// utils/storageHelper.ts

import { MilkOption, Topping } from '@/types/order';
import { MILK_OPTIONS, TOPPINGS } from '@/data/menu';

export function getMergedMilkOptions(): MilkOption[] {
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
        // รายการเก่า: ใช้ available จาก localStorage const merge = MILK_OPTIONS.map(newMlik => {const saved = savedMap.get(newMlik.value); if(saves){ return {...newMilk, available}; } return newMilk; });
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
 * บังคับให้ reset localStorage เป็นค่าจาก menu.ts
 * (ใช้เมื่อต้องการล้างข้อมูลเก่าทั้งหมด)
 */
export function resetToDefault() {
  localStorage.setItem('milkOptions', JSON.stringify(MILK_OPTIONS));
  localStorage.setItem('toppings', JSON.stringify(TOPPINGS));
}//localStorage.setItem('milkOptions', JSON.stringify(MILK_OPTIONS));