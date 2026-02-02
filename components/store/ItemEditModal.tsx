'use client';

import { Modal, Radio, Select, Checkbox, InputNumber, Input, Divider } from 'antd';
import { CartItem, MilkOption, Topping, MenuItem } from '@/types/order';
import { MENU_TYPES } from '@/data/menu';

interface ItemEditModalProps {
  item: CartItem | null;
  open: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (item: CartItem) => void;
  milkOptions: MilkOption[];
  toppings: Topping[];
  menuItems: MenuItem[]; // เพิ่ม prop นี้
}

export default function ItemEditModal({
  item,
  open,
  onSave,
  onCancel,
  onChange,
  milkOptions,
  toppings,
  menuItems
}: ItemEditModalProps) {
  if (!item) return null;

  // กรองเฉพาะตัวเลือกที่ available
  const availableMilkOptions = milkOptions.filter(m => m.available);
  const availableToppings = toppings.filter(t => t.available);

  // หาว่าเมนูนี้ต้องการนมหรือไม่
  const menuInfo = menuItems.find(m => m.name === item.menuName);
  const requiresMilk = menuInfo?.requiresMilk ?? true;

  // กรองตัวเลือกนม
  const filteredMilkOptions = requiresMilk 
    ? availableMilkOptions.filter(m => m.value !== 'none')
    : availableMilkOptions;

  // คำนวณราคารายการ
  const calculateItemPrice = (item: CartItem) => {
    const menuType = MENU_TYPES.find(t => t.label === item.type);
    const milk = item.milk ? milkOptions.find(m => m.label === item.milk) : null;
    
    const toppingPrices = item.toppings.reduce((sum, toppingName) => {
      const topping = toppings.find(t => t.name === toppingName);
      return sum + (topping?.price || 0);
    }, 0);

    const basePrice = item.basePrice + (menuType?.price || 0) + (milk?.price || 0) + toppingPrices;
    return basePrice * item.quantity;
  };

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
                <Radio key={t.value} value={t.label}>
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
          <p className="font-semibold mb-2">
            เปลี่ยนชนิดนม
            {!requiresMilk && (
              <span className="text-xs text-gray-500 ml-2">(ไม่จำเป็น)</span>
            )}
          </p>
          {filteredMilkOptions.length > 0 ? (
            <Select
              value={item.milk}
              onChange={(value) => onChange({ ...item, milk: value })}
              className="w-full"
              placeholder={requiresMilk ? 'เลือกชนิดนม' : 'ไม่ใส่นม หรือเลือกชนิดนม'}
            >
              {filteredMilkOptions.map(m => (
                <Select.Option key={m.value} value={m.label}>
                  {m.label} {m.price > 0 ? `+${m.price} ฿` : ''}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <div className="p-3 bg-gray-100 rounded text-sm text-gray-500">
              ไม่มีนมที่พร้อมให้บริการในขณะนี้
            </div>
          )}
        </div>

        <div>
          <p className="font-semibold mb-2">เลือกท็อปปิ้ง</p>
          {availableToppings.length > 0 ? (
            <Checkbox.Group
              value={item.toppings}
              onChange={(values) => onChange({ ...item, toppings: values as string[] })}
              className="w-full"
            >
              <div className="flex flex-col gap-2">
                {availableToppings.map(t => (
                  <Checkbox key={t.id} value={t.name}>
                    {t.name} <span className="text-gray-400">+{t.price} ฿</span>
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          ) : (
            <div className="p-3 bg-gray-100 rounded text-sm text-gray-500">
              ไม่มีท็อปปิ้งที่พร้อมให้บริการในขณะนี้
            </div>
          )}
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