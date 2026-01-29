'use client';

import { Card, Steps, Tag, Divider, Button } from 'antd';
import { Order } from '@/types/order';
import { formatTime } from '@/utils/formatters';
import { CheckCircleOutlined, DollarOutlined, LoadingOutlined, QrcodeOutlined, SendOutlined, SmileOutlined, SyncOutlined } from '@ant-design/icons';

interface OrderStatusProps {
  order: Order;
  onNewOrder: () => void;
}

export default function OrderStatus({ order, onNewOrder }: OrderStatusProps) {
  const getStatusStep = () => {
    switch (order.status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      default: return 0;
    }
  };

  const statusSteps = [
    {
      title: 'ส่งออเดอร์',
      content: formatTime(order.createdAt),
      icon: <SendOutlined />
    },
    {
      title: 'ร้านยืนยัน',
      content: order.status !== 'pending' ? '✓ ยืนยันแล้ว' : <LoadingOutlined />,
      icon: <CheckCircleOutlined />
    },
    {
      title: 'กำลังทำ',
      content: order.status === 'preparing' || order.status === 'ready' ? '✓ ยืนยันแล้ว' : <LoadingOutlined />,
      icon: <CheckCircleOutlined />
    },
    {
      title: 'พร้อมรับ',
      content: order.status === 'ready' ? '✓ พร้อมรับแล้ว!' : '-',
      icon: <SmileOutlined />
    }
  ];

  return (
    <>
      <Card className="text-center "
      style={{ 
          backgroundColor: '#1a1a1a', 
          borderColor: '#404040',
          borderRadius: '12px'
        }}>
        <p className="text-gray-400 mb-2">หมายเลขออเดอร์</p>
        <h1 className="text-5xl font-bold my-2" style={{color: '#C67C4E'}}>
          {order.orderNumber}
        </h1>
      </Card>

      <div className='mt-5'>
        <Card title={<span className='text-white'>สถานะออเดอร์</span>}
          style={{
              backgroundColor: '#1a1a1a',
              borderColor: '#404040',
              borderRadius: '12px',
              
          }}
        >
          <Steps
            orientation="vertical"
            current={getStatusStep()}
            items={statusSteps}
            className='px-10'
          />
          {order.status === 'ready' && (
            <div className="mt-10 p-3 rounded-lg text-center" 
            style={{
              backgroundColor: '#1a3a2a',
              border: '1px solid #2a5a2a',
              borderRadius: '6px'
            }}>
              <p className="font-semibold text-lg" style={{ color: '#4ade80'}}>
              ออเดอร์พร้อมรับแล้ว!
              </p>
            </div>
          )}
        </Card>
      </div>

      <Card title={<span className='text-white'>รายละเอียดออเดอร์</span>}
        style={{
            backgroundColor: '#1a1a1a',
            borderColor: '#404040',
            border: '12px'
        }}>
        <p className='text-white'>{order.customerText}</p>
        <Divider style={{ borderColor: '#404040'}}/>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 item-center">
            {order.paymentMethod === 'promptpay' ? (
              <QrcodeOutlined style={{ color: '#00427A' }} />
            ) : (
              <DollarOutlined style={{ color: '#4ade80' }} />
            )}
            <span className="text-gray-400">วิธีชำระเงิน:</span>
            <Tag color={order.paymentMethod === 'promptpay' ? '#00427A' : '#4ade80'}
                style={{borderRadius: '6px'}}>
              {order.paymentMethod === 'promptpay' ? 'PromptPay' : 'จ่ายหน้าร้าน'}
            </Tag>
          </div>
          {order.price && (
            <div className="flex gap-2 item-center">
              <span className="text-gray-400">ราคารวม:</span>
              <span className="font-bold text-lg " style={{ color: '#C67C4E' }}>
                {order.price} ฿
              </span>
            </div>
          )}
        </div>
      </Card>
      
      <div className='mt-5'>
      <Button block onClick={onNewOrder}
       style={{ 
          backgroundColor: '#262626',
          borderColor: '#404040',
          color: '#fff',
          height: '40px'
        }}>
        สั่งใหม่
      </Button>
      </div>
    </>
  );
}