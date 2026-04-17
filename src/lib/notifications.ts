import { ServiceOrder } from '@/types';

export interface AppNotification {
  id: string;
  type: 'order_created' | 'order_completed' | 'stock_low' | 'stock_critical' | 'pending_reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  relatedOrderId?: string;
  relatedPartId?: string;
}

const STORAGE_KEY = 'mamed_notifications';

/**
 * Get all notifications from localStorage
 */
export function getNotifications(): AppNotification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a new notification
 */
export function addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
  const notifications = getNotifications();
  const newNotification: AppNotification = {
    ...notification,
    id: `notif_${Date.now()}`,
    timestamp: new Date(),
    read: false,
  };
  
  notifications.unshift(newNotification);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  
  return newNotification;
}

/**
 * Mark notification as read
 */
export function markAsRead(id: string): void {
  const notifications = getNotifications();
  const updated = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Delete notification
 */
export function deleteNotification(id: string): void {
  const notifications = getNotifications();
  const updated = notifications.filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get unread count
 */
export function getUnreadCount(): number {
  return getNotifications().filter(n => !n.read).length;
}

/**
 * Get notifications for a specific order
 */
export function getOrderNotifications(orderId: string): AppNotification[] {
  return getNotifications().filter(n => n.relatedOrderId === orderId);
}

/**
 * Create notification for new order
 */
export function notifyOrderCreated(order: ServiceOrder): AppNotification {
  return addNotification({
    type: 'order_created',
    title: 'Nova Ordem de Serviço',
    message: `OS #${order.osNumber} criada para ${order.clientName}`,
    relatedOrderId: order.id,
  });
}

/**
 * Create notification for completed order
 */
export function notifyOrderCompleted(order: ServiceOrder): AppNotification {
  return addNotification({
    type: 'order_completed',
    title: 'Ordem Concluída',
    message: `OS #${order.osNumber} foi marcada como concluída`,
    relatedOrderId: order.id,
  });
}

/**
 * Create notification for low stock
 */
export function notifyStockLow(partName: string, currentStock: number): AppNotification {
  return addNotification({
    type: 'stock_low',
    title: 'Estoque Baixo',
    message: `${partName} com apenas ${currentStock} unidades em estoque`,
  });
}

/**
 * Create notification for critical stock
 */
export function notifyStockCritical(partName: string): AppNotification {
  return addNotification({
    type: 'stock_critical',
    title: 'Estoque Crítico',
    message: `${partName} está fora de estoque!`,
  });
}

/**
 * Create notification for pending orders reminder
 */
export function notifyPendingReminder(pendingCount: number): AppNotification {
  return addNotification({
    type: 'pending_reminder',
    title: 'Ordens Pendentes',
    message: `Você tem ${pendingCount} ordem${pendingCount !== 1 ? 's' : ''} pendente${pendingCount !== 1 ? 's' : ''}`,
  });
}

/**
 * Check for pending orders and create reminder if needed
 */
export function checkPendingOrders(orders: ServiceOrder[]): void {
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  
  if (pendingCount > 0) {
    // Check if we already have a recent pending reminder
    const recentReminder = getNotifications().find(
      n => n.type === 'pending_reminder' && 
      (Date.now() - new Date(n.timestamp).getTime()) < 3600000 // 1 hour
    );
    
    if (!recentReminder) {
      notifyPendingReminder(pendingCount);
    }
  }
}

/**
 * Check for low stock items
 */
export function checkLowStock(stocks: Array<{ name: string; current: number; minimum: number }>): void {
  stocks.forEach(stock => {
    if (stock.current === 0) {
      notifyStockCritical(stock.name);
    } else if (stock.current <= stock.minimum) {
      notifyStockLow(stock.name, stock.current);
    }
  });
}
