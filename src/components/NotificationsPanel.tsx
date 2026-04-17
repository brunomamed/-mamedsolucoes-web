import { useState, useEffect } from 'react';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
} from '@/lib/notifications';
import '../styles/notifications.css';

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const notifs = getNotifications();
    setNotifications(notifs);
    setUnreadCount(getUnreadCount());
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    loadNotifications();
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    loadNotifications();
  };

  const handleClearAll = () => {
    if (confirm('Deseja limpar todas as notificações?')) {
      clearAllNotifications();
      loadNotifications();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_created':
        return '📋';
      case 'order_completed':
        return '✅';
      case 'stock_low':
        return '⚠️';
      case 'stock_critical':
        return '🚨';
      case 'pending_reminder':
        return '🔔';
      default:
        return '📌';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_created':
        return 'info';
      case 'order_completed':
        return 'success';
      case 'stock_low':
        return 'warning';
      case 'stock_critical':
        return 'error';
      case 'pending_reminder':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="notifications-panel">
      <button
        className="notifications-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notificações"
      >
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notificações</h3>
            <div className="notifications-actions">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} className="action-link">
                  Marcar tudo como lido
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={handleClearAll} className="action-link danger">
                  Limpar tudo
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="notifications-empty">
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notification-item ${getNotificationColor(notif.type)} ${
                    notif.read ? 'read' : 'unread'
                  }`}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notif.title}</div>
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-time">
                      {new Date(notif.timestamp).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                  <div className="notification-actions">
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="action-btn"
                        title="Marcar como lido"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="action-btn delete"
                      title="Deletar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
