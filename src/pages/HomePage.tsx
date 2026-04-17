import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import '../styles/home.css';

export function HomePage() {
  const { orders, loading } = useServiceOrders();
  const { user } = useAuth();

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalValue: orders.reduce((sum, o) => sum + o.value, 0),
  };

  if (loading) {
    return <div className="home-loading">Carregando...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user?.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total de OS</div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pendentes</div>
          <div className="stat-value pending">{stats.pending}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Em Andamento</div>
          <div className="stat-value inProgress">{stats.inProgress}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Concluídas</div>
          <div className="stat-value completed">{stats.completed}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Valor Total</div>
          <div className="stat-value">R$ {stats.totalValue.toFixed(2)}</div>
        </div>
      </div>

      <div className="actions-section">
        <Link to="/orders/create" className="action-button primary">
          Nova Ordem de Serviço
        </Link>
        <Link to="/orders" className="action-button secondary">
          Ver Todas as OS
        </Link>
        <Link to="/stock" className="action-button secondary">
          Gerenciar Estoque
        </Link>
        <Link to="/parts" className="action-button secondary">
          Catálogo de Peças
        </Link>
      </div>

      <div className="recent-orders">
        <h2>Ordens Recentes</h2>
        {orders.length === 0 ? (
          <p className="empty-state">Nenhuma ordem de serviço criada ainda</p>
        ) : (
          <div className="orders-list">
            {orders.slice(0, 5).map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="order-item">
                <div className="order-number">OS #{order.osNumber}</div>
                <div className="order-client">{order.clientName}</div>
                <div className={`order-status ${order.status}`}>{order.status}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
