'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, App, Carousel } from 'antd';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import OrderForm from '../../components/customer/OrderFrom';
import { MenuItem, MilkOption, Topping } from '@/types/order';

export default function OrderPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [orderText, setOrderText] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'counter'>('promptpay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [milkOptions, setMilkOptions] = useState<MilkOption[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // Promotion images
  const promotionImages = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop',
      title: 'ซื้อ 1 แถม 1',
      description: 'เมนูกาแฟทุกชนิด'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
      title: 'ส่วนลด 20%',
      description: 'สำหรับสมาชิกใหม่'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=400&fit=crop',
      title: 'Happy Hour',
      description: 'ลด 50% เวลา 14:00-16:00 น.'
    }
  ];

  // ดึงข้อมูลเมนู, นม, ท็อปปิ้ง
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // ดึงเมนู
      const menuResponse = await fetch('/api/menu');
      const menuResult = await menuResponse.json();
      if (menuResult.success) {
        setMenuItems(menuResult.data);
      }

      // ดึงนมและท็อปปิ้ง
      const optionsResponse = await fetch('/api/options');
      const optionsResult = await optionsResponse.json();
      if (optionsResult.success) {
        setMilkOptions(optionsResult.data.milkOptions);
        setToppings(optionsResult.data.toppings);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!orderText.trim()) {
      message.warning('กรุณากรอกรายละเอียดออเดอร์');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const availableMenus = menuItems.filter((m) => m.available);
  const unavailableMenus = menuItems.filter((m) => !m.available);
  const availableMilk = milkOptions.filter((m) => m.available);
  const unavailableMilk = milkOptions.filter((m) => !m.available);
  const availableToppings = toppings.filter((t) => t.available);
  const unavailableToppings = toppings.filter((t) => !t.available);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="relative max-w-2xl mx-auto p-6 z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#C67C4E' }}>
            Coffee Shop
          </h1>
          <p className="text-gray-400">สั่งกาแฟสดใหม่ทุกวัน</p>
        </div>

        {/* ─── Promotion Carousel ─── */}
        <div className="mb-6">
          <Carousel 
            autoplay 
            autoplaySpeed={3000}
            dots={{ className: 'custom-dots' }}
            effect="fade"
          >
            {promotionImages.map((promo) => (
              <div key={promo.id}>
                <div
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    height: '180px',
                    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${promo.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {promo.title}
                    </h3>
                    <p className="text-white text-sm opacity-90">
                      {promo.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* ─── Row: รายการหมด + ปุ่มเมนูทั้งหมด ─── */}
        <div className="flex items-start justify-between mb-3 gap-3">
          {/* ซ้าย — รายการที่หมด */}
          <div className="flex flex-wrap gap-2 flex-1">
            {!loading && (
              <>
                {/* เมนูที่หมด */}
                {unavailableMenus.map((item) => (
                  <div
                    key={`menu-${item.id}`}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: '#555', textDecoration: 'line-through' }}
                    >
                      {item.name}
                    </span>
                    <span
                      className="px-1.5 rounded"
                      style={{
                        fontSize: '9px',
                        lineHeight: '16px',
                        backgroundColor: '#2a1a1a',
                        color: '#a55',
                        border: '1px solid #3a2020',
                      }}
                    >
                      หมด
                    </span>
                  </div>
                ))}

                {/* นมที่หมด */}
                {unavailableMilk.map((milk) => (
                  <div
                    key={`milk-${milk.value}`}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: '#555', textDecoration: 'line-through' }}
                    >
                      {milk.label}
                    </span>
                    <span
                      className="px-1.5 rounded"
                      style={{
                        fontSize: '9px',
                        lineHeight: '16px',
                        backgroundColor: '#2a1a1a',
                        color: '#a55',
                        border: '1px solid #3a2020',
                      }}
                    >
                      หมด
                    </span>
                  </div>
                ))}

                {/* ท็อปปิ้งที่หมด */}
                {unavailableToppings.map((topping) => (
                  <div
                    key={`topping-${topping.id}`}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: '#555', textDecoration: 'line-through' }}
                    >
                      {topping.name}
                    </span>
                    <span
                      className="px-1.5 rounded"
                      style={{
                        fontSize: '9px',
                        lineHeight: '16px',
                        backgroundColor: '#2a1a1a',
                        color: '#a55',
                        border: '1px solid #3a2020',
                      }}
                    >
                      หมด
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* ขวา — ☰ เมนูทั้งหมด */}
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors"
            style={{
              backgroundColor: showMenu ? '#C67C4E20' : '#1a1a1a',
              border: showMenu ? '1px solid #C67C4E40' : '1px solid #2a2a2a',
              color: showMenu ? '#C67C4E' : '#aaa',
            }}
          >
            {showMenu ? (
              <XMarkIcon className="w-4 h-4" />
            ) : (
              <Bars3Icon className="w-4 h-4" />
            )}
            <span className="text-xs font-semibold">เมนูทั้งหมด</span>
          </button>
        </div>

        {/* ─── Hamburger panel — เมนู + นม + ท็อปปิ้ง ─── */}
        {showMenu && (
          <div
            className="rounded-xl mb-4 overflow-hidden"
            style={{ border: '1px solid #2a2a2a', backgroundColor: '#141414' }}
          >
            {loading ? (
              <div className="px-4 py-4 flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg animate-pulse"
                    style={{ width: '90px', backgroundColor: '#1f1f1f' }}
                  />
                ))}
              </div>
            ) : (
              <>
                {/* เมนู */}
                <div className="px-4 pt-4 pb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    เมนู
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {availableMenus.map((item) => (
                      <div
                        key={item.id}
                        className="w-24 rounded-lg p-3 text-center"
                        style={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #2a2a2a',
                        }}
                      >
                        <p className="text-xs text-white font-medium leading-tight">{item.name}</p>
                        <p className="text-xs mt-1.5" style={{ color: '#C67C4E' }}>
                          {item.basePrice} ฿
                        </p>
                      </div>
                    ))}
                    {unavailableMenus.map((item) => (
                      <div
                        key={item.id}
                        className="w-24 rounded-lg p-3 text-center relative overflow-hidden"
                        style={{
                          backgroundColor: '#111',
                          border: '1px solid #1f1f1f',
                        }}
                      >
                        <p
                          className="text-xs font-medium leading-tight"
                          style={{ color: '#3a3a3a', textDecoration: 'line-through' }}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs mt-1.5" style={{ color: '#3a3a3a' }}>
                          {item.basePrice} ฿
                        </p>
                        <div
                          className="absolute top-1.5 right-1.5 px-1.5 rounded"
                          style={{
                            fontSize: '9px',
                            backgroundColor: '#2a1a1a',
                            color: '#a55',
                            border: '1px solid #3a2020',
                            lineHeight: '14px',
                          }}
                        >
                          หมด
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* นม */}
                <div className="px-4 pb-3" style={{ borderTop: '1px solid #1f1f1f' }}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-2">
                    ชนิดนม
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableMilk.map((milk) => (
                      <div
                        key={milk.value}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                      >
                        <span className="text-xs text-gray-300">{milk.label}</span>
                        {milk.price > 0 && (
                          <span className="text-xs text-gray-600">+{milk.price} ฿</span>
                        )}
                      </div>
                    ))}
                    {unavailableMilk.map((milk) => (
                      <div
                        key={milk.value}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md relative"
                        style={{ backgroundColor: '#111', border: '1px solid #1f1f1f' }}
                      >
                        <span 
                          className="text-xs"
                          style={{ color: '#3a3a3a', textDecoration: 'line-through' }}
                        >
                          {milk.label}
                        </span>
                        <span
                          className="px-1 rounded"
                          style={{
                            fontSize: '9px',
                            lineHeight: '14px',
                            backgroundColor: '#2a1a1a',
                            color: '#a55',
                            border: '1px solid #3a2020',
                          }}
                        >
                          หมด
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ท็อปปิ้ง */}
                <div className="px-4 pb-4" style={{ borderTop: '1px solid #1f1f1f' }}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-2">
                    ท็อปปิ้ง
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableToppings.map((topping) => (
                      <div
                        key={topping.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                      >
                        <span className="text-xs text-gray-300">{topping.name}</span>
                        <span className="text-xs text-gray-600">+{topping.price} ฿</span>
                      </div>
                    ))}
                    {unavailableToppings.map((topping) => (
                      <div
                        key={topping.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: '#111', border: '1px solid #1f1f1f' }}
                      >
                        <span 
                          className="text-xs"
                          style={{ color: '#3a3a3a', textDecoration: 'line-through' }}
                        >
                          {topping.name}
                        </span>
                        <span
                          className="px-1 rounded"
                          style={{
                            fontSize: '9px',
                            lineHeight: '14px',
                            backgroundColor: '#2a1a1a',
                            color: '#a55',
                            border: '1px solid #3a2020',
                          }}
                        >
                          หมด
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── OrderForm เดิม ───────────────────────────────────── */}
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

      <style jsx global>{`
        .custom-dots li button {
          background: #404040 !important;
          height: 6px !important;
          border-radius: 3px !important;
        }
        .custom-dots li.slick-active button {
          background: #C67C4E !important;
          width: 24px !important;
        }
      `}</style>
    </div>
  );
}