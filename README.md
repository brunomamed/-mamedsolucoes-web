# MAMED Soluções - Sistema Web

Sistema web profissional para gerenciamento de ordens de serviço, estoque e peças para a empresa MAMED Soluções.

## 🚀 Características

- **Autenticação:** Login seguro com JWT
- **Dashboard:** Visão geral de ordens e estatísticas
- **Gerenciamento de OS:** Criar, editar, visualizar e deletar ordens de serviço
- **Controle de Estoque:** Rastreamento de peças e movimentações
- **Catálogo de Peças:** Gerenciamento completo com fotos
- **Relatórios:** Geração de PDFs e backups automáticos
- **Responsivo:** Funciona em desktop, tablet e mobile

## 📋 Requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando em http://localhost:3000

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks (useAuth, useServiceOrders, etc)
├── lib/           # Utilitários (API client, etc)
├── types/         # Definições de tipos TypeScript
├── styles/        # CSS global e por página
├── App.tsx        # Componente principal
└── main.tsx       # Ponto de entrada
```

## 🔐 Autenticação

O sistema usa JWT para autenticação. O token é armazenado em localStorage e enviado em cada requisição.

### Endpoints de Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

## 📊 Endpoints da API

### Ordens de Serviço
- `GET /api/service-orders` - Listar todas
- `GET /api/service-orders/:id` - Obter uma
- `POST /api/service-orders` - Criar
- `PUT /api/service-orders/:id` - Atualizar
- `DELETE /api/service-orders/:id` - Deletar

### Peças
- `GET /api/parts` - Listar todas
- `POST /api/parts` - Criar
- `PUT /api/parts/:id` - Atualizar
- `DELETE /api/parts/:id` - Deletar

### Estoque
- `GET /api/stock` - Obter estoque
- `POST /api/stock/movements` - Registrar movimentação
- `GET /api/stock/movements` - Listar movimentações

### Relatórios
- `GET /api/reports/service-order/:id` - PDF de uma OS
- `GET /api/reports/backup` - Backup mensal

## 🎨 Temas

O sistema suporta tema claro e escuro automaticamente baseado nas preferências do sistema.

## 📦 Dependências Principais

- **React 19** - Framework UI
- **React Router 7** - Roteamento
- **Axios** - HTTP client
- **Vite** - Build tool
- **TypeScript** - Type safety

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

## 🤝 Contribuindo

Este é um projeto interno da MAMED Soluções.

## 📄 Licença

Propriedade da MAMED Soluções.
