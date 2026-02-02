'use client';

import { useEffect, useState } from 'react';
import { Spin, Modal, App, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import OrderList from '../../components/store/OrderList';
import MenuSelector from '../../components/store/MenuSelector';
import { Order, CartItem } from '@/types/order';
import { getMergedMilkOptions, getMergedToppings, getMergedMenuItems } from '@/utils/storageHelper';

export default function AdminPage() {
  const { message } = App.useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMenuSelector, setShowMenuSelector] = useState(false);

  // ดึงข้อมูลจาก localStorage
  const milkOptions = getMergedMilkOptions();
  const toppings = getMergedToppings();
  const menuItems = getMergedMenuItems();

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

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-[#C67C4E] m-0">
              ระบบรับออเดอร์
            </h1>
            <Button
              type="default"
              icon={<SettingOutlined />}
              onClick={() => router.push('/admin/menu-management')}
              size="large"
            >
              จัดการเมนู
            </Button>
          </div>
          <p className="text-gray-400 mt-1">
            ออเดอร์ทั้งหมด: {orders.length} รายการ
            {pendingOrders.length > 0 && (
              <span className="ml-3 text-red-500 font-semibold">
                • {pendingOrders.length} รายการรอยืนยัน
              </span>
            )}
          </p>
        </div>

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