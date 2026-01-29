'use client';

import { Button } from 'antd';
import { MenuItem } from '@/types/order';

interface MenuGridProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export default function MenuGrid({ items, onSelectItem }: MenuGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(menu => (
        <Button
          key={menu.id}
          onClick={() => onSelectItem(menu)}
          className="h-auto p-4"
        >
          <div>
            <div className="font-bold">{menu.name}</div>
            <div className="text-[#C67C4E] text-sm">
              {menu.basePrice} ฿
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}