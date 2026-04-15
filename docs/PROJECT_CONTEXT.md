# Cashlar Project Context

Este arquivo serve como contexto rapido para retomadas futuras do projeto.

## Stack

- Next.js 16
- TypeScript
- Supabase Auth + Database + RLS
- PWA
- CSS global em `app/globals.css`

## O que o app faz hoje

- Cadastro e login com email e senha
- Recuperacao de senha por email
- Dashboard financeiro com receitas, despesas e saldo
- Filtros por mes, tipo e categoria
- Compartilhamento de movimentacoes por mes entre usuarios
- Perfil do usuario
- Configuracoes de idioma e instalacao como app
- Layout responsivo para desktop e mobile

## Decisoes importantes

- O login com Google foi removido.
- A chave publica usada no frontend e na Vercel e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- O projeto tambem aceita `NEXT_PUBLIC_SUPABASE_ANON_KEY` como fallback publico.
- `.env.local` nao deve ser versionado.
- `tsconfig.tsbuildinfo` nao deve ser versionado.
- O modal de "novo lancamento" abre centralizado no desktop.
- O instalador PWA foi ajustado para:
  - capturar o `beforeinstallprompt` globalmente
  - mostrar ajuda visivel no iPhone/iPad quando nao existir prompt nativo

## Arquivos importantes

### App e layout

- `app/layout.tsx`
- `app/page.tsx`
- `app/login/page.tsx`
- `app/cadastro/page.tsx`
- `app/redefinir-senha/page.tsx`
- `app/perfil/page.tsx`
- `app/configuracoes/page.tsx`

### Componentes principais

- `components/finance-dashboard.tsx`
- `components/app-navbar.tsx`
- `components/auth-card.tsx`
- `components/email-password-login-form.tsx`
- `components/reset-password-form.tsx`
- `components/install-app-button.tsx`
- `components/pwa-register.tsx`

### Supabase

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/proxy.ts`
- `lib/supabase/config.ts`

### Contextos utilitarios

- `lib/i18n.ts`
- `lib/theme.ts`
- `lib/install-app.ts`
- `lib/next-errors.ts`

### SQL

- `supabase/sql/001_initial_schema.sql`
- `supabase/sql/002_monthly_collaboration.sql`

### Templates de email

- `supabase/email-templates/confirm-signup-pt-br.html`
- `supabase/email-templates/confirm-signup-en.html`

## Variaveis de ambiente

Local:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Producao:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

## Supabase

No painel do Supabase, normalmente precisamos conferir:

- `Authentication > URL Configuration`
- `Authentication > Emails > Templates`
- `Authentication > Emails > SMTP Settings`
- `Project Settings > API`

SQL que deve existir no projeto Supabase:

1. `supabase/sql/001_initial_schema.sql`
2. `supabase/sql/002_monthly_collaboration.sql`

## Vercel

Config padrao esperada:

- Framework Preset: `Next.js`
- Root Directory: `./`

Env vars na Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Sempre que mudar env:

1. salvar a env
2. fazer redeploy

## Comandos uteis

Rodar local:

```bash
npm install
npm run dev
```

Validar:

```bash
npm run lint
npm run type-check
npm run build
```

Subir para GitHub:

```bash
git status
git add .
git commit -m "Sua mensagem"
git push origin main
```

## Problemas que ja apareceram

- erro por env faltando na Vercel
- `.env.local` acabou indo para o GitHub por engano
- erro de hidratacao ligado ao tema
- popover de compartilhamento no Supabase com conflitos SQL
- instalacao PWA sem feedback no iPhone/Android

## Como retomar rapido no futuro

Quando abrir uma nova sessao, vale olhar primeiro:

1. `README.md`
2. `docs/PROJECT_CONTEXT.md`
3. `app/page.tsx`
4. `components/finance-dashboard.tsx`
5. `lib/supabase/config.ts`

## Proximos ajustes provaveis

- melhorar o visual dos cards no desktop
- refinar a UX de compartilhamento
- revisar fluxos de deploy na Vercel
- revisar se a confirmacao de email vai continuar ativa ou nao
