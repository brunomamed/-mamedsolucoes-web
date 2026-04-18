import { useState, useCallback } from 'react';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useParts } from '@/hooks/useParts';
import { OrderDetailModal } from '@/components/OrderDetailModal';
import { generateOrderPDF } from '@/utils/generateOrderPDF';
import '../styles/orders.css';

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

export function OrdersPage() {
  const { orders, loading, createOrder, deleteOrder, updateOrder } = useServiceOrders();
  const { parts, searchParts, decreasePartQuantity } = useParts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchParts_, setSearchParts_] = useState('');
  const [showPartsSuggestions, setShowPartsSuggestions] = useState(false);
  const [selectedPartQuantity, setSelectedPartQuantity] = useState(1);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    briefDescription: '',
    detailedDescription: '',
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    comments: '',
    category: 'outros',
    status: 'pending',
    priority: 'medium',
    value: 0,
    photos: [] as string[],
    parts: [] as Array<{ id: string; code: string; description: string; quantity: number; value: number }>,
  });

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photos: [...formData.photos, reader.result as string],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index),
    });
  };

  const handleAddPart = () => {
    if (!selectedPartId || selectedPartQuantity <= 0) {
      alert('Selecione uma peça e defina a quantidade');
      return;
    }

    const selectedPart = parts.find(p => p.id === selectedPartId);
    if (!selectedPart) return;

    const existingPart = formData.parts.find(p => p.id === selectedPartId);
    
    if (existingPart) {
      setFormData({
        ...formData,
        parts: formData.parts.map(p =>
          p.id === selectedPartId ? { ...p, quantity: p.quantity + selectedPartQuantity } : p
        ),
      });
    } else {
      setFormData({
        ...formData,
        parts: [...formData.parts, { ...selectedPart, quantity: selectedPartQuantity }],
      });
    }
    
    setSearchParts_('');
    setShowPartsSuggestions(false);
    setSelectedPartId(null);
    setSelectedPartQuantity(1);
  };

  const handleRemovePart = (partId: string) => {
    setFormData({
      ...formData,
      parts: formData.parts.filter(p => p.id !== partId),
    });
  };

  const handleSelectPart = (part: any) => {
    setSelectedPartId(part.id);
    setSearchParts_(part.code);
    setShowPartsSuggestions(false);
  };

  const handlePartQuantityChange = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemovePart(partId);
      return;
    }
    
    setFormData({
      ...formData,
      parts: formData.parts.map(p =>
        p.id === partId ? { ...p, quantity } : p
      ),
    });
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.briefDescription || !formData.clientName) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Create order first
      await createOrder({
        briefDescription: formData.briefDescription,
        detailedDescription: formData.detailedDescription,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientAddress: formData.clientAddress,
        comments: formData.comments,
        category: formData.category,
        status: formData.status,
        priority: formData.priority,
        value: formData.value,
        photos: formData.photos,
        parts: formData.parts,
      });

      // Then decrease stock for each part used
      for (const part of formData.parts) {
        try {
          await decreasePartQuantity(part.id, part.quantity);
        } catch (error) {
          alert(`Aviso: Ordem criada mas erro ao descontar ${part.description}`);
        }
      }

      alert('Ordem criada com sucesso!');
      setFormData({
        briefDescription: '',
        detailedDescription: '',
        clientName: '',
        clientPhone: '',
        clientAddress: '',
        comments: '',
        category: 'outros',
        status: 'pending',
        priority: 'medium',
        value: 0,
        photos: [],
        parts: [],
      });
      setShowCreateForm(false);
    } catch (error) {
      alert('Erro ao criar ordem');
    }
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setFormData({
      briefDescription: '',
      detailedDescription: '',
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      comments: '',
      category: 'outros',
      status: 'pending',
      priority: 'medium',
      value: 0,
      photos: [],
      parts: [],
    });
    setSearchParts_('');
  };

  const partSuggestions = searchParts(searchParts_);

  if (loading) {
    return <div className="orders-loading">Carregando...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Ordens de Serviço</h1>
        {!showCreateForm && (
          <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
            Nova Ordem
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="create-form-container">
          <form onSubmit={handleCreateOrder} className="create-form">
            <h2>Nova Ordem de Serviço</h2>

            {/* Descrição da Ordem */}
            <div className="form-section">
              <h3>Descrição da Ordem</h3>

              <div className="form-group">
                <label>Descrição *</label>
                <input
                  type="text"
                  value={formData.briefDescription}
                  onChange={(e) => setFormData({ ...formData, briefDescription: e.target.value })}
                  placeholder="Resumo do serviço"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição Detalhada</label>
                <textarea
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  placeholder="Detalhes completos do serviço"
                  rows={4}
                />
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="form-section">
              <h3>Dados do Cliente</h3>
              
              <div className="form-group">
                <label>Nome do Cliente *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="form-group">
                  <label>Endereço</label>
                  <input
                    type="text"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                    placeholder="Rua, número, cidade"
                  />
                </div>
              </div>
            </div>

            {/* Peças */}
            <div className="form-section">
              <h3>Peças Utilizadas</h3>
              <p className="form-section-info">Busque a peça por código, defina a quantidade e clique em Adicionar.</p>

              <div className="parts-selection-container">
                <div className="form-group">
                  <label>Buscar Peça por Código</label>
                  <div className="search-parts-container">
                    <input
                      type="text"
                      value={searchParts_}
                      onChange={(e) => {
                        setSearchParts_(e.target.value);
                        setShowPartsSuggestions(true);
                        setSelectedPartId(null);
                      }}
                      onFocus={() => setShowPartsSuggestions(true)}
                      placeholder="Digite o código da peça..."
                    />
                    
                    {showPartsSuggestions && searchParts_.length > 0 && (
                      <div className="parts-suggestions">
                        {partSuggestions.length > 0 ? (
                          partSuggestions.map(part => (
                            <div
                              key={part.id}
                              className={`suggestion-item ${selectedPartId === part.id ? 'selected' : ''}`}
                              onClick={() => handleSelectPart(part)}
                            >
                              <div className="suggestion-code">{part.code}</div>
                              <div className="suggestion-desc">{part.description}</div>
                              <div className="suggestion-qty">Est: {part.quantity}</div>
                            </div>
                          ))
                        ) : (
                          <div className="suggestion-item disabled">
                            Nenhuma peça encontrada
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantidade</label>
                    <input
                      type="number"
                      value={selectedPartQuantity}
                      onChange={(e) => setSelectedPartQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      placeholder="1"
                      className="qty-input-form"
                    />
                  </div>

                  <div className="form-group">
                    <label>&nbsp;</label>
                    <button
                      type="button"
                      onClick={handleAddPart}
                      className="btn-add-part"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {formData.parts.length > 0 && (
                <div className="parts-list">
                  <div className="parts-table-wrapper">
                    <table className="parts-table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Descrição</th>
                          <th>Valor Unit.</th>
                          <th>Qtd Utilizada</th>
                          <th>Total</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.parts.map(part => (
                          <tr key={part.id}>
                            <td>{part.code}</td>
                            <td>{part.description}</td>
                            <td>R$ {part.value.toFixed(2)}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                value={part.quantity}
                                onChange={(e) => handlePartQuantityChange(part.id, parseInt(e.target.value))}
                                className="qty-input"
                              />
                            </td>
                            <td>R$ {(part.value * part.quantity).toFixed(2)}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleRemovePart(part.id)}
                                className="btn-icon danger"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Fotos */}
            <div className="form-section">
              <h3>Fotos da Ordem</h3>

              <div className="form-group">
                <label>Adicionar Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>

              {formData.photos.length > 0 && (
                <div className="photos-grid">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo} alt={`Foto ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="btn-remove-photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comentários */}
            <div className="form-section">
              <h3>Comentários</h3>
              <div className="form-group">
                <label>Anotações Adicionais</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Adicione observações, instruções especiais ou notas sobre a ordem..."
                  rows={4}
                />
              </div>
            </div>

            {/* Detalhes da Ordem */}
            <div className="form-section">
              <h3>Detalhes da Ordem</h3>

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
                  <label>Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Criar Ordem
              </button>
              <button type="button" onClick={handleCancelForm} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="orders-filters">
        <input
          type="text"
          placeholder="Buscar por cliente, descrição ou número..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
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

      {/* Tabela de Ordens */}
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} onClick={() => setSelectedOrder(order)} className="clickable-row">
                <td>{order.osNumber}</td>
                <td>{order.clientName}</td>
                <td>{order.briefDescription}</td>
                <td>{order.category || 'N/A'}</td>
                <td><span className={`status-badge ${order.status}`}>{getStatusLabel(order.status)}</span></td>
                <td><span className={`priority-badge ${order.priority}`}>{getPriorityLabel(order.priority)}</span></td>
                <td>R$ {order.value.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(order.id);
                    }}
                    className="btn-icon danger"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={(updatedOrder) => {
            updateOrder(updatedOrder);
            setSelectedOrder(null);
          }}
          onFinalize={(order) => {
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
                setSelectedOrder(null);
                alert('OS finalizada com sucesso! As peças foram debitadas do estoque.');
              } catch (error) {
                alert('Erro ao finalizar a ordem');
              }
            }
          }}
          onExportPDF={(order) => {
            try {
              generateOrderPDF(order);
            } catch (error) {
              alert('Erro ao gerar PDF');
            }
          }}
        />
      )}
    </div>
  );
}
