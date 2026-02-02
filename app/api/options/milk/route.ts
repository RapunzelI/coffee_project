// app/api/options/route.ts
// ตัวอย่าง API สำหรับดึงข้อมูลนมและท็อปปิ้ง พร้อม availability

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ดึงข้อมูลจากฐานข้อมูล (ตัวอย่าง)
    const milkOptions = [
      { value: 'fresh', label: 'นมสด', price: 0, available: true },
      { value: 'oat', label: 'นมโอ๊ตใช่ไหม', price: 20, available: true },
      { value: 'almond', label: 'นมอัลมอนด์', price: 15, available: true },
      { value: 'soy', label: 'นมถั่วเหลือง', price: 10, available: true },
    ];

    const toppings = [
      { id: 'caramel', name: 'เพิ่มคาราเมล', price: 10, available: true },
      { id: 'extrashot', name: 'เพิ่มช็อต', price: 10, available: true },
      { id: 'cream', name: 'วิปครีม', price: 15, available: true },
      { id: 'chocolate', name: 'ช็อกโกแลต', price: 10, available: true },
      { id: 'putdin', name: 'พุตดิ้ง', price: 10, available: true },
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