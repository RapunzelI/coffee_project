// app/api/options/route.ts
// ตัวอย่าง API สำหรับดึงข้อมูลนมและท็อปปิ้ง พร้อม availability

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล (ตัวอย่าง)
    const milkOptions = [
      { value: 'fresh', label: 'นมสด', price: 0, available: true },
      { value: 'oat', label: 'นมโอ๊ต', price: 10, available: true },
      { value: 'almond', label: 'นมอัลมอนด์', price: 15, available: true },
      { value: 'soy', label: 'นมถั่วเหลือง', price: 10, available: true },
    ];

    const toppings = [
      { id: 'pearl', name: 'ไข่มุก', price: 10, available: true },
      { id: 'jelly', name: 'เจลลี่', price: 10, available: true },
      { id: 'cream', name: 'วิปครีม', price: 15, available: true },
      { id: 'chocolate', name: 'ช็อกโกแลต', price: 10, available: true },
    ];

    return NextResponse.json({
      success: true,
      data: {
        milkOptions,
        toppings
      }
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}