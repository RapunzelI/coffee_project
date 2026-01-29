'use client';

import { DollarOutlined, QrcodeOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, Radio } from 'antd';


const { TextArea } = Input;

interface OrderFormProps {
  orderText: string;
  paymentMethod: 'promptpay' | 'counter';
  onOrderTextChange: (value: string) => void;
  onPaymentMethodChange: (value: 'promptpay' | 'counter') => void;
  onSubmit: () => void;
}

export default function OrderForm({
  orderText,
  paymentMethod,
  onOrderTextChange,
  onPaymentMethodChange,
  onSubmit
}: OrderFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-semibold mb-2 ">บอกเราสิว่าอยากได้อะไร</p>
        <TextArea
          value={orderText}
          onChange={(e) => onOrderTextChange(e.target.value)}
          placeholder="ลาเต้ร้อน 2 แก้ว นมโอ๊ต พิเศษน้ำตาลน้อย"
          rows={4}
          showCount
          maxLength={500}
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            borderColor: '#404040',
          }}
        />
      </div>

      <div>
        <p className="font-semibold mb-2 text-white">วิธีชำระเงิน</p>
        <Radio.Group
          value={paymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          className="w-full"
        >
          <div className="flex flex-col gap-2">
            <Radio value="promptpay" className='text-white'>
              <div className="inline-flex gap-2 item-center">
                <QrcodeOutlined style={{ color: '#00427A' }} />
                <span>PromptPay</span>
                <span className="text-gray-400 text-xs">สแกน QR ชำระเงิน</span>
              </div>
            </Radio>
            <Radio value="counter">
              <div className="inline-flex gap-2">
                <DollarOutlined style={{ color: '#4ade80' }} />
                <span>จ่ายหน้าร้าน</span>
                <span className="text-gray-400 text-xs">จ่ายตอนรับ</span>
              </div>
            </Radio>
          </div>
        </Radio.Group>
      </div>

      <div>
      <Button
        type="primary"
        size="large"
        block
        icon={<SendOutlined />}
        onClick={onSubmit}
        disabled={!orderText.trim()}
        style={{
            color: '#ffffff',
            backgroundColor: '#C67C4E',
            borderColor: '#C67C4E',
            
        }}
      >
        ส่งออเดอร์
      </Button>
      </div>
    </div>
  );
}