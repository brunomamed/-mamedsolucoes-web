import { useState } from 'react';
import '../styles/parts.css';

export function PartsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Integrate with useParts hook
  const parts = [];

  return (
    <div className="parts-container">
      <div className="parts-header">
        <h1>Catálogo de Peças</h1>
        <button className="btn-primary">Nova Peça</button>
      </div>

      <div className="parts-filters">
        <input
          type="text"
          placeholder="Buscar por código ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
      </div>

      {parts.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma peça cadastrada</p>
        </div>
      ) : (
        <div className="parts-grid">
          {/* Parts will be mapped here */}
        </div>
      )}
    </div>
  );
}
