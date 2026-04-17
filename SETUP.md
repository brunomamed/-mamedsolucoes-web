# Setup e Desenvolvimento - MAMED Soluções Web

## 🛠️ Instalação Local

### Requisitos

- Node.js 18+ ([Download](https://nodejs.org))
- npm 9+ (vem com Node.js)
- Git

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/mamedsolucoes-web.git
cd mamedsolucoes-web
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar .env.local com suas configurações
# VITE_API_URL=http://localhost:3000/api
```

### Passo 4: Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   └── Header.tsx    # Navegação principal
├── pages/            # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   ├── OrdersPage.tsx
│   ├── StockPage.tsx
│   └── PartsPage.tsx
├── hooks/            # Custom hooks
│   ├── useAuth.ts    # Autenticação
│   └── useServiceOrders.ts  # Ordens de serviço
├── lib/              # Utilitários
│   └── api.ts        # Cliente HTTP
├── types/            # Definições TypeScript
│   └── index.ts
├── styles/           # CSS
│   ├── index.css     # Estilos globais
│   ├── header.css
│   ├── login.css
│   ├── home.css
│   ├── orders.css
│   ├── stock.css
│   └── parts.css
├── App.tsx           # Componente raiz
└── main.tsx          # Ponto de entrada
```

---

## 🔐 Autenticação

### Fluxo de Login

1. Usuário acessa `/login`
2. Insere email e senha
3. Sistema faz POST para `/api/auth/login`
4. Backend retorna token JWT
5. Token é armazenado em localStorage
6. Usuário é redirecionado para `/`

### Armazenamento de Token

```typescript
// Token é automaticamente armazenado em localStorage
localStorage.getItem('auth_token')
localStorage.getItem('user')
```

### Logout

```typescript
const { logout } = useAuth();
logout(); // Remove token e redireciona para /login
```

---

## 🚀 Desenvolvimento

### Criar Nova Página

1. Criar arquivo em `src/pages/NovaPage.tsx`
2. Adicionar rota em `src/App.tsx`
3. Adicionar estilos em `src/styles/nova.css`

### Criar Novo Hook

1. Criar arquivo em `src/hooks/useNovo.ts`
2. Usar em componentes com `const { ... } = useNovo()`

### Adicionar Estilos

- Use variáveis CSS globais em `src/styles/index.css`
- Cores: `var(--color-primary)`, `var(--color-error)`, etc
- Espaçamento: `var(--spacing-md)`, `var(--spacing-lg)`, etc

---

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm run test

# Cobertura de testes
npm run test:coverage
```

---

## 📦 Build para Produção

```bash
# Gerar build otimizado
npm run build

# Testar build localmente
npm run preview
```

Arquivos gerados em `dist/` prontos para deploy.

---

## 🔗 Integração com Backend

### Endpoints Esperados

#### Autenticação
```
POST /api/auth/login
POST /api/auth/register
```

#### Ordens de Serviço
```
GET    /api/service-orders
GET    /api/service-orders/:id
POST   /api/service-orders
PUT    /api/service-orders/:id
DELETE /api/service-orders/:id
```

#### Peças
```
GET    /api/parts
POST   /api/parts
PUT    /api/parts/:id
DELETE /api/parts/:id
```

#### Estoque
```
GET    /api/stock
POST   /api/stock/movements
GET    /api/stock/movements
```

---

## 🐛 Debug

### Console do Navegador

```javascript
// Verificar token
localStorage.getItem('auth_token')

// Verificar usuário
JSON.parse(localStorage.getItem('user'))

// Limpar dados
localStorage.clear()
```

### Network Tab

1. Abrir DevTools (F12)
2. Ir em "Network"
3. Fazer uma ação (login, criar OS, etc)
4. Verificar requisições e respostas

---

## 📝 Convenções de Código

### Nomenclatura

- Componentes: `PascalCase` (ex: `HomePage.tsx`)
- Hooks: `camelCase` com prefixo `use` (ex: `useAuth.ts`)
- Arquivos CSS: `kebab-case` (ex: `home.css`)
- Variáveis: `camelCase` (ex: `isLoading`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `API_URL`)

### Formatação

```typescript
// ✅ Bom
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await createOrder(data);
  } catch (error) {
    console.error(error);
  }
};

// ❌ Ruim
const handleSubmit = (e) => {
  e.preventDefault()
  createOrder(data)
}
```

---

## 🚨 Erros Comuns

### "Cannot find module"

```bash
# Solução: Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### "API não responde"

```bash
# Verificar se backend está rodando
curl http://localhost:3000/api/health

# Verificar VITE_API_URL em .env.local
```

### "Token expirado"

```typescript
// Implementado automaticamente em apiClient
// Usuário é redirecionado para /login se token expirar
```

---

## 📚 Recursos

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)

---

## 💡 Dicas

1. Use `npm run dev` para desenvolvimento
2. Use `npm run build` antes de fazer push
3. Mantenha `.env.local` fora do Git
4. Sempre faça commits descritivos
5. Teste em múltiplos navegadores

---

## 🤝 Contribuindo

1. Criar branch: `git checkout -b feature/nova-feature`
2. Fazer commits: `git commit -m "Add nova feature"`
3. Push: `git push origin feature/nova-feature`
4. Abrir Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.
