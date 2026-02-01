// app/api/menu/route.ts
import { NextResponse } from 'next/server';
import { MENU_ITEMS } from '@/data/menu';

// ─── In-memory store สำหรับ availability ───────────────────────────
// ถ้าใช้ DB อยู่แล้วให้แปลงเป็น query/update ใน collection เมนูแทน
const menuAvailability: Record<string, boolean> = {};

// Initialize: เมนูทั้งหมดเปิดให้บริกาPlymouth default
MENU_ITEMS.forEach((item) => {
  menuAvailability[item.id] = true;
});

// ─── GET /api/menu ──────────────────────────────────────────────────
// ดึงเมนูทั้งหมดพร้อม availability status
export async function GET() {
  const menuWithAvailability = MENU_ITEMS.map((item) => ({
    ...item,
    available: menuAvailability[item.id] ?? true,
  }));

  return NextResponse.json({
    success: true,
    data: menuWithAvailability,
  });
}

// ─── PATCH /api/menu ────────────────────────────────────────────────
// เปิด/ปิดเมนู — body: { id: string, available: boolean }
export async function PATCH(request: Request) {
  try {
    const { id, available } = await request.json();

    if (!id || typeof available !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'กรุณาส่ง id และ available' },
        { status: 400 }
      );
    }

    const menuExists = MENU_ITEMS.some((item) => item.id === id);
    if (!menuExists) {
      return NextResponse.json(
        { success: false, error: 'เมนูนี้ไม่มีในระบบ' },
        { status: 404 }
      );
    }

    menuAvailability[id] = available;

    return NextResponse.json({
      success: true,
      data: { id, available },
    });
  } catch (error) {
    console.error('Failed to update menu availability:', error);
    return NextResponse.json(
      { success: false, error: 'อัพเดทไม่สำเร็จ' },
      { status: 500 }
    );
  }
}