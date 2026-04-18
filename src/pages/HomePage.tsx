import { useState } from 'react';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useParts } from '@/hooks/useParts';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { OrderDetailModal } from '@/components/OrderDetailModal';
import { generateOrderPDF } from '@/utils/generateOrderPDF';
import '../styles/home.css';

const getStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    pending: 'Pendente',
    in_progress: 'Em Andamento',
    waiting_part: 'Aguardando Peça',
    completed: 'Concluída',
  };
  return labels[status] || status;
};

const getPriorityLabel = (priority: string) => {
  const labels: { [key: string]: string } = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };
  return labels[priority] || priority;
};

export function HomePage() {
  const { orders, loading, updateOrder } = useServiceOrders();
  const { decreasePartQuantity } = useParts();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleFinalizeOrder = (order: any) => {
    if (order.status === 'completed') {
      alert('Esta ordem já foi finalizada!');
      return;
    }

    if (confirm('Tem certeza que deseja finalizar esta OS? As peças serão debitadas do estoque.')) {
      try {
        // Decrease parts quantity
        if (order.parts && order.parts.length > 0) {
          order.parts.forEach((part: any) => {
            decreasePartQuantity(part.id, part.quantity);
          });
        }

        // Update order status to completed
        const updatedOrder = {
          ...order,
          status: 'completed',
        };
        updateOrder(updatedOrder);
        alert('OS finalizada com sucesso! As peças foram debitadas do estoque.');
      } catch (error) {
        alert('Erro ao finalizar a ordem');
      }
    }
  };

  const handleExportPDF = (order: any) => {
    try {
      generateOrderPDF(order);
    } catch (error) {
      alert('Erro ao gerar PDF');
    }
  };

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
        <button onClick={() => window.location.href = '/orders'} className="action-button primary">
          Nova Ordem de Serviço
        </button>
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
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>OS</th>
                  <th>Cliente</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Prioridade</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)} className="clickable-row">
                    <td>{order.osNumber}</td>
                    <td>{order.clientName}</td>
                    <td>{order.briefDescription}</td>
                    <td>{order.category || 'N/A'}</td>
                    <td><span className={`status-badge ${order.status}`}>{getStatusLabel(order.status)}</span></td>
                    <td><span className={`priority-badge ${order.priority}`}>{getPriorityLabel(order.priority)}</span></td>
                    <td>R$ {order.value.toFixed(2)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={(updatedOrder) => {
            updateOrder(updatedOrder);
            setSelectedOrder(null);
          }}
          onFinalize={handleFinalizeOrder}
          onExportPDF={handleExportPDF}
        />
      )}
    </div>
  );
}
