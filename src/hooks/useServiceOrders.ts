import { useState, useCallback, useEffect } from 'react';
import { ServiceOrder } from '@/types';
import { apiClient } from '@/lib/api';

export function useServiceOrders() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getServiceOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const createOrder = useCallback(async (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt' | 'osNumber'>) => {
    try {
      const newOrder = await apiClient.createServiceOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
      throw err;
    }
  }, []);

  const updateOrder = useCallback(async (id: string, orderData: Partial<ServiceOrder>) => {
    try {
      const updated = await apiClient.updateServiceOrder(id, orderData);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      setError(message);
      throw err;
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    try {
      await apiClient.deleteServiceOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      setError(message);
      throw err;
    }
  }, []);

  const getOrderById = useCallback((id: string) => {
    return orders.find(o => o.id === id) || null;
  }, [orders]);

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
