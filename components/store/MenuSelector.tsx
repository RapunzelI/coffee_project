'use client';

import { useState } from 'react';
import { Form, Select, InputNumber, Checkbox, Button, Divider, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { MENU_TYPES } from '@/data/menu';
import { CartItem, MilkOption, Topping, MenuItem } from '@/types/order';

interface MenuSelectorProps {
  orderText: string;
  onConfirm: (items: CartItem[], totalPrice: number) => void;
  onCancel: () => void;
  milkOptions: MilkOption[];
  toppings: Topping[];
  menuItems: MenuItem[]; // เพิ่ม prop นี้
}

export default function MenuSelector({ 
  orderText, 
  onConfirm, 
  onCancel,
  milkOptions,
  toppings,
  menuItems // รับเมนูจาก Admin
}: MenuSelectorProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    menuId: null as string | null,
    type: 'iced' as 'hot' | 'iced' | 'blended',
    milk: 'fresh' as 'fresh' | 'oat' | 'almond' | 'soy',
    toppings: [] as string[],
    quantity: 1,
    specialNote: ''
  });

  // กรองเฉพาะตัวเลือกที่ available
  const availableMenuItems = menuItems.filter(m => m.available); // เพิ่มบรรทัดนี้
  const availableMilkOptions = milkOptions.filter(m => m.available);
  const availableToppings = toppings.filter(t => t.available);

  // คำนวณราคาของรายการปัจจุบัน
  const calculateItemPrice = () => {
    if (!currentItem.menuId) return 0;

    const menu = menuItems.find(m => m.id === currentItem.menuId);
    if (!menu) return 0;

    const menuType = MENU_TYPES.find(t => t.value === currentItem.type);
    const milk = milkOptions.find(m => m.value === currentItem.milk);
    const toppingPrices = currentItem.toppings.reduce((sum, toppingId) => {
      const topping = toppings.find(t => t.id === toppingId);
      return sum + (topping?.price || 0);
    }, 0);

    const basePrice = menu.basePrice + (menuType?.price || 0) + (milk?.price || 0) + toppingPrices;
    return basePrice * currentItem.quantity;
  };

  // เพิ่มรายการลงตะกร้า
  const handleAddItem = () => {
    if (!currentItem.menuId) return;

    const menu = menuItems.find(m => m.id === currentItem.menuId);
    if (!menu) return;

    const menuType = MENU_TYPES.find(t => t.value === currentItem.type);
    const milk = milkOptions.find(m => m.value === currentItem.milk);
    const basePrice = calculateItemPrice() / currentItem.quantity;

    const newItem: CartItem = {
      key: Date.now(),
      menuName: menu.name,
      type: menuType?.label || 'ร้อน',
      milk: milk?.label || 'นมสด',
      toppings: currentItem.toppings.map(id => {
        const topping = toppings.find(t => t.id === id);
        return topping?.name || '';
      }),
      quantity: currentItem.quantity,
      specialNote: currentItem.specialNote,
      basePrice: basePrice
    };

    setItems([...items, newItem]);

    // รีเซ็ตฟอร์ม
    setCurrentItem({
      menuId: null,
      type: 'iced',
      milk: 'fresh',
      toppings: [],
      quantity: 1,
      specialNote: ''
    });
  };

  // ลบรายการ
  const handleRemoveItem = (key: number) => {
    setItems(items.filter(item => item.key !== key));
  };

  // คำนวณราคารวม
  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  };

  // ยืนยันและส่งข้อมูล
  const handleConfirm = () => {
    if (items.length === 0) return;
    onConfirm(items, getTotalPrice());
  };

  const currentPrice = calculateItemPrice();

  return (
    <div className="space-y-4">
      {/* ข้อความจากลูกค้า */}
      <div className="p-4 bg-black rounded-lg ">
        <p className="text-sm text-gray-500 mb-1">รายละเอียดจากลูกค้า:</p>
        <p className="font-medium">{orderText}</p>
      </div>

      <Divider>เพิ่มเมนู</Divider>

      {/* ฟอร์มเลือกเมนู */}
      <Form layout="vertical">
        <Form.Item label="เมนู" required>
          <Select
            placeholder="เลือกเมนู"
            value={currentItem.menuId}
            onChange={(value) => setCurrentItem({ ...currentItem, menuId: value })}
            options={availableMenuItems.map(item => ({
              label: `${item.name} - ${item.basePrice}฿`,
              value: item.id
            }))}
            disabled={availableMenuItems.length === 0}
          />
          {availableMenuItems.length === 0 && (
            <p className="text-xs text-red-500 mt-1">ไม่มีเมนูที่พร้อมให้บริการในขณะนี้</p>
          )}
        </Form.Item>

        <Form.Item label="ประเภท">
          <Select
            value={currentItem.type}
            onChange={(value) => setCurrentItem({ ...currentItem, type: value })}
            options={MENU_TYPES.map(type => ({
              label: `${type.label}${type.price > 0 ? ` (+${type.price}฿)` : ''}`,
              value: type.value
            }))}
          />
        </Form.Item>

        <Form.Item label="ชนิดนม">
          <Select
            value={currentItem.milk}
            onChange={(value) => setCurrentItem({ ...currentItem, milk: value })}
            options={availableMilkOptions.map(milk => ({
              label: `${milk.label}${milk.price > 0 ? ` (+${milk.price}฿)` : ''}`,
              value: milk.value
            }))}
            disabled={availableMilkOptions.length === 0}
            placeholder={availableMilkOptions.length === 0 ? 'ไม่มีนมที่พร้อมให้บริการ' : 'เลือกชนิดนม'}
          />
          {availableMilkOptions.length === 0 && (
            <p className="text-xs text-red-500 mt-1">ไม่มีนมที่พร้อมให้บริการในขณะนี้</p>
          )}
        </Form.Item>

        <Form.Item label="ท็อปปิ้ง">
          {availableToppings.length > 0 ? (
            <Checkbox.Group
              value={currentItem.toppings}
              onChange={(values) => setCurrentItem({ ...currentItem, toppings: values as string[] })}
            >
              <Space orientation="vertical">
                {availableToppings.map(topping => (
                  <Checkbox key={topping.id} value={topping.id}>
                    {topping.name} (+{topping.price}฿)
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          ) : (
            <p className="text-sm text-gray-500">ไม่มีท็อปปิ้งที่พร้อมให้บริการในขณะนี้</p>
          )}
        </Form.Item>

        <Form.Item label="จำนวน">
          <InputNumber
            min={1}
            value={currentItem.quantity}
            onChange={(value) => setCurrentItem({ ...currentItem, quantity: value || 1 })}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-[#C67C4E]">
            ราคา: {currentPrice}฿
          </span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddItem}
            disabled={!currentItem.menuId || availableMenuItems.length === 0}
            style={{ backgroundColor: '#C67C4E', borderColor: '#C67C4E' }}
          >
            เพิ่มในรายการ
          </Button>
        </div>
      </Form>

      {/* รายการที่เพิ่มแล้ว */}
      {items.length > 0 && (
        <>
          <Divider>รายการออเดอร์</Divider>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.key}
                className="p-3 bg-black rounded-lg flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{item.menuName}</span>
                    <Tag color="blue">{item.type}</Tag>
                    <Tag>{item.milk}</Tag>
                  </div>
                  {item.toppings.length > 0 && (
                    <div className="text-sm text-gray-500">
                      ท็อปปิ้ง: {item.toppings.join(', ')}
                    </div>
                  )}
                  <div className="text-sm mt-1 bg-black">
                    <span className="text-gray-500">จำนวน: </span>
                    <span className="font-medium">{item.quantity}</span>
                    <span className="text-gray-500 ml-3">ราคา: </span>
                    <span className="font-medium text-[#C67C4E]">
                      {item.basePrice * item.quantity}฿
                    </span>
                  </div>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(item.key)}
                />
              </div>
            ))}
          </div>

          {/* ราคารวม */}
          <div className="p-4 bg-black border border-[#C67C4E] rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">ราคารวมทั้งหมด</span>
              <span className="text-2xl font-bold text-[#C67C4E]">
                {getTotalPrice()}฿
              </span>
            </div>
          </div>
        </>
      )}

      {/* ปุ่มยืนยัน/ยกเลิก */}
      <div className="flex gap-3 pt-4">
        <Button block onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button
          block
          type="primary"
          onClick={handleConfirm}
          disabled={items.length === 0}
          style={{ backgroundColor: '#C67C4E', borderColor: '#C67C4E' }}
        >
          ยืนยันออเดอร์
        </Button>
      </div>
    </div>
  );
}