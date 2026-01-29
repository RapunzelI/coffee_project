'use client';

import { Modal, Radio, Select, Checkbox, InputNumber, Input, Divider } from 'antd';
import { CartItem } from '@/types/order';
import { MENU_TYPES, MILK_OPTIONS, TOPPINGS } from '@/constants/menu';
import { calculateItemPrice } from '@/utils/priceCalculator';

interface ItemEditModalProps {
  item: CartItem | null;
  open: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (item: CartItem) => void;
}

export default function ItemEditModal({
  item,
  open,
  onSave,
  onCancel,
  onChange
}: ItemEditModalProps) {
  if (!item) return null;

  return (
    <Modal
      title={item.key ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}
      open={open}
      onOk={onSave}
      onCancel={onCancel}
      okText="บันทึก"
      cancelText="ยกเลิก"
      width={500}
    >
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-lg font-bold mb-2">{item.menuName}</h4>
          <p className="text-gray-400">ราคาเริ่มต้น {item.basePrice} ฿</p>
        </div>

        <div>
          <p className="font-semibold mb-2">ประเภท</p>
          <Radio.Group
            value={item.type}
            onChange={(e) => onChange({ ...item, type: e.target.value })}
            className="w-full"
          >
            <div className="flex flex-col gap-2">
              {MENU_TYPES.map(t => (
                <Radio key={t.value} value={t.value}>
                  <div className="inline-flex gap-2">
                    <span>{t.label}</span>
                    {t.price > 0 && (
                      <span className="text-gray-400">+{t.price} ฿</span>
                    )}
                  </div>
                </Radio>
              ))}
            </div>
          </Radio.Group>
        </div>

        <div>
          <p className="font-semibold mb-2">เปลี่ยนชนิดนม</p>
          <Select
            value={item.milk}
            onChange={(value) => onChange({ ...item, milk: value })}
            className="w-full"
          >
            {MILK_OPTIONS.map(m => (
              <Select.Option key={m.value} value={m.value}>
                {m.label} {m.price > 0 ? `+${m.price} ฿` : ''}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <p className="font-semibold mb-2">เลือกท็อปปิ้ง</p>
          <Checkbox.Group
            value={item.toppings}
            onChange={(values) => onChange({ ...item, toppings: values as string[] })}
            className="w-full"
          >
            <div className="flex flex-col gap-2">
              {TOPPINGS.map(t => (
                <Checkbox key={t.id} value={t.id}>
                  {t.name} <span className="text-gray-400">+{t.price} ฿</span>
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        <div>
          <p className="font-semibold mb-2">จำนวน</p>
          <InputNumber
            min={1}
            max={10}
            value={item.quantity}
            onChange={(value) => onChange({ ...item, quantity: value || 1 })}
            className="w-full"
          />
        </div>

        <div>
          <p className="font-semibold mb-2">หมายเหตุพิเศษ</p>
          <Input
            value={item.specialNote}
            onChange={(e) => onChange({ ...item, specialNote: e.target.value })}
            placeholder="เช่น น้ำตาลน้อย, น้ำแข็งมาก"
          />
        </div>

        <Divider />

        <div className="flex justify-between items-center">
          <p className="font-semibold">ราคารวม</p>
          <h3 className="text-2xl font-bold text-[#C67C4E] m-0">
            {calculateItemPrice(item)} ฿
          </h3>
        </div>
      </div>
    </Modal>
  );
}
