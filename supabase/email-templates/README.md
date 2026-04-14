# Templates de email do Cashlar

Use estes arquivos em:

- `Supabase > Authentication > Emails > Templates > Confirm sign up`

Arquivos:

- `confirm-signup-pt-br.html`
- `confirm-signup-en.html`

Assuntos sugeridos:

- PT-BR: `Confirme sua conta no Cashlar`
- EN: `Confirm your Cashlar account`

Observacao:

- O Supabase usa um template por fluxo.
- Se voce quiser mandar em portugues, cole o template PT-BR.
- Se quiser mandar em ingles, cole o template EN.
- Para variar idioma por usuario, o ideal e usar um fluxo proprio de envio.

Link usado:

```txt
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

Esse link conversa com:

- `app/auth/confirm/route.ts`
