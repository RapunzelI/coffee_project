import { Order } from '@/types/order';

let ordersDB: Order[] = [];

export const OrderStore = {
  getAll: () => [...ordersDB],
  
  add: (order: Order) => {
    ordersDB.push(order);
    return order;
  },
  
  update: (id: string, updates: Partial<Order>) => {
    const index = ordersDB.findIndex(o => o.id === id);
    if (index !== -1) {
      ordersDB[index] = { ...ordersDB[index], ...updates };
      return ordersDB[index];
    }
    return null;
  },
  
  findById: (id: string) => {
    return ordersDB.find(o => o.id === id);
  },
  
  clear: () => {
    ordersDB = [];
  }
};