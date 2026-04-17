import { useState } from 'react';
import '../styles/stock.css';

export function StockPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // TODO: Integrate with useStock hook
  const parts = [];

  return (
    <div className="stock-container">
      <div className="stock-header">
        <h1>Gerenciamento de Estoque</h1>
        <button className="btn-primary">Registrar Movimentação</button>
      </div>

      <div className="stock-stats">
        <div className="stat-card">
          <div className="stat-label">Total de Peças</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Em Falta</div>
          <div className="stat-value error">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Estoque Baixo</div>
          <div className="stat-value warning">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valor Total</div>
          <div className="stat-value">R$ 0,00</div>
        </div>
      </div>

      <div className="stock-filters">
        <input
          type="text"
          placeholder="Buscar peça..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="all">Todos os Status</option>
          <option value="ok">OK</option>
          <option value="low">Baixo</option>
          <option value="critical">Em Falta</option>
        </select>
      </div>

      {parts.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma peça no estoque</p>
        </div>
      ) : (
        <div className="stock-table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Peça</th>
                <th>Código</th>
                <th>Estoque Atual</th>
                <th>Mínimo</th>
                <th>Status</th>
                <th>Valor Unit.</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Parts will be mapped here */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
