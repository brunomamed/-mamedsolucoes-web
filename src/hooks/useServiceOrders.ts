import { useState, useCallback, useEffect } from 'react';
import { ServiceOrder } from '@/types';

// Mock data for demo
const MOCK_ORDERS: ServiceOrder[] = [
  {
    id: '1',
    osNumber: 1001,
    clientName: 'João Silva',
    briefDescription: 'Manutenção de ar condicionado',
    category: 'refrigeração',
    status: 'completed',
    priority: 'high',
    value: 500,
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-10'),
  },
  {
    id: '2',
    osNumber: 1002,
    clientName: 'Maria Santos',
    briefDescription: 'Reparo de geladeira',
    category: 'refrigeração',
    status: 'in_progress',
    priority: 'medium',
    value: 350,
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15'),
  },
  {
    id: '3',
    osNumber: 1003,
    clientName: 'Pedro Costa',
    briefDescription: 'Instalação de fiação elétrica',
    category: 'elétrica',
    status: 'pending',
    priority: 'high',
    value: 800,
    createdAt: new Date('2024-04-16'),
    updatedAt: new Date('2024-04-16'),
  },
];

export function useServiceOrders() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    try {
      setLoading(true);
      // Try to load from localStorage
      const stored = localStorage.getItem('service_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // Use mock data on first load
        setOrders(MOCK_ORDERS);
        localStorage.setItem('service_orders', JSON.stringify(MOCK_ORDERS));
      }
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const createOrder = useCallback(
    async (orderData: any) => {
      try {
        const newOrder: any = {
          ...orderData,
          id: Date.now().toString(),
          osNumber: Math.floor(Math.random() * 10000) + 1000,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('pt-BR'),
          photos: orderData.photos || [],
          parts: orderData.parts || [],
          comments: orderData.comments || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updated = [...orders, newOrder];
        setOrders(updated);
        localStorage.setItem('service_orders', JSON.stringify(updated));
        return newOrder;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create order';
        setError(message);
        throw err;
      }
    },
    [orders]
  );

  const updateOrder = useCallback(
    async (orderData: any) => {
      try {
        const id = orderData.id;
        const updated = orders.map(o =>
          o.id === id
            ? {
                ...o,
                ...orderData,
                updatedAt: new Date(),
              }
            : o
        );
        setOrders(updated);
        localStorage.setItem('service_orders', JSON.stringify(updated));
        return updated.find(o => o.id === id)!;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update order';
        setError(message);
        throw err;
      }
    },
    [orders]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      try {
        const updated = orders.filter(o => o.id !== id);
        setOrders(updated);
        localStorage.setItem('service_orders', JSON.stringify(updated));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete order';
        setError(message);
        throw err;
      }
    },
    [orders]
  );

  const getOrderById = useCallback(
    (id: string) => {
      return orders.find(o => o.id === id) || null;
    },
    [orders]
  );

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    loadOrders,
    getOrderById,
  };
}
