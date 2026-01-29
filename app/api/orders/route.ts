import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

// ไม่ต้อง cache route นี้
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - ดึงข้อมูล orders ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = {};
    if (status) {
      query = { status };
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    // เพิ่ม Cache-Control header
    return NextResponse.json(
      { success: true, data: orders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - สร้าง order ใหม่
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // ⚠️ แนะนำให้ใช้วิธีสร้าง orderNumber ที่ดีกว่า
    const orderCount = await Order.countDocuments();
    const orderNumber = `A${String(orderCount + 1).padStart(3, '0')}`;
    
    const order = await Order.create({
      orderNumber,
      customerText: body.customerText,
      paymentMethod: body.paymentMethod,
      status: 'pending',
      price: body.price || 0,
      items: body.items || [],
    });
    
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}