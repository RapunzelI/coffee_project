// app/api/options/topping/route.ts
// ตัวอย่าง API สำหรับเปิด/ปิดท็อปปิ้ง

import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, available } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing topping id' },
        { status: 400 }
      );
    }

    // อัพเดทในฐานข้อมูล (ตัวอย่าง)
    // await db.toppings.update({ id }, { available });

    console.log(`Updated topping ${id} to available: ${available}`);

    return NextResponse.json({
      success: true,
      data: { id, available }
    });
  } catch (error) {
    console.error('Error updating topping availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update topping availability' },
      { status: 500 }
    );
  }
}