import { useState } from 'react';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { generateServiceOrderPDF, generateServiceOrdersExcel, generateBackupZip, generateSummaryStats } from '@/lib/reports';
import '../styles/reports.css';

export function ReportsPage() {
  const { orders, loading } = useServiceOrders();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = generateSummaryStats(orders);

  const handleGeneratePDF = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      generateServiceOrderPDF(order);
    }
  };

  const handleGenerateExcel = () => {
    setIsGenerating(true);
    try {
      generateServiceOrdersExcel(orders);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBackup = async () => {
    setIsGenerating(true);
    try {
      // Mock parts data - in real app would come from API
      const parts = [];
      await generateBackupZip(orders, parts);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <div className="reports-loading">Carregando...</div>;
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Relatórios e Backups</h1>
        <p>Gere relatórios em PDF, Excel e backups completos do sistema</p>
      </div>

      {/* Summary Statistics */}
      <div className="reports-stats">
        <div className="stat-card">
          <div className="stat-label">Total de OS</div>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pendentes</div>
          <div className="stat-value warning">{stats.pendingOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Em Andamento</div>
          <div className="stat-value">{stats.inProgressOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Concluídas</div>
          <div className="stat-value success">{stats.completedOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valor Total</div>
          <div className="stat-value">R$ {stats.totalValue.toFixed(2)}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="reports-section">
        <h2>Ações Rápidas</h2>
        <div className="actions-grid">
          <button
            onClick={handleGenerateExcel}
            disabled={isGenerating || orders.length === 0}
            className="action-btn primary"
          >
            📊 Exportar Excel
          </button>
          <button
            onClick={handleGenerateBackup}
            disabled={isGenerating || orders.length === 0}
            className="action-btn primary"
          >
            💾 Gerar Backup ZIP
          </button>
        </div>
      </div>

      {/* Individual Order PDFs */}
      <div className="reports-section">
        <h2>Relatórios Individuais</h2>
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma ordem de serviço para gerar relatório</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-report-item">
                <div className="order-info">
                  <div className="order-number">OS #{order.osNumber}</div>
                  <div className="order-client">{order.clientName}</div>
                  <div className="order-description">{order.briefDescription}</div>
                </div>
                <div className="order-meta">
                  <div className="order-value">R$ {typeof order.value === 'number' ? order.value.toFixed(2) : order.value}</div>
                  <div className={`order-status ${order.status}`}>
                    {order.status === 'pending' && 'Pendente'}
                    {order.status === 'in_progress' && 'Em Andamento'}
                    {order.status === 'waiting_part' && 'Aguardando Peça'}
                    {order.status === 'completed' && 'Concluída'}
                  </div>
                </div>
                <button
                  onClick={() => handleGeneratePDF(order.id)}
                  className="btn-pdf"
                >
                  📄 PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Information */}
      <div className="reports-section info-section">
        <h2>Informações sobre Exportações</h2>
        <div className="info-box">
          <h3>📊 Exportar Excel</h3>
          <p>Cria um arquivo Excel com todas as ordens de serviço, incluindo:</p>
          <ul>
            <li>Número da OS</li>
            <li>Cliente</li>
            <li>Descrição</li>
            <li>Status</li>
            <li>Valor</li>
            <li>Data</li>
          </ul>
        </div>

        <div className="info-box">
          <h3>💾 Backup ZIP</h3>
          <p>Cria um arquivo compactado com backup completo do sistema:</p>
          <ul>
            <li>orders.json - Dados completos de todas as OS</li>
            <li>parts.json - Dados de todas as peças</li>
            <li>orders.xlsx - Relatório em Excel</li>
            <li>README.txt - Instruções de restauração</li>
          </ul>
        </div>

        <div className="info-box">
          <h3>📄 PDF Individual</h3>
          <p>Gera um PDF profissional para cada ordem de serviço com:</p>
          <ul>
            <li>Informações da ordem</li>
            <li>Dados do cliente</li>
            <li>Descrição do serviço</li>
            <li>Peças utilizadas</li>
            <li>Valor total</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
