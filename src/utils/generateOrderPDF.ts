export function generateOrderPDF(order: any) {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Não foi possível abrir a janela de impressão. Verifique as configurações do navegador.');
    return;
  }

  const categoryLabel = {
    'elétrica': 'Elétrica',
    'refrigeração': 'Refrigeração',
    'hidráulica': 'Hidráulica',
    'mecânica': 'Mecânica',
    'outros': 'Outros',
  }[order.category] || order.category;

  const statusLabel = {
    'pending': 'Pendente',
    'in_progress': 'Em Andamento',
    'waiting_part': 'Aguardando Peça',
    'completed': 'Concluída',
  }[order.status] || order.status;

  const priorityLabel = {
    'low': 'Baixa',
    'medium': 'Média',
    'high': 'Alta',
    'urgent': 'Urgente',
  }[order.priority] || order.priority;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ordem de Serviço #${order.osNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 20px;
          background-color: #f5f5f5;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #0a7ea4;
          padding-bottom: 20px;
        }
        
        .header h1 {
          color: #0a7ea4;
          font-size: 28px;
          margin-bottom: 5px;
        }
        
        .header p {
          color: #666;
          font-size: 14px;
        }
        
        .os-number {
          font-size: 24px;
          font-weight: bold;
          color: #0a7ea4;
          margin: 20px 0;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          background-color: #0a7ea4;
          color: white;
          padding: 10px 15px;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 15px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-weight: bold;
          color: #0a7ea4;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          color: #333;
          font-size: 14px;
        }
        
        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: capitalize;
        }
        
        .badge-pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .badge-in_progress {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .badge-completed {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .badge-waiting_part {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .badge-low {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .badge-medium {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .badge-high {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .description-box {
          background-color: #f9fafb;
          padding: 15px;
          border-left: 4px solid #0a7ea4;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .description-box p {
          color: #333;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .parts-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .parts-table th {
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 10px;
          text-align: left;
          font-weight: bold;
          font-size: 12px;
          color: #0a7ea4;
          text-transform: uppercase;
        }
        
        .parts-table td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          font-size: 13px;
        }
        
        .parts-table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        .total-section {
          background-color: #f0f9ff;
          padding: 15px;
          border-radius: 4px;
          text-align: right;
          margin-top: 20px;
        }
        
        .total-value {
          font-size: 24px;
          font-weight: bold;
          color: #0a7ea4;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        
        .footer p {
          margin: 5px 0;
        }
        
        @media print {
          body {
            background-color: white;
            padding: 0;
          }
          
          .container {
            box-shadow: none;
            max-width: 100%;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MAMED Soluções</h1>
          <p>Sistema de Gerenciamento de Ordens de Serviço</p>
        </div>
        
        <div class="os-number">Ordem de Serviço #${order.osNumber}</div>
        
        <div class="section">
          <div class="section-title">Informações Gerais</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Cliente</span>
              <span class="info-value">${order.clientName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data</span>
              <span class="info-value">${new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Categoria</span>
              <span class="info-value">${categoryLabel}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Prioridade</span>
              <span class="info-value"><span class="badge badge-${order.priority}">${priorityLabel}</span></span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <span class="info-value"><span class="badge badge-${order.status}">${statusLabel}</span></span>
            </div>
            <div class="info-item">
              <span class="info-label">Valor</span>
              <span class="info-value">R$ ${order.value.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        ${order.clientPhone || order.clientAddress ? `
          <div class="section">
            <div class="section-title">Dados do Cliente</div>
            <div class="info-grid">
              ${order.clientPhone ? `
                <div class="info-item">
                  <span class="info-label">Telefone</span>
                  <span class="info-value">${order.clientPhone}</span>
                </div>
              ` : ''}
              ${order.clientAddress ? `
                <div class="info-item">
                  <span class="info-label">Endereço</span>
                  <span class="info-value">${order.clientAddress}</span>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">Descrição do Serviço</div>
          <div class="description-box">
            <p><strong>Resumo:</strong> ${order.briefDescription}</p>
            ${order.detailedDescription ? `<p style="margin-top: 10px;"><strong>Detalhes:</strong> ${order.detailedDescription}</p>` : ''}
          </div>
        </div>
        
        ${order.parts && order.parts.length > 0 ? `
          <div class="section">
            <div class="section-title">Peças Utilizadas</div>
            <table class="parts-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Quantidade</th>
                  <th>Valor Unit.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.parts.map((part: any) => `
                  <tr>
                    <td>${part.code}</td>
                    <td>${part.description}</td>
                    <td>${part.quantity}</td>
                    <td>R$ ${(part.value / part.quantity).toFixed(2)}</td>
                    <td>R$ ${part.value.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
        
        ${order.comments ? `
          <div class="section">
            <div class="section-title">Comentários</div>
            <div class="description-box">
              <p>${order.comments}</p>
            </div>
          </div>
        ` : ''}
        
        <div class="total-section">
          <div style="margin-bottom: 10px; color: #666;">Valor Total da Ordem:</div>
          <div class="total-value">R$ ${order.value.toFixed(2)}</div>
        </div>
        
        <div class="footer">
          <p><strong>MAMED Soluções</strong> - Sistema de Gerenciamento de Ordens de Serviço</p>
          <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>Este documento é válido como comprovante de serviço prestado.</p>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
