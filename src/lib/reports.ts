import { ServiceOrder, Part } from '@/types';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Generate PDF for a single service order
 * Uses browser's native PDF capabilities
 */
export function generateServiceOrderPDF(order: ServiceOrder): void {
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>OS #${order.osNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #0a7ea4; }
        .header p { margin: 5px 0; color: #666; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; border-bottom: 2px solid #0a7ea4; padding-bottom: 5px; }
        .field { margin-bottom: 8px; display: grid; grid-template-columns: 150px 1fr; }
        .field-label { font-weight: bold; color: #333; }
        .field-value { color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #f5f5f5; padding: 8px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
        td { padding: 8px; border: 1px solid #ddd; }
        .status { padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
        .status.pending { background-color: #fef3c7; color: #92400e; }
        .status.in_progress { background-color: #dbeafe; color: #1e40af; }
        .status.completed { background-color: #dcfce7; color: #166534; }
        .status.waiting_part { background-color: #fee2e2; color: #991b1b; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>MAMED Soluções</h1>
        <p>Ordem de Serviço #${order.osNumber}</p>
      </div>

      <div class="section">
        <div class="section-title">Informações da Ordem</div>
        <div class="field">
          <div class="field-label">Data:</div>
          <div class="field-value">${new Date(order.date).toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="field">
          <div class="field-label">Hora:</div>
          <div class="field-value">${order.time || '-'}</div>
        </div>
        <div class="field">
          <div class="field-label">Status:</div>
          <div class="field-value">
            <span class="status ${order.status}">
              ${order.status === 'pending' ? 'Pendente' : 
                order.status === 'in_progress' ? 'Em Andamento' :
                order.status === 'waiting_part' ? 'Aguardando Peça' :
                'Concluída'}
            </span>
          </div>
        </div>
        <div class="field">
          <div class="field-label">Prioridade:</div>
          <div class="field-value">${order.priority}</div>
        </div>
        <div class="field">
          <div class="field-label">Categoria:</div>
          <div class="field-value">${order.category || '-'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Dados do Cliente</div>
        <div class="field">
          <div class="field-label">Nome:</div>
          <div class="field-value">${order.clientName}</div>
        </div>
        <div class="field">
          <div class="field-label">Telefone:</div>
          <div class="field-value">${order.clientPhone || '-'}</div>
        </div>
        <div class="field">
          <div class="field-label">Endereço:</div>
          <div class="field-value">${order.clientAddress || '-'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Descrição do Serviço</div>
        <div class="field">
          <div class="field-label">Resumo:</div>
          <div class="field-value">${order.briefDescription}</div>
        </div>
        <div class="field">
          <div class="field-label">Detalhes:</div>
          <div class="field-value">${order.detailedDescription || '-'}</div>
        </div>
      </div>

      ${order.parts && order.parts.length > 0 ? `
      <div class="section">
        <div class="section-title">Peças Utilizadas</div>
        <table>
          <thead>
            <tr>
              <th>Peça</th>
              <th>Valor Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.parts.map(part => `
              <tr>
                <td>${part.name}</td>
                <td>R$ ${typeof part.value === 'number' ? part.value.toFixed(2) : part.value}</td>
                <td>R$ ${typeof part.value === 'number' ? part.value.toFixed(2) : part.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Valor da Ordem</div>
        <div class="field">
          <div class="field-label">Total:</div>
          <div class="field-value" style="font-size: 18px; font-weight: bold; color: #0a7ea4;">
            R$ ${typeof order.value === 'number' ? order.value.toFixed(2) : order.value}
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Documento gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
        <p>MAMED Soluções - Sistema de Gerenciamento de Ordens de Serviço</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
}

/**
 * Generate Excel file with all service orders
 */
export function generateServiceOrdersExcel(orders: ServiceOrder[]): void {
  const data = orders.map(order => ({
    'OS #': order.osNumber,
    'Cliente': order.clientName,
    'Descrição': order.briefDescription,
    'Categoria': order.category || '-',
    'Status': order.status,
    'Prioridade': order.priority,
    'Valor': order.value,
    'Data': new Date(order.date).toLocaleDateString('pt-BR'),
    'Telefone': order.clientPhone || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ordens de Serviço');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
  ];

  const fileName = `relatorio_os_${format(new Date(), 'yyyy-MM-dd', { locale: ptBR })}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Generate backup ZIP file with all data
 */
export async function generateBackupZip(
  orders: ServiceOrder[],
  parts: Part[],
  fileName: string = `backup_${format(new Date(), 'yyyy-MM-dd_HHmmss', { locale: ptBR })}.zip`
): Promise<void> {
  const zip = new JSZip();

  // Add orders as JSON
  const ordersData = {
    exportDate: new Date().toISOString(),
    totalOrders: orders.length,
    orders: orders,
  };
  zip.file('orders.json', JSON.stringify(ordersData, null, 2));

  // Add parts as JSON
  const partsData = {
    exportDate: new Date().toISOString(),
    totalParts: parts.length,
    parts: parts,
  };
  zip.file('parts.json', JSON.stringify(partsData, null, 2));

  // Add Excel file
  const data = orders.map(order => ({
    'OS #': order.osNumber,
    'Cliente': order.clientName,
    'Descrição': order.briefDescription,
    'Status': order.status,
    'Valor': order.value,
    'Data': new Date(order.date).toLocaleDateString('pt-BR'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ordens');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  zip.file('orders.xlsx', excelBuffer);

  // Add summary
  const summary = `
BACKUP MAMED SOLUÇÕES
=====================

Data do Backup: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}

RESUMO:
- Total de Ordens de Serviço: ${orders.length}
- Total de Peças: ${parts.length}
- Valor Total em OS: R$ ${orders.reduce((sum, o) => sum + (typeof o.value === 'number' ? o.value : 0), 0).toFixed(2)}

CONTEÚDO DO BACKUP:
- orders.json: Dados completos de todas as ordens
- parts.json: Dados completo de todas as peças
- orders.xlsx: Relatório em Excel

INSTRUÇÕES DE RESTAURAÇÃO:
1. Extraia os arquivos do ZIP
2. Importe os dados JSON no sistema
3. Use o arquivo Excel para referência

---
Sistema MAMED Soluções
  `;

  zip.file('README.txt', summary);

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate summary statistics
 */
export function generateSummaryStats(orders: ServiceOrder[]) {
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    inProgressOrders: orders.filter(o => o.status === 'in_progress').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    waitingPartOrders: orders.filter(o => o.status === 'waiting_part').length,
    totalValue: orders.reduce((sum, o) => sum + (typeof o.value === 'number' ? o.value : 0), 0),
    averageValue: orders.length > 0 
      ? orders.reduce((sum, o) => sum + (typeof o.value === 'number' ? o.value : 0), 0) / orders.length
      : 0,
    highPriorityOrders: orders.filter(o => o.priority === 'alta').length,
  };
}
