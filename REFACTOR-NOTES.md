# Notas do Refactor — Cardápio + WhatsApp (Cloud API + Supabase)

Este documento resume o que mudou em relação ao repositório original e o
passo a passo pra colocar essa versão no ar. Leia isso antes do
`README.md` original.

## Por que esse refactor foi feito

A análise do repositório original encontrou:

1. **RLS permissiva total** (`FOR ALL USING (true)`) nas tabelas
   `products` e `admins`, combinada com o CRUD do admin chamando o
   Supabase **direto do navegador** com a `anon key`. Resultado: qualquer
   pessoa com o DevTools aberto conseguia ler a tabela `admins` (hash de
   senha incluso) ou escrever produtos, sem nunca ter feito login — o JWT
   protegia a *tela*, não os *dados*.
2. **Hash de senha feito no navegador** (`admin-form.tsx`), o que não é o
   fim do mundo criptograficamente, mas reforçava o padrão errado de
   "lógica sensível no client".
3. **Cardápio público desconectado do painel admin**: a landing lia de um
   `menu.json` estático; o admin editava uma tabela `products` que a
   landing nunca consultava.
4. **Sem carrinho e sem pedidos**: cada clique em "Adicionar" abria uma
   aba de WhatsApp por item, sem agregação, sem persistência, sem
   rastreio de conversão.
5. **`JWT_SECRET` com fallback hardcoded** no código-fonte.
6. Bug pré-existente: `use-auth.tsx` chamava `/api/admin/:id`, rota que
   nunca existiu.

## O que mudou, por camada

### Banco de dados
- Novo arquivo `supabase-setup-v2.sql` substitui o `supabase-setup.sql`.
- `products` ganhou `description`, `image_url`, `category_id` (FK),
  `available`, `display_order`.
- Nova tabela `categories`.
- Nova tabela `orders` (pedidos persistidos, com status).
- Nova tabela `restaurant_settings` (número de WhatsApp, taxa de entrega).
- RLS: `anon` só lê `products`/`categories` ativos. Todo o resto exige
  `service_role`, usada exclusivamente no backend.

### Backend (rotas `/api/*` do Next.js)
- `src/lib/supabase.ts` — cliente público, só leitura, seguro pro
  navegador.
- `src/lib/supabase-admin.ts` — cliente `service_role`, **server-only**
  (lança erro se importado no navegador). Todo CRUD de admin, produtos e
  pedidos vive aqui.
- `src/lib/whatsapp.ts` — integração com a Meta Cloud API (server-only).
- `src/lib/require-admin.ts` — helper que lê e valida o JWT do cookie.
- Rotas novas: `/api/products` (+ `[id]`), `/api/categories`,
  `/api/orders` (+ `[id]/status`), `/api/admins` (+ `[id]`),
  `/api/admin/[id]`, `/api/webhook`.

### Frontend
- `src/components/menu-section.tsx` — cardápio lido do Supabase (não
  mais do `menu.json`, que foi removido).
- `src/lib/cart-store.ts` — carrinho com Zustand, persistido no
  `localStorage` do navegador.
- `src/components/cart-widget.tsx` — ícone de carrinho no header +
  checkout completo (nome, telefone, entrega/retirada, endereço).
- `src/app/admin/orders/page.tsx` + `src/hooks/use-orders.ts` — nova tela
  de gestão de pedidos.
- `product-form.tsx`, `admin-form.tsx` e seus hooks (`use-products-management.tsx`,
  `use-admins.ts`, `use-dashboard-stats.tsx`) reescritos para chamar as
  rotas `/api/*` em vez do Supabase direto.

## Passo a passo de migração

### 1. Banco de dados
Se for um projeto Supabase **novo**, rode `supabase-setup-v2.sql` direto
no SQL Editor.

Se for o **mesmo projeto** do repositório original, rode antes:
```sql
drop table if exists products cascade;
-- admins pode ficar (o schema v2 usa "create table if not exists")
```
e então rode `supabase-setup-v2.sql`.

Edite a linha de `insert into restaurant_settings` (ou edite depois pela
própria tabela) com o `whatsapp_phone_number_id` real, que você pega no
passo 3.

### 2. Variáveis de ambiente
Copie `.env.example` (se não existir, veja a lista abaixo) para
`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # a mesma de antes
SUPABASE_SERVICE_ROLE_KEY=eyJ...               # NOVA — Project Settings > API
JWT_SECRET=<string aleatória de 32+ caracteres> # agora OBRIGATÓRIA, sem fallback
JWT_EXPIRES_IN=7d

WHATSAPP_TOKEN=EAAxxxxx                        # Meta for Developers
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_VERIFY_TOKEN=<string secreta à sua escolha>
WHATSAPP_APP_SECRET=<App Secret em Configurações Básicas do App na Meta>
```

`WHATSAPP_APP_SECRET` é diferente do `WHATSAPP_TOKEN`: fica em
**Configurações Básicas do App** (não em WhatsApp > API Setup). É usado
só pra verificar a assinatura HMAC do webhook — sem ele, o endpoint
recusa qualquer POST por padrão (falha fechada), então não deixe de
configurar antes de apontar o webhook pra produção.

`SUPABASE_SERVICE_ROLE_KEY` **nunca** deve ter o prefixo `NEXT_PUBLIC_` —
se isso acontecer, ela vai parar no bundle do navegador e o problema de
segurança volta.

### 3. Meta Cloud API
Mesmo passo a passo do backend Node que fizemos antes: criar app em
developers.facebook.com, adicionar produto WhatsApp, pegar
`Phone Number ID` e token, criar o template `novo_pedido` (categoria
Utility, corpo com 3 variáveis: número do pedido, nome do cliente,
total), e configurar o webhook apontando para:

```
https://seu-dominio.com/api/webhook
```

com o mesmo valor de `WHATSAPP_VERIFY_TOKEN`.

### 4. Rodar localmente
```bash
npm install
npm run dev
```

### 5. Trocar a senha do admin seed
O `supabase-setup-v2.sql` cria `admin@gordosalgados.com` com a senha
`admin123` (hash bcrypt já no INSERT). Faça login e troque a senha (ou
crie um novo super_admin e desative/exclua o seed) antes de ir pra
produção.

## Proteções adicionadas depois do refactor inicial

- **Verificação de assinatura do webhook** (`src/lib/verify-webhook-signature.ts`):
  todo POST em `/api/webhook` agora precisa vir com um `X-Hub-Signature-256`
  válido, calculado com o `WHATSAPP_APP_SECRET`. Sem isso configurado, o
  endpoint recusa tudo por padrão — falha fechada, não aberta.
- **Rate limiting** (`src/lib/rate-limit.ts`): `POST /api/orders` aceita
  no máximo 5 pedidos a cada 10 minutos por IP; `POST /api/auth/login`
  aceita no máximo 10 tentativas a cada 15 minutos por IP. Implementação
  em memória — funciona bem num único container (Railway, Render, VPS),
  mas cada instância tem seu próprio contador em ambientes com múltiplas
  instâncias. Pra esse cenário, troque por `@upstash/ratelimit` (tem
  free tier, é a opção mais simples com Vercel).

## O que ficou de fora (próximos passos sugeridos)

- Upload de imagem direto pro Supabase Storage no formulário de produto
  (hoje é só um campo de URL).
- CRUD de categorias pelo painel (hoje só existe via SQL/seed).
- Paginação na lista de pedidos e produtos.
- Testes automatizados para as novas rotas de API (o projeto já tem
  Jest configurado, é só estender).
