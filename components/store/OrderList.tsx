'use client';

import { Card, Tag, Button, Divider } from 'antd';
import { Order } from '@/types/order';
import { formatTime } from '@/utils/formatters';

interface OrderListProps {
  pendingOrders: Order[];
  confirmedOrders: Order[];
  preparingOrders: Order[];
  onSelectOrder: (order: Order) => void;
  onStartPreparing: (order: Order) => void;
  onMarkReady: (order: Order) => void;
}

export default function OrderList({
  pendingOrders,
  confirmedOrders,
  preparingOrders,
  onSelectOrder,
  onStartPreparing,
  onMarkReady
}: OrderListProps) {
  const hasOrders = pendingOrders.length > 0 || confirmedOrders.length > 0 || preparingOrders.length > 0;

  if (!hasOrders) {
    return (
      <Card className="text-center p-10" 
        style={{
        borderColor: '#404040',
              }}>
        <p className="text-gray-400">ไม่มีออเดอร์</p>
      </Card>
    );
  }

  return (
    <div className='mb-5'>
      {pendingOrders.length > 0 && (
        <>
          <h5 className="text-lg font-semibold mb-3">ออเดอร์รอยืนยัน</h5>
          <div>
            {pendingOrders.map((order, index) => (
              <div key={order.orderNumber || `pending-${index}`} className='mb-2'>
                <Card
                  className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectOrder(order)}
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: '#404040',
                    borderRadius: '12px',
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-[#C67C4E] m-0">
                        {order.orderNumber}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {formatTime(order.createdAt)}
                      </p>
                      <p className="mt-2">{order.customerText}</p>
                    </div>
                    <Tag color="rgb(255, 0, 38)">รอยืนยัน</Tag>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}

      {preparingOrders.length > 0 && (
        <>
          {pendingOrders.length > 0 && <Divider />}
          <h5 className="text-lg font-semibold mb-3">กำลังดำเนินการ</h5>
          <div>
            {preparingOrders.map((order, index) => (
              <div key={order.orderNumber || `preparing-${index}`} className='mb-2'>
                <Card className="mb-3" 
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: '#404040',
                    borderRadius: '12px',
                  }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 items-center">
                        <h4 className="text-xl font-bold text-[#C67C4E] m-0">
                          {order.orderNumber}
                        </h4>
                        <Tag color="orange">กำลังทำ</Tag>
                      </div>
                      <p className="mt-2">{order.customerText}</p>
                      <p className="font-bold text-[#C67C4E]">{order.price} ฿</p>
                    </div>
                    <Button 
                      type="primary"
                      className="bg-green-500 hover:bg-green-600" 
                      onClick={() => onMarkReady(order)}
                    >
                      พร้อมรับ
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}