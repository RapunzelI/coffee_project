'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, App } from 'antd';
import OrderForm from '../../components/customer/OrderFrom';
import Image from 'next/image';

export default function OrderPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [orderText, setOrderText] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'counter'>('promptpay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!orderText.trim()) {
      message.warning('กรุณากรอกรายละเอียดออเดอร์');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerText: orderText,
          paymentMethod: paymentMethod,
          price: 0,
          items: [],
        }),
      });

      const result = await response.json();

      if (result.success) {
        message.success('ส่งออเดอร์สำเร็จ!');
        router.push(`/order/${result.data._id}`);
      } else {
        throw new Error(result.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
      message.error('ส่งออเดอร์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>

      <div className="relative max-w-2xl mx-auto p-6 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#C67C4E' }}>
            Coffee Shop
          </h1>
          <p className="text-gray-400">สั่งกาแฟสดใหม่ทุกวัน</p>
        </div>
        <div>
          <Card
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: '#404040',
              borderRadius: '12px',
            }}
            className="shadow-lg"
          >
            <OrderForm
              orderText={orderText}
              paymentMethod={paymentMethod}
              onOrderTextChange={setOrderText}
              onPaymentMethodChange={setPaymentMethod}
              onSubmit={handleSubmit}
            />
          </Card>
        </div>

        {isSubmitting && (
          <div className="text-center mt-4">
            <p className="text-gray-400">กำลังส่งออเดอร์...</p>
          </div>
        )}
      </div>
    </div>
  );
}