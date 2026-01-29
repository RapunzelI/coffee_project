import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

// GET - ดึง order เดียว
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // ตรวจสอบ ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH - อัพเดทสถานะ order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // ตรวจสอบ ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log('📦 PATCH Request Body:', JSON.stringify(body, null, 2));
    
    // สร้าง update object 
    const updateData: any = {};
    
    if (body.status) {
      updateData.status = body.status;
    }
    
    if (body.price !== undefined) {
      updateData.price = body.price;
    }
    
    if (body.items) {
      // ตรวจสอบว่า items เป็น array และมี structure ถูกต้อง
      if (!Array.isArray(body.items)) {
        return NextResponse.json(
          { success: false, error: 'Items must be an array' },
          { status: 400 }
        );
      }
      
      // Validate แต่ละ item
      const validatedItems = body.items.map((item: any) => ({
        key: Number(item.key),
        menuName: String(item.menuName),
        type: String(item.type),
        milk: String(item.milk),
        toppings: Array.isArray(item.toppings) ? item.toppings : [],
        quantity: Number(item.quantity) || 1,
        specialNote: String(item.specialNote || ''),
        basePrice: Number(item.basePrice)
      }));
      
      updateData.items = validatedItems;
      console.log('✅ Validated Items:', JSON.stringify(validatedItems, null, 2));
    }
    
    console.log('🔄 Updating with:', JSON.stringify(updateData, null, 2));
    
    // อัพเดทโดยใช้ findByIdAndUpdate
    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,           // คืนค่า document ใหม่
        runValidators: true  // เช็ค validation
      }
    );
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Updated Order:', order);
    
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('❌ PATCH /api/orders/[id] error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // ส่ง error message ที่เป็นประโยชน์กลับไป
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}