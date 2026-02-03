'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spin,App } from 'antd';
import OrderStatus from '../../../components/customer/OrderStatus';
import { Order } from '@/types/order';

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp(); 
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูล order
  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrder(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      message.error('ไม่พบออเดอร์นี้');
      // Redirect กลับไปหน้าแรก
      setTimeout(() => router.push('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลครั้งแรก
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Auto-refresh ทุก 5 วินาที เพื่อดูสถานะใหม่
  useEffect(() => {
    if (!order) return;

    // ถ้า order พร้อมรับแล้ว ไม่ต้อง refresh
    const isCompleted = order.status === 'ready' || order.status === 'completed';
    if (isCompleted) {
      return;
    }

    const interval = setInterval(() => {
      fetchOrder();
    }, 5000); // รีเฟรชทุก 5 วินาที

    return () => clearInterval(interval);
  }, [order]);

  const handleNewOrder = () => {
    router.push('/customer_order');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" >
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <p className="text-white">ไม่พบออเดอร์</p>
      </div>
    );
  }

  const isCompleted = order.status === 'ready' || order.status === 'completed';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#C67C4E' }}>
            Coffee Shop
          </h1>
          <p className="text-gray-400">ติดตามสถานะออเดอร์</p>
        </div>

        {/* Order Status Component */}
        <div className="space-y-4 mt-10">
          <OrderStatus order={order} onNewOrder={handleNewOrder} />
        </div>

        {/* Auto-refresh indicator */}
        {!isCompleted && (
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
               อัพเดทอัตโนมัติทุก 5 วินาที
            </p>
          </div>
        )}
      </div>
    </div>
  );
}