'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, App, Switch, Tabs, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { MenuItem, MilkOption, Topping } from '@/types/order';
import { getMergedMilkOptions, getMergedToppings, getMergedMenuItems } from '@/utils/storageHelper';

export default function MenuManagementPage() {
  const { message } = App.useApp();
  const router = useRouter();

  // ── เมนู availability ──────────────────────────────────────
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  // ── นม และ ท็อปปิ้ง availability ─────────────────────────
  const [milkOptions, setMilkOptions] = useState<MilkOption[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);

  // ─── โหลดข้อมูลจาก localStorage (ใช้ merge function) ────────────────────────────
  useEffect(() => {
    // โหลดและ merge ข้อมูล
    setMilkOptions(getMergedMilkOptions());
    setToppings(getMergedToppings());
    setMenuItems(getMergedMenuItems());
    setMenuLoading(false);
  }, []);

  // ─── เปิด/ปิดเมนู (บันทึกลง localStorage) ───────────────────────────────────────────
  const toggleMenuAvailability = (menuId: string, available: boolean) => {
    const updatedMenuItems = menuItems.map((item) =>
      item.id === menuId ? { ...item, available } : item
    );
    setMenuItems(updatedMenuItems);
    localStorage.setItem('menuItems', JSON.stringify(updatedMenuItems));
    
    message.success(available ? 'เปิดเมนูแล้ว' : 'ปิดเมนูแล้ว');
  };

  // ─── เปิด/ปิดนม (บันทึกลง localStorage) ─────────────────────
  const toggleMilkAvailability = (milkValue: string, available: boolean) => {
    const updatedMilk = milkOptions.map((milk) =>
      milk.value === milkValue ? { ...milk, available } : milk
    );
    setMilkOptions(updatedMilk);
    localStorage.setItem('milkOptions', JSON.stringify(updatedMilk));
    
    message.success(available ? 'เปิดนมแล้ว' : 'ปิดนมแล้ว');
  };

  // ─── เปิด/ปิดท็อปปิ้ง (บันทึกลง localStorage) ────────────────
  const toggleToppingAvailability = (toppingId: string, available: boolean) => {
    const updatedToppings = toppings.map((topping) =>
      topping.id === toppingId ? { ...topping, available } : topping
    );
    setToppings(updatedToppings);
    localStorage.setItem('toppings', JSON.stringify(updatedToppings));
    
    message.success(available ? 'เปิดท็อปปิ้งแล้ว' : 'ปิดท็อปปิ้งแล้ว');
  };

  const tabItems = [
    {
      key: 'menu',
      label: 'เมนู',
      children: (
        <div>
          {menuLoading ? (
            <Spin size="small" />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    backgroundColor: item.available ? '#2a2a2a' : '#1a1a1a',
                    border: item.available ? '1px solid #404040' : '1px solid #333',
                    opacity: item.available ? 1 : 0.55,
                  }}
                >
                  <div className="flex-1 pr-3 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: item.available ? '#fff' : '#666' }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.basePrice} ฿</p>
                  </div>
                  <Switch
                    size="small"
                    checked={item.available}
                    onChange={(checked) => toggleMenuAvailability(item.id, checked)}
                    style={item.available ? { backgroundColor: '#C67C4E' } : {}}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'milk',
      label: 'นม',
      children: (
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {milkOptions.map((milk) => {
              const isFreshMilk = milk.value === 'fresh';
              return (
                <div
                  key={milk.value}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    backgroundColor: milk.available ? '#2a2a2a' : '#1a1a1a',
                    border: milk.available ? '1px solid #404040' : '1px solid #333',
                    opacity: milk.available ? 1 : 0.55,
                  }}
                >
                  <div className="flex-1 pr-3 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: milk.available ? '#fff' : '#666' }}
                    >
                      {milk.label}
                      {isFreshMilk && (
                        <span className="text-xs text-gray-500 ml-1">(Base)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {milk.price > 0 ? `+${milk.price} ฿` : 'ฟรี'}
                    </p>
                  </div>
                  <Switch
                    size="small"
                    checked={milk.available}
                    onChange={(checked) => toggleMilkAvailability(milk.value, checked)}
                    style={milk.available ? { backgroundColor: '#C67C4E' } : {}}
                    disabled={isFreshMilk}
                  />
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * นมสดเป็น base ของเมนู ปิดไม่ได้
          </p>
        </div>
      ),
    },
    {
      key: 'topping',
      label: 'ท็อปปิ้ง',
      children: (
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {toppings.map((topping) => (
              <div
                key={topping.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: topping.available ? '#2a2a2a' : '#1a1a1a',
                  border: topping.available ? '1px solid #404040' : '1px solid #333',
                  opacity: topping.available ? 1 : 0.55,
                }}
              >
                <div className="flex-1 pr-3 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: topping.available ? '#fff' : '#666' }}
                  >
                    {topping.name}
                  </p>
                  <p className="text-xs text-gray-500">+{topping.price} ฿</p>
                </div>
                <Switch
                  size="small"
                  checked={topping.available}
                  onChange={(checked) => toggleToppingAvailability(topping.id, checked)}
                  style={topping.available ? { backgroundColor: '#C67C4E' } : {}}
                />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => router.push('/admin')}
            className="mb-4 text-gray-400 hover:text-white"
          >
            กลับไปหน้ารับออเดอร์
          </Button>
          <h1 className="text-3xl font-bold text-[#C67C4E] mb-2">
            จัดการเมนู
          </h1>
          <p className="text-gray-400">
            เปิด/ปิด ความพร้อมของเมนู นม และท็อปปิ้ง
          </p>
        </div>

        {/* ─── Availability Management Panel ──────────────────────────── */}
        <Card
          style={{
            backgroundColor: '#1a1a1a',
            borderColor: '#404040',
            borderRadius: '12px',
          }}
        >
          <Tabs
            items={tabItems}
            defaultActiveKey="menu"
            tabBarStyle={{
              color: '#C67C4E',
            }}
          />
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: '#404040',
              borderRadius: '12px',
            }}
          >
            <p className="text-gray-400 text-sm mb-1">เมนูพร้อมให้บริการ</p>
            <p className="text-2xl font-bold text-[#C67C4E]">
              {menuItems.filter(m => m.available).length}/{menuItems.length}
            </p>
          </Card>
          <Card
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: '#404040',
              borderRadius: '12px',
            }}
          >
            <p className="text-gray-400 text-sm mb-1">นมพร้อมให้บริการ</p>
            <p className="text-2xl font-bold text-[#C67C4E]">
              {milkOptions.filter(m => m.available).length}/{milkOptions.length}
            </p>
          </Card>
          <Card
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: '#404040',
              borderRadius: '12px',
            }}
          >
            <p className="text-gray-400 text-sm mb-1">ท็อปปิ้งพร้อมให้บริการ</p>
            <p className="text-2xl font-bold text-[#C67C4E]">
              {toppings.filter(t => t.available).length}/{toppings.length}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}