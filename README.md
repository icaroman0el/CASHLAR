# Cashlar

Sistema de controle financeiro com `Next.js`, `TypeScript`, `Supabase Auth` e suporte a `PWA`.

## Contexto rapido do projeto

Para retomar o projeto em outra sessao sem perder tempo, veja tambem:

- [docs/PROJECT_CONTEXT.md](./docs/PROJECT_CONTEXT.md)

## O que este projeto entrega

- Login com email e senha
- Cadastro com confirmacao por email
- Dashboard de lancamentos salvo no Supabase
- Compartilhamento de movimentacoes por mes entre usuarios
- RLS no Supabase
- Layout responsivo para desktop e mobile
- Instalacao como app no celular

## Variaveis de ambiente

Crie um `.env.local` com base em [`.env.example`](./.env.example):

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup do Supabase

### 1. Criar o projeto

1. Crie um projeto no Supabase.
2. Copie:
   - `Project URL`
   - `Publishable key`
3. Preencha o `.env.local`.

### 2. Rodar o banco

No `SQL Editor`, execute nesta ordem:

1. [supabase/sql/001_initial_schema.sql](./supabase/sql/001_initial_schema.sql)
2. [supabase/sql/002_monthly_collaboration.sql](./supabase/sql/002_monthly_collaboration.sql)

Isso cria:

- `profiles`
- `transactions`
- `monthly_shares`
- triggers de `updated_at`
- funcoes RPC de compartilhamento
- politicas de `Row Level Security`

### 3. Configurar URLs de autenticacao

No Supabase, abra `Authentication > URL Configuration` e configure:

#### Desenvolvimento local

- `Site URL`: `http://localhost:3000`
- `Redirect URLs`:
  - `http://localhost:3000/auth/confirm`

#### Producao

Quando subir para a Vercel, troque para a URL real:

- `Site URL`: `https://seu-dominio.com`
- `Redirect URLs`:
  - `https://seu-dominio.com/auth/confirm`
  - `https://seu-dominio.com/redefinir-senha`

## Template de email de confirmacao

No painel do Supabase:

1. Abra `Authentication > Emails > Templates`
2. Entre em `Confirm sign up`
3. Defina um assunto
4. Cole um dos templates prontos da pasta:
   - [supabase/email-templates/confirm-signup-pt-br.html](./supabase/email-templates/confirm-signup-pt-br.html)
   - [supabase/email-templates/confirm-signup-en.html](./supabase/email-templates/confirm-signup-en.html)

Assuntos sugeridos:

- PT-BR: `Confirme sua conta no Cashlar`
- EN: `Confirm your Cashlar account`

Os templates usam este link:

```txt
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

Esse fluxo bate com a rota do projeto em:

- [app/auth/confirm/route.ts](./app/auth/confirm/route.ts)

## SMTP

Para testes, o SMTP padrao do Supabase pode servir.

Para producao, configure `Authentication > Emails > SMTP Settings` com um provedor proprio. Isso melhora:

- entregabilidade
- dominio proprio
- reputacao de envio
- volume de emails

## Rodando localmente

```bash
npm install
npm run dev
```

Abra:

```txt
http://localhost:3000
```

## Validacao antes de subir

```bash
npm run lint
npm run type-check
npm run build
```

## Publicar no GitHub

Se ainda nao tiver um repositorio:

```bash
git init
git add .
git commit -m "Initial Cashlar setup"
git branch -M main
git remote add origin https://github.com/seu-usuario/cashlar.git
git push -u origin main
```

## Publicar na Vercel

1. Suba o projeto para o GitHub.
2. Importe o repositorio na Vercel.
3. Configure as variaveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Configure essas variaveis pelo menos em `Production`.
5. Se voce tambem testar em preview, replique em `Preview`.
6. Em producao, defina `NEXT_PUBLIC_SITE_URL` com sua URL publica final.
7. Depois do deploy, volte no Supabase e atualize `Site URL` e `Redirect URLs`.

Observacao:

- O helper [lib/site.ts](./lib/site.ts) ja tenta usar `NEXT_PUBLIC_SITE_URL` e, na Vercel, tambem faz fallback para a URL do ambiente quando necessario.

## Problemas comuns na Vercel

### Erro 500 falando que faltam URL e Key do Supabase

Se a Vercel mostrar um erro parecido com:

```txt
Your project's URL and Key are required to create a Supabase client
```

isso significa que o deploy subiu sem estas variaveis:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Para corrigir:

1. Abra o projeto na Vercel.
2. Entre em `Settings > Environment Variables`.
3. Cadastre:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Salve.
5. Rode um novo deploy.

### Reset de senha abre a pagina errada

Confirme no Supabase `Authentication > URL Configuration` que a rota abaixo esta liberada:

- `https://seu-dominio.com/redefinir-senha`

## Estrutura importante

- [app/login/page.tsx](./app/login/page.tsx)
- [app/cadastro/page.tsx](./app/cadastro/page.tsx)
- [app/auth/confirm/route.ts](./app/auth/confirm/route.ts)
- [components/finance-dashboard.tsx](./components/finance-dashboard.tsx)
- [lib/supabase](./lib/supabase)
- [supabase/sql/001_initial_schema.sql](./supabase/sql/001_initial_schema.sql)
- [supabase/sql/002_monthly_collaboration.sql](./supabase/sql/002_monthly_collaboration.sql)
- [supabase/email-templates](./supabase/email-templates)
