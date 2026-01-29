'use client';

import { useState, useEffect, useMemo } from 'react';
import { Order } from '@/types/order';
import { OrderStore } from '@/lib/orderStore';

export const useOrders = (pollingInterval: number = 2000) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = () => {
      setOrders(OrderStore.getAll());
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  const pendingOrders = useMemo(() =>
    orders.filter(o => o.status === 'pending'),
    [orders]
  );

  const confirmedOrders = useMemo(() =>
    orders.filter(o => o.status === 'confirmed'),
    [orders]
  );

  const preparingOrders = useMemo(() =>
    orders.filter(o => o.status === 'preparing'),
    [orders]
  );

  const readyOrders = useMemo(() =>
    orders.filter(o => o.status === 'ready'),
    [orders]
  );

  return {
    orders,
    pendingOrders,
    confirmedOrders,
    preparingOrders,
    readyOrders
  };
};