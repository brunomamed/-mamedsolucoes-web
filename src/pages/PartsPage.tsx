import { useState } from 'react';
import { useParts } from '@/hooks/useParts';
import { PartDetailModal } from '@/components/PartDetailModal';
import '../styles/parts.css';

export function PartsPage() {
  const { parts, loading, createPart, updatePart, deletePart } = useParts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    value: 0,
    quantity: 0,
    category: 'outros',
    photo: '',
  });

  const filteredParts = parts.filter(part =>
    part.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.description) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingId) {
        await updatePart(editingId, formData);
        alert('Peça atualizada com sucesso!');
      } else {
        await createPart(formData);
        alert('Peça cadastrada com sucesso!');
      }

      setFormData({
        code: '',
        description: '',
        value: 0,
        quantity: 0,
        category: 'outros',
        photo: '',
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      alert('Erro ao salvar peça');
    }
  };

  const handleEdit = (part: any) => {
    setFormData({
      code: part.code,
      description: part.description,
      value: part.value,
      quantity: part.quantity,
      category: part.category,
      photo: part.photo || '',
    });
    setEditingId(part.id);
    setShowForm(true);
  };

  const handleRowClick = (part: any) => {
    setSelectedPart(part);
  };

  const handleUpdatePart = (updatedPart: any) => {
    updatePart(updatedPart.id, {
      code: updatedPart.code,
      description: updatedPart.description,
      quantity: updatedPart.quantity,
      category: updatedPart.category,
    });
    setSelectedPart(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta peça?')) {
      try {
        await deletePart(id);
        alert('Peça deletada com sucesso!');
      } catch (error) {
        alert('Erro ao deletar peça');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      code: '',
      description: '',
      value: 0,
      quantity: 0,
      category: 'outros',
      photo: '',
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="parts-loading">Carregando...</div>;
  }

  const totalValue = parts.reduce((sum, part) => sum + part.value * part.quantity, 0);
  const totalQuantity = parts.reduce((sum, part) => sum + part.quantity, 0);

  return (
    <div className="parts-container">
      <div className="parts-header">
        <h1>Catálogo de Peças</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Nova Peça
          </button>
        )}
      </div>

      {showForm && (
        <div className="parts-form-container">
          <form onSubmit={handleSubmit} className="parts-form">
            <h2>{editingId ? 'Editar Peça' : 'Nova Peça'}</h2>

            <div className="form-group">
              <label>Código *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: COMP-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Compressor 2HP"
                required
              />
            </div>

            <div className="form-row">
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

              <div className="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="refrigeração">Refrigeração</option>
                <option value="elétrica">Elétrica</option>
                <option value="hidráulica">Hidráulica</option>
                <option value="mecânica">Mecânica</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div className="form-group">
              <label>Foto da Peça</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {formData.photo && (
                <div className="photo-preview">
                  <img src={formData.photo} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: '' })}
                    className="btn-remove-photo"
                  >
                    Remover Foto
                  </button>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="parts-filters">
        <input
          type="text"
          placeholder="Buscar por código ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
      </div>

      {filteredParts.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma peça cadastrada</p>
        </div>
      ) : (
        <>
          <div className="parts-summary">
            <div className="summary-card">
              <span className="summary-label">Total de Peças:</span>
              <span className="summary-value">{totalQuantity}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Valor Total:</span>
              <span className="summary-value">R$ {totalValue.toFixed(2)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Quantidade de Itens:</span>
              <span className="summary-value">{parts.length}</span>
            </div>
          </div>

          <div className="parts-table-wrapper">
            <table className="parts-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor (R$)</th>
                  <th>Quantidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredParts.map(part => (
                  <tr key={part.id} onClick={() => handleRowClick(part)}>
                    <td className="code">{part.code}</td>
                    <td>{part.description}</td>
                    <td className="category">{part.category}</td>
                    <td className="value">R$ {part.value.toFixed(2)}</td>
                    <td className="quantity">{part.quantity}</td>
                    <td className="actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEdit(part)}
                        className="btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(part.id)}
                        className="btn-delete"
                        title="Deletar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedPart && (
        <PartDetailModal
          part={selectedPart}
          onClose={() => setSelectedPart(null)}
          onUpdate={handleUpdatePart}
        />
      )}
    </div>
  );
}
