import { CartItem } from '@/types/order';
import { MENU_TYPES, MILK_OPTIONS, TOPPINGS } from '@/constants/menu';

export const calculateItemPrice = (item: CartItem): number => {
  const typePrice = MENU_TYPES.find(t => t.value === item.type)?.price || 0;
  const milkPrice = MILK_OPTIONS.find(m => m.value === item.milk)?.price || 0;
  const toppingsPrice = item.toppings.reduce((sum, t) => {
    const topping = TOPPINGS.find(tp => tp.id === t);
    return sum + (topping?.price || 0);
  }, 0);
  
  return (item.basePrice + typePrice + milkPrice + toppingsPrice) * item.quantity;
};

export const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + calculateItemPrice(item), 0);
};