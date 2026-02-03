'use client';

import { Button, List, Tag } from 'antd';
import { CartItem } from '@/types/order';
import { calculateItemPrice } from '@/utils/priceCalculator';
import { MENU_TYPES, MILK_OPTIONS, TOPPINGS } from '@/data/menu';

interface CartListProps {
  items: CartItem[];
  onEdit: (item: CartItem) => void;
  onDelete: (key: number) => void;
}

export default function CartList({ items, onEdit, onDelete }: CartListProps) {
  const getItemDescription = (item: CartItem) => {
    const parts = [];
    parts.push(MENU_TYPES.find(t => t.value === item.type)?.label);
    parts.push(MILK_OPTIONS.find(m => m.value === item.milk)?.label);
    if (item.toppings.length > 0) {
      const toppingNames = item.toppings.map(t =>
        TOPPINGS.find(tp => tp.id === t)?.name
      ).join(', ');
      parts.push(toppingNames);
    }
    return parts.filter(Boolean).join(' • ');
  };

  if (items.length === 0) {
    return (
      <div className="text-center p-5">
        <p className="text-gray-500">ยังไม่มีรายการ</p>
      </div>
    );
  }

  return (
    <List
      dataSource={items}
      renderItem={item => (
        <List.Item
          actions={[
            <Button
              key="edit"
              type="link"
              size="small"
              onClick={() => onEdit(item)}
            >
              แก้ไข
            </Button>,
            <Button
              key="delete"
              type="link"
              danger
              size="small"
              onClick={() => onDelete(item.key)}
            >
              ลบ
            </Button>
          ]}
        >
          <List.Item.Meta
            title={
              <div className="flex gap-2 items-center">
                <span>{item.menuName}</span>
                <Tag>x{item.quantity}</Tag>
              </div>
            }
            description={
              <div>
                <div>{getItemDescription(item)}</div>
                {item.specialNote && (
                  <p className="text-gray-400 text-xs">
                    หมายเหตุ: {item.specialNote}
                  </p>
                )}
              </div>
            }
          />
          <div className="font-bold text-[#C67C4E]">
            {calculateItemPrice(item)} ฿
          </div>
        </List.Item>
      )}
    />
  );
}