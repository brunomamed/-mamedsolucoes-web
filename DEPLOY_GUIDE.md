# 🚀 Guia Completo de Deploy - MAMED Soluções

Este guia vai te ajudar a colocar o site `mamedsolucoes.com.br` no ar em menos de 30 minutos.

---

## 📋 Pré-requisitos

Você vai precisar de:
- ✅ Conta no GitHub (você já tem)
- ✅ Conta no Vercel (grátis)
- ✅ Domínio `mamedsolucoes.com.br` (comprado no Registro.br)
- ✅ Acesso ao painel do Registro.br

---

## 🔧 Passo 1: Preparar o Repositório GitHub

### 1.1 Verificar se o código está no GitHub

```bash
cd /home/ubuntu/mamedsolucoes-web
git remote -v
```

Você deve ver algo como:
```
origin  https://github.com/brunomamed/mamedsolucoes-web.git (fetch)
origin  https://github.com/brunomamed/mamedsolucoes-web.git (push)
```

Se não tiver, execute:
```bash
git remote add origin https://github.com/brunomamed/mamedsolucoes-web.git
git branch -M main
git push -u origin main
```

### 1.2 Fazer push do código

```bash
git push origin main
```

Verifique em https://github.com/brunomamed/mamedsolucoes-web se o código está lá.

---

## 🌐 Passo 2: Deploy no Vercel (Grátis)

### 2.1 Criar conta no Vercel

1. Acesse https://vercel.com
2. Clique em **"Sign Up"**
3. Clique em **"Continue with GitHub"**
4. Autorize o Vercel a acessar sua conta GitHub
5. Pronto! Você está logado

### 2.2 Importar Projeto

1. No dashboard do Vercel, clique em **"Add New..."** → **"Project"**
2. Procure por **"mamedsolucoes-web"** na lista de repositórios
3. Clique em **"Import"**

### 2.3 Configurar Projeto

Na tela de configuração:

**Framework Preset:** React
**Root Directory:** ./ (deixar em branco)
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

Clique em **"Deploy"** e aguarde (leva 2-3 minutos).

### 2.4 Verificar Deploy

Quando terminar, você verá uma URL como:
```
https://mamedsolucoes-web.vercel.app
```

Clique nela para testar o site. Deve estar funcionando!

---

## 🌍 Passo 3: Comprar Domínio

### 3.1 No Registro.br

1. Acesse https://www.registro.br
2. Clique em **"Registre um domínio"**
3. Digite `mamedsolucoes` no campo de busca
4. Selecione `.com.br`
5. Clique em **"Verificar disponibilidade"**
6. Se disponível, clique em **"Adicionar ao carrinho"**
7. Prossiga com o checkout
8. Pague (custa ~R$ 50/ano)

### 3.2 Confirmar Registro

Você receberá um email de confirmação. Clique no link para confirmar.

---

## 🔗 Passo 4: Conectar Domínio ao Vercel

### 4.1 No Painel do Vercel

1. Acesse https://vercel.com/dashboard
2. Clique no projeto **"mamedsolucoes-web"**
3. Vá em **"Settings"** → **"Domains"**
4. Clique em **"Add Domain"**
5. Digite `mamedsolucoes.com.br`
6. Clique em **"Add"**

### 4.2 Configurar DNS

O Vercel vai mostrar 2 opções:

**Opção A: Nameservers (Recomendado)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Opção B: CNAME**
```
cname.vercel-dns.com
```

### 4.3 Atualizar DNS no Registro.br

1. Acesse https://www.registro.br
2. Faça login
3. Vá em **"Meus Domínios"**
4. Clique em `mamedsolucoes.com.br`
5. Clique em **"Editar"** → **"Nameservers"**

**Se escolheu Nameservers:**
- Remova os nameservers atuais
- Adicione:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`

**Se escolheu CNAME:**
- Deixe os nameservers atuais
- Vá em **"Registros"** → **"Adicionar Registro"**
- Tipo: CNAME
- Nome: www
- Valor: `cname.vercel-dns.com`

Clique em **"Salvar"**

### 4.4 Aguardar Propagação

Pode levar **até 48 horas**, mas geralmente é **15-30 minutos**.

Para verificar se já propagou:
```bash
nslookup mamedsolucoes.com.br
```

Quando estiver pronto, você verá:
```
Address: <IP do Vercel>
```

---

## ✅ Passo 5: Verificar Deploy Final

### 5.1 Testar o Site

1. Abra https://mamedsolucoes.com.br
2. Você deve ver o site MAMED Soluções
3. Teste o login
4. Teste as funcionalidades

### 5.2 Configurar HTTPS

O Vercel configura HTTPS automaticamente. Você verá um cadeado 🔒 na barra de endereço.

---

## 🔐 Passo 6: Configurar Variáveis de Ambiente (Opcional)

Se precisar de variáveis de ambiente (API keys, etc):

1. No Vercel, vá em **"Settings"** → **"Environment Variables"**
2. Adicione cada variável:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://seu-backend.com`
3. Clique em **"Add"**
4. Faça um novo deploy (Vercel faz automaticamente)

---

## 📊 Passo 7: Monitorar Performance

### 7.1 Analytics do Vercel

1. No dashboard do Vercel, clique em **"Analytics"**
2. Veja métricas de:
   - Requisições
   - Tempo de resposta
   - Erros

### 7.2 Logs

1. Vá em **"Deployments"**
2. Clique no deploy mais recente
3. Veja os logs de build e runtime

---

## 🆘 Troubleshooting

### Problema: "Domain already registered"

**Solução:** O domínio pode estar registrado por outro usuário. Tente outro domínio.

### Problema: "DNS not resolving"

**Solução:** Aguarde 24-48 horas. DNS leva tempo para propagar. Você pode forçar a atualização:

```bash
# Mac/Linux
sudo dscacheutil -flushcache

# Windows
ipconfig /flushdns
```

### Problema: "Site mostra erro 404"

**Solução:** Verifique se o build foi bem-sucedido:
1. No Vercel, vá em **"Deployments"**
2. Clique no deploy com erro
3. Veja os logs
4. Se houver erro, corrija o código e faça push novamente

### Problema: "Página em branco"

**Solução:** Abra o console do navegador (F12) e veja os erros. Geralmente é falta de variáveis de ambiente.

---

## 🎯 Resumo Final

| Etapa | Tempo | Status |
|-------|-------|--------|
| 1. Push no GitHub | 5 min | ✅ |
| 2. Deploy Vercel | 10 min | ✅ |
| 3. Comprar Domínio | 10 min | ⏳ |
| 4. Conectar DNS | 5 min | ⏳ |
| 5. Aguardar Propagação | 15-48h | ⏳ |
| 6. Testar Site | 5 min | ⏳ |

**Total:** ~50 minutos + 15-48h de espera por DNS

---

## 📞 Suporte

Se tiver dúvidas:

1. **Vercel Docs:** https://vercel.com/docs
2. **Registro.br Help:** https://www.registro.br/ajuda
3. **GitHub Issues:** Abra uma issue no repositório

---

## 🎉 Parabéns!

Seu site `mamedsolucoes.com.br` está no ar! 🚀

Agora você pode:
- ✅ Acessar de qualquer lugar
- ✅ Compartilhar o link
- ✅ Usar em produção
- ✅ Fazer backups automáticos
- ✅ Escalar conforme necessário

---

**Próximos passos recomendados:**
1. Configurar email (SendGrid)
2. Adicionar mais usuários
3. Integrar com banco de dados
4. Configurar CI/CD automático
