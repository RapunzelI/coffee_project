'use client';

import { Order, CartItem } from '@/types/order';
import { OrderStore } from '@/lib/orderStore';
import { formatOrderNumber } from '@/utils/formatters';

export const useOrderActions = () => {
  const createOrder = (
    customerText: string,
    paymentMethod: 'promptpay' | 'counter'
  ): Order => {
    const ordersCount = OrderStore.getAll().length;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: formatOrderNumber(ordersCount + 1),
      customerText,
      paymentMethod,
      status: 'pending',
      price: null,
      items: [],
      createdAt: new Date().toISOString()
    };

    return OrderStore.add(newOrder);
  };

  const confirmOrder = (orderId: string, price: number, items: CartItem[]) => {
    return OrderStore.update(orderId, {
      status: 'confirmed',
      price,
      items
    });
  };

  const startPreparing = (orderId: string) => {
    return OrderStore.update(orderId, {
      status: 'preparing'
    });
  };

  const markReady = (orderId: string) => {
    return OrderStore.update(orderId, {
      status: 'ready'
    });
  };

  return {
    createOrder,
    confirmOrder,
    startPreparing,
    markReady
  };
};