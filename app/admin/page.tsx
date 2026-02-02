'use client';

import { useEffect, useState } from 'react';
import { Card, Spin, Modal, App, Switch, Divider, Tabs } from 'antd';
import OrderList from '../../components/store/OrderList';
import MenuSelector from '../../components/store/MenuSelector';
import { Order, CartItem, MenuItem, MilkOption, Topping } from '@/types/order';
import { getMergedMilkOptions, getMergedToppings } from '@/utils/storageHelper';

export default function AdminPage() {
  const { message } = App.useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMenuSelector, setShowMenuSelector] = useState(false);

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
  }, []);

  // ─── ดึง orders จาก API ─────────────────────────────────────
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('ไม่สามารถดึงข้อมูลออเดอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  // ─── ดึงเมนู + availability จาก API ─────────────────────────
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const result = await response.json();

      if (result.success) {
        setMenuItems(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      message.error('ไม่สามารถดึงเมนูได้');
    } finally {
      setMenuLoading(false);
    }
  };

  // ─── เปิด/ปิดเมนู ───────────────────────────────────────────
  const toggleMenuAvailability = async (menuId: string, available: boolean) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: menuId, available }),
      });

      const result = await response.json();

      if (result.success) {
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === menuId ? { ...item, available } : item
          )
        );
        message.success(available ? 'เปิดเมนูแล้ว' : 'ปิดเมนูแล้ว');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to toggle menu:', error);
      message.error('เปิด/ปิดเมนูไม่สำเร็จ');
    }
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

  // ─── อัพเดทสถานะ order ──────────────────────────────────────
  const updateOrderStatus = async (
    orderId: string,
    status: string,
    items?: CartItem[],
    price?: number
  ) => {
    try {
      const body: any = { status };
      if (items) body.items = items;
      if (price !== undefined) body.price = price;

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        message.success('อัพเดทสถานะสำเร็จ!');
        fetchOrders();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      message.error('อัพเดทสถานะไม่สำเร็จ');
    }
  };

  // ─── Initial fetch ──────────────────────────────────────────
  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  // ─── Auto-refresh orders ────────────────────────────────────
  useEffect(() => {
    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const interval = setInterval(() => {
      fetchOrders();
    }, pendingCount > 0 ? 3000 : 10000);

    return () => clearInterval(interval);
  }, [orders]);

  // ─── แบ่ง orders ตามสถานะ ──────────────────────────────────
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');

  // ─── Order handlers ─────────────────────────────────────────
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowMenuSelector(true);
  };

  const handleStartPreparing = (order: Order) => {
    updateOrderStatus(order._id, 'preparing');
  };

  const handleMarkReady = (order: Order) => {
    updateOrderStatus(order._id, 'ready');
  };

  const handleConfirmOrder = (items: CartItem[], totalPrice: number) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder._id, 'preparing', items, totalPrice);
      setSelectedOrder(null);
      setShowMenuSelector(false);
    }
  };

  const handleCancelSelect = () => {
    setSelectedOrder(null);
    setShowMenuSelector(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'menu',
      label: 'เมนู',
      children: (
        <div>
          {menuLoading ? (
            <Spin size="small" />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
        </div>
      ),
    },
    {
      key: 'topping',
      label: 'ท็อปปิ้ง',
      children: (
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
          <h1 className="text-3xl font-bold text-[#C67C4E] text-center mb-10">
            ระบบจัดการออเดอร์
          </h1>
          <p className="text-gray-400 mt-1">
            ออเดอร์ทั้งหมด: {orders.length} รายการ
            {pendingOrders.length > 0 && (
              <span className="ml-3 text-red-500 font-semibold">
                • {pendingOrders.length} รายการรอยืนยัน
              </span>
            )}
          </p>
        </div>

        {/* ─── Availability Management Panel ──────────────────────────── */}
        <Card
          style={{
            backgroundColor: '#1a1a1a',
            borderColor: '#404040',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <h2 className="text-lg font-semibold text-[#C67C4E] mb-4">
            จัดการความพร้อม
          </h2>
          <Tabs
            items={tabItems}
            defaultActiveKey="menu"
            tabBarStyle={{
              color: '#C67C4E',
            }}
          />
        </Card>

        {/* ─── Order List ─────────────────────────────────────── */}
        <div>
          <OrderList
            pendingOrders={pendingOrders}
            confirmedOrders={confirmedOrders}
            preparingOrders={preparingOrders}
            onSelectOrder={handleSelectOrder}
            onStartPreparing={handleStartPreparing}
            onMarkReady={handleMarkReady}
          />

          {/* Menu Selector Modal */}
          <Modal
            title={`เลือกเมนูสำหรับออเดอร์ ${selectedOrder?.orderNumber}`}
            open={showMenuSelector}
            onCancel={handleCancelSelect}
            footer={null}
            width={700}
            destroyOnHidden
          >
            {selectedOrder && (
              <MenuSelector
                orderText={selectedOrder.customerText}
                onConfirm={handleConfirmOrder}
                onCancel={handleCancelSelect}
                milkOptions={milkOptions}
                toppings={toppings}
                menuItems={menuItems}
              />
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

//อเมริกาโน่ไม่ต้องใส่นมไม่ใช่หรอ ? ค่อยไปแก้
// แล้วก็มี แก้หน้า admin ให้แยกการจัดการออเดอร์ กลับ 
// การจัดการเมนูต่างๆ หน้าจะต้องปรับ UXUI ให้ใช้งานง่ายกว่านี้หน่อยในหน้า admin 
// ออใช่มีรายงาน Dashboard รายได้ในแต่ละวันด้วย 
// แล้วก็ ถ้าไม่ขี้เกียจก็ทำ login เพื่อจะเก็บรายการที่เคยสั่งเเอาสั่งซ้ำได้ด้วย 