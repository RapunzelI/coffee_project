// app/api/options/route.ts
import { NextResponse } from 'next/server';
import { MILK_OPTIONS, TOPPINGS } from '@/data/menu';

// ─── In-memory store สำหรับ availability ของนมและท็อปปิ้ง ───────
const milkAvailability: Record<string, boolean> = {};
const toppingAvailability: Record<string, boolean> = {};

// Initialize: นมและท็อปปิ้งทั้งหมดเปิดให้บริการ default
MILK_OPTIONS.forEach((milk) => {
  milkAvailability[milk.value] = true;
});

TOPPINGS.forEach((topping) => {
  toppingAvailability[topping.id] = true;
});

// ─── GET /api/options ────────────────────────────────────────────
// ดึงข้อมูลนมและท็อปปิ้งทั้งหมดพร้อม availability status
export async function GET() {
  try {
    const milkOptionsWithAvailability = MILK_OPTIONS.map((milk) => ({
      ...milk,
      available: milkAvailability[milk.value] ?? true,
    }));

    const toppingsWithAvailability = TOPPINGS.map((topping) => ({
      ...topping,
      available: toppingAvailability[topping.id] ?? true,
    }));

    return NextResponse.json({
      success: true,
      data: {
        milkOptions: milkOptionsWithAvailability,
        toppings: toppingsWithAvailability,
      },
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/options ──────────────────────────────────────────
// เปิด/ปิดนมหรือท็อปปิ้ง
// body: { type: 'milk' | 'topping', id: string, available: boolean }
export async function PATCH(request: Request) {
  try {
    const { type, id, available } = await request.json();

    if (!type || !id || typeof available !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'กรุณาส่ง type, id และ available' },
        { status: 400 }
      );
    }

    if (type === 'milk') {
      const milkExists = MILK_OPTIONS.some((milk) => milk.value === id);
      if (!milkExists) {
        return NextResponse.json(
          { success: false, error: 'นมนี้ไม่มีในระบบ' },
          { status: 404 }
        );
      }
      milkAvailability[id] = available;
      
      return NextResponse.json({
        success: true,
        data: { type: 'milk', id, available },
      });
      
    } else if (type === 'topping') {
      const toppingExists = TOPPINGS.some((topping) => topping.id === id);
      if (!toppingExists) {
        return NextResponse.json(
          { success: false, error: 'ท็อปปิ้งนี้ไม่มีในระบบ' },
          { status: 404 }
        );
      }
      toppingAvailability[id] = available;
      
      return NextResponse.json({
        success: true,
        data: { type: 'topping', id, available },
      });
      
    } else {
      return NextResponse.json(
        { success: false, error: 'type ต้องเป็น milk หรือ topping' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Failed to update option availability:', error);
    return NextResponse.json(
      { success: false, error: 'อัพเดทไม่สำเร็จ' },
      { status: 500 }
    );
  }
}