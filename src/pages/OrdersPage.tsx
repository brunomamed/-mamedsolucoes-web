import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import '../styles/orders.css';

export function OrdersPage() {
  const { orders, loading, deleteOrder } = useServiceOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.briefDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.osNumber.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || order.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta ordem?')) {
      try {
        await deleteOrder(id);
      } catch (error) {
        alert('Erro ao deletar ordem');
      }
    }
  };

  if (loading) {
    return <div className="orders-loading">Carregando...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Ordens de Serviço</h1>
        <Link to="/orders/create" className="btn-primary">
          Nova Ordem
        </Link>
      </div>

      <div className="orders-filters">
        <input
          type="text"
          placeholder="Buscar por cliente, descrição ou número..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Andamento</option>
          <option value="waiting_part">Aguardando Peça</option>
          <option value="completed">Concluída</option>
        </select>

        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
          <option value="all">Todas as Categorias</option>
          <option value="elétrica">Elétrica</option>
          <option value="refrigeração">Refrigeração</option>
          <option value="hidráulica">Hidráulica</option>
          <option value="mecânica">Mecânica</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma ordem encontrada</p>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>OS #</th>
                <th>Cliente</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-number">#{order.osNumber}</td>
                  <td>{order.clientName}</td>
                  <td>{order.briefDescription}</td>
                  <td className="category">{order.category || '-'}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status === 'pending' && 'Pendente'}
                      {order.status === 'in_progress' && 'Em Andamento'}
                      {order.status === 'waiting_part' && 'Aguardando Peça'}
                      {order.status === 'completed' && 'Concluída'}
                    </span>
                  </td>
                  <td>R$ {order.value.toFixed(2)}</td>
                  <td>{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                  <td className="actions">
                    <Link to={`/orders/${order.id}`} className="btn-icon">Ver</Link>
                    <Link to={`/orders/${order.id}/edit`} className="btn-icon">Editar</Link>
                    <button onClick={() => handleDelete(order.id)} className="btn-icon danger">Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
