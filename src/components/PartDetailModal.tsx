import { useState } from 'react';
import '../styles/part-detail-modal.css';

interface PartDetailModalProps {
  part: any;
  onClose: () => void;
  onUpdate: (part: any) => void;
}

export function PartDetailModal({ part, onClose, onUpdate }: PartDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    code: part.code,
    description: part.description,
    value: part.value,
    quantity: part.quantity,
    category: part.category,
    photo: part.photo || '',
  });

  const handleSave = () => {
    onUpdate({
      ...part,
      ...formData,
    });
    setIsEditing(false);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Peça' : 'Detalhes da Peça'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {!isEditing ? (
            // View Mode
            <div className="detail-view">
              {formData.photo && (
                <div className="detail-photo">
                  <img src={formData.photo} alt={formData.code} />
                </div>
              )}

              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label">Código:</span>
                  <span className="detail-value">{formData.code}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Descrição:</span>
                  <span className="detail-value">{formData.description}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Categoria:</span>
                  <span className="detail-badge">{formData.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Valor:</span>
                  <span className="detail-value-price">R$ {formData.value.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quantidade em Estoque:</span>
                  <span className="detail-value-qty">{formData.quantity}</span>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form className="detail-form">
              <div className="form-group">
                <label>Código</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
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
                  <label>Quantidade</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
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
            </form>
          )}
        </div>

        <div className="modal-footer">
          {!isEditing ? (
            <>
              <button className="btn-secondary" onClick={onClose}>
                Fechar
              </button>
              <button className="btn-primary" onClick={() => setIsEditing(true)}>
                Editar
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Salvar Alterações
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
