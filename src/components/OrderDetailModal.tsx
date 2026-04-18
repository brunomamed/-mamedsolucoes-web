import { useState } from 'react';
import '../styles/order-detail-modal.css';

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
  onUpdate: (updatedOrder: any) => void;
  onFinalize?: (order: any) => void;
  onExportPDF?: (order: any) => void;
}

export function OrderDetailModal({ order, onClose, onUpdate, onFinalize, onExportPDF }: OrderDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    clientName: order.clientName,
    clientPhone: order.clientPhone || '',
    clientAddress: order.clientAddress || '',
    briefDescription: order.briefDescription,
    detailedDescription: order.detailedDescription || '',
    category: order.category,
    status: order.status,
    value: order.value,
    priority: order.priority,
    comments: order.comments || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...order,
      ...formData,
    });
    setIsEditing(false);
  };

  const statusLabel = {
    pending: 'Pendente',
    in_progress: 'Em Andamento',
    waiting_part: 'Aguardando Peça',
    completed: 'Concluída',
  }[order.status] || order.status;

  const priorityLabel = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente',
  }[order.priority] || order.priority;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ordem #{order.osNumber}</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        {!isEditing ? (
          <div className="modal-body">
            <div className="detail-section">
              <h3>Informações Gerais</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Cliente:</label>
                  <p>{order.clientName}</p>
                </div>
                <div className="detail-item">
                  <label>Data:</label>
                  <p>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="detail-item">
                  <label>Categoria:</label>
                  <p className="category-badge">{order.category}</p>
                </div>
                <div className="detail-item">
                  <label>Prioridade:</label>
                  <p className={`priority-badge ${order.priority}`}>{priorityLabel}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Descrição Breve</h3>
              <p>{order.briefDescription}</p>
            </div>

            {order.detailedDescription && (
              <div className="detail-section">
                <h3>Descrição Detalhada</h3>
                <p>{order.detailedDescription}</p>
              </div>
            )}

            {(order.clientPhone || order.clientAddress) && (
              <div className="detail-section">
                <h3>Dados do Cliente</h3>
                <div className="detail-grid">
                  {order.clientPhone && (
                    <div className="detail-item">
                      <label>Telefone:</label>
                      <p>{order.clientPhone}</p>
                    </div>
                  )}
                  {order.clientAddress && (
                    <div className="detail-item">
                      <label>Endereço:</label>
                      <p>{order.clientAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="detail-section">
              <h3>Status e Valor</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Status:</label>
                  <p>
                    <span className={`status-badge ${order.status}`}>
                      {statusLabel}
                    </span>
                  </p>
                </div>
                <div className="detail-item">
                  <label>Valor:</label>
                  <p className="value">R$ {order.value.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {order.comments && (
              <div className="detail-section">
                <h3>Comentários</h3>
                <p>{order.comments}</p>
              </div>
            )}

            <div className="modal-actions">
              {order.status !== 'completed' && (
                <button 
                  onClick={() => {
                    if (onFinalize) {
                      onFinalize(order);
                      onClose();
                    }
                  }} 
                  className="btn-finalize"
                >
                  ✓ Finalizar OS
                </button>
              )}
              <button 
                onClick={() => {
                  if (onExportPDF) {
                    onExportPDF(order);
                  }
                }} 
                className="btn-export"
              >
                📄 Exportar PDF
              </button>
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Editar
              </button>
              <button onClick={onClose} className="btn-secondary">
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Cliente *</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição Breve *</label>
              <input
                type="text"
                value={formData.briefDescription}
                onChange={(e) => setFormData({ ...formData, briefDescription: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição Detalhada</label>
              <textarea
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Telefone do Cliente</label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="form-group">
                <label>Endereço do Cliente</label>
                <input
                  type="text"
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                  placeholder="Rua, número, cidade"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Comentários</label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                rows={3}
                placeholder="Adicione comentários sobre a ordem de serviço"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="elétrica">Elétrica</option>
                  <option value="refrigeração">Refrigeração</option>
                  <option value="hidráulica">Hidráulica</option>
                  <option value="mecânica">Mecânica</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="waiting_part">Aguardando Peça</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Valor (R$)</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-primary">
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
