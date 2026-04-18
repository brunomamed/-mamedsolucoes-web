import { useState } from 'react';
import { useParts } from '@/hooks/useParts';
import '../styles/stock.css';

export function StockPage() {
  const { parts, updatePartQuantity } = useParts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const filteredParts = parts.filter(part => {
    const matchesSearch = 
      part.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'critical') {
      matchesStatus = part.quantity === 0;
    } else if (filterStatus === 'low') {
      matchesStatus = part.quantity > 0 && part.quantity <= 5;
    } else if (filterStatus === 'ok') {
      matchesStatus = part.quantity > 5;
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalParts = parts.reduce((sum, part) => sum + part.quantity, 0);
  const criticalParts = parts.filter(part => part.quantity === 0).length;
  const lowStockParts = parts.filter(part => part.quantity > 0 && part.quantity <= 5).length;
  const totalValue = parts.reduce((sum, part) => sum + part.value * part.quantity, 0);

  const handleEditQuantity = (part: any) => {
    setEditingId(part.id);
    setEditQuantity(part.quantity);
  };

  const handleSaveQuantity = async (partId: string) => {
    try {
      const part = parts.find(p => p.id === partId);
      if (part) {
        await updatePartQuantity(partId, editQuantity);
        setEditingId(null);
      }
    } catch (error) {
      alert('Erro ao atualizar quantidade');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuantity(0);
  };

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return <span className="status-badge critical">Em Falta</span>;
    } else if (quantity <= 5) {
      return <span className="status-badge warning">Baixo</span>;
    } else {
      return <span className="status-badge ok">OK</span>;
    }
  };

  return (
    <div className="stock-container">
      <div className="stock-header">
        <h1>Gerenciamento de Estoque</h1>
      </div>

      <div className="stock-stats">
        <div className="stat-card">
          <div className="stat-label">Total de Peças</div>
          <div className="stat-value">{totalParts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Em Falta</div>
          <div className="stat-value error">{criticalParts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Estoque Baixo</div>
          <div className="stat-value warning">{lowStockParts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valor Total</div>
          <div className="stat-value">R$ {totalValue.toFixed(2)}</div>
        </div>
      </div>

      <div className="stock-filters">
        <input
          type="text"
          placeholder="Buscar por código ou descrição..."
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

      {filteredParts.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma peça encontrada</p>
        </div>
      ) : (
        <div className="stock-table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Status</th>
                <th>Valor Unit.</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map(part => (
                <tr key={part.id}>
                  <td className="code">{part.code}</td>
                  <td className="description">{part.description}</td>
                  <td className="category">{part.category}</td>
                  <td className="quantity">
                    {editingId === part.id ? (
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(parseInt(e.target.value))}
                        min="0"
                        className="qty-input"
                        autoFocus
                      />
                    ) : (
                      part.quantity
                    )}
                  </td>
                  <td>{getStatusBadge(part.quantity)}</td>
                  <td className="value">R$ {part.value.toFixed(2)}</td>
                  <td className="value-total">R$ {(part.value * part.quantity).toFixed(2)}</td>
                  <td className="actions">
                    {editingId === part.id ? (
                      <>
                        <button
                          onClick={() => handleSaveQuantity(part.id)}
                          className="btn-save"
                          title="Salvar"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-cancel"
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditQuantity(part)}
                        className="btn-edit"
                        title="Editar quantidade"
                      >
                        ✏️
                      </button>
                    )}
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
