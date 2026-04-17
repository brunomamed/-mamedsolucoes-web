# Guia de Deploy - MAMED Soluções Web

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta em um serviço de hosting (Vercel, Railway, Netlify, etc)
- Domínio `mamedsolucoes.com.br` (opcional, pode usar subdomínio)

## 🚀 Deploy no Vercel (Recomendado)

### Passo 1: Preparar o Projeto

```bash
# Instalar dependências
npm install

# Testar build localmente
npm run build

# Verificar se não há erros
npm run preview
```

### Passo 2: Conectar ao GitHub

```bash
# Fazer push para GitHub
git remote add origin https://github.com/seu-usuario/mamedsolucoes-web.git
git branch -M main
git push -u origin main
```

### Passo 3: Deploy no Vercel

1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL do backend (ex: https://api.mamedsolucoes.com.br)
5. Clique em "Deploy"

### Passo 4: Configurar Domínio

1. No Vercel, vá em "Settings" → "Domains"
2. Adicione seu domínio `mamedsolucoes.com.br`
3. Siga as instruções para atualizar os DNS

---

## 🚀 Deploy no Railway

### Passo 1: Instalar Railway CLI

```bash
npm install -g @railway/cli
```

### Passo 2: Login

```bash
railway login
```

### Passo 3: Deploy

```bash
railway up
```

### Passo 4: Configurar Domínio

1. No painel do Railway, vá em "Settings"
2. Adicione seu domínio customizado
3. Atualize os DNS conforme instruído

---

## 🚀 Deploy no Netlify

### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Passo 2: Login

```bash
netlify login
```

### Passo 3: Deploy

```bash
netlify deploy --prod
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.production` com:

```
VITE_API_URL=https://api.mamedsolucoes.com.br
VITE_APP_NAME=MAMED Soluções
```

---

## 📊 Monitoramento

### Logs

```bash
# Vercel
vercel logs

# Railway
railway logs

# Netlify
netlify logs:functions
```

### Métricas

- Vercel: Dashboard → Analytics
- Railway: Dashboard → Metrics
- Netlify: Site settings → Analytics

---

## 🔄 CI/CD Automático

### GitHub Actions (Vercel)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🐛 Troubleshooting

### Build falha

```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API não conecta

- Verificar `VITE_API_URL` nas variáveis de ambiente
- Verificar CORS no backend
- Verificar se o backend está rodando

### Domínio não funciona

- Aguardar propagação de DNS (até 48 horas)
- Verificar registros DNS
- Limpar cache do navegador

---

## 📞 Suporte

Para problemas de deploy, consulte a documentação oficial:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Netlify: https://docs.netlify.com
