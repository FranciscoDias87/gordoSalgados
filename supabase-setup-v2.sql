-- =========================================================
-- GORDO SALGADOS — SCHEMA V2
-- Substitui o supabase-setup.sql original.
--
-- MUDANÇAS PRINCIPAIS EM RELAÇÃO AO V1:
-- 1. RLS deixa de ser "allow all" — anon só pode LER produtos/categorias
--    ativos. Toda escrita (admin, pedidos) passa pelo backend Next.js
--    usando a service_role key, nunca pela anon key do navegador.
-- 2. products ganha description, image_url, category_id (FK), available,
--    display_order — necessário pro cardápio real e pro admin editar tudo.
-- 3. Nova tabela categories.
-- 4. Nova tabela orders — antes não existia persistência de pedido nenhuma.
--
-- Rode isso em um projeto novo, ou em um projeto existente após dropar
-- as tabelas antigas (veja instruções no REFACTOR-NOTES.md).
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- Categorias do cardápio
-- ---------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- Produtos (schema expandido — antes só tinha name/category/price/status)
-- ---------------------------------------------------------
drop table if exists products cascade;

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  available boolean not null default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_products_category on products(category_id);

-- ---------------------------------------------------------
-- Admins (mesma estrutura do v1)
-- ---------------------------------------------------------
create table if not exists admins (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text not null,
  password_hash text not null,
  role text not null default 'editor' check (role in ('super_admin', 'editor', 'viewer')),
  is_active boolean default true,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------
-- Pedidos (NÃO existia no v1 — cada clique virava um wa.me solto)
-- ---------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number serial,
  customer_name text not null,
  customer_phone text not null,
  items jsonb not null, -- [{product_id, name, qty, unit_price, notes}]
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  delivery_type text check (delivery_type in ('entrega','retirada')) default 'retirada',
  address text,
  status text check (status in ('pendente','confirmado','preparo','saiu_entrega','concluido','cancelado')) default 'pendente',
  whatsapp_message_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_orders_status on orders(status);

-- ---------------------------------------------------------
-- Configurações do restaurante (número do WhatsApp, taxa de entrega etc)
-- ---------------------------------------------------------
create table if not exists restaurant_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp_phone_number_id text not null,
  whatsapp_number text not null,
  delivery_fee numeric(10,2) default 0,
  is_open boolean default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_products_updated_at on products;
create trigger update_products_updated_at
  before update on products for each row execute function update_updated_at_column();

drop trigger if exists update_admins_updated_at on admins;
create trigger update_admins_updated_at
  before update on admins for each row execute function update_updated_at_column();

drop trigger if exists update_orders_updated_at on orders;
create trigger update_orders_updated_at
  before update on orders for each row execute function update_updated_at_column();

-- =========================================================
-- ROW LEVEL SECURITY — aqui está a correção do problema crítico
-- =========================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table admins enable row level security;
alter table orders enable row level security;
alter table restaurant_settings enable row level security;

-- Único acesso liberado para a anon key (usada no navegador): LEITURA
-- de categorias e produtos ativos, para montar o cardápio público.
create policy "categorias_publicas_leitura" on categories
  for select using (active = true);

create policy "produtos_publicos_leitura" on products
  for select using (available = true);

-- admins, orders e restaurant_settings NÃO têm nenhuma policy para
-- anon — com RLS habilitada e zero policies, o acesso é negado por
-- padrão. Só a service_role key (usada exclusivamente no backend,
-- dentro das rotas /api/* do Next.js) consegue ler/escrever essas
-- tabelas, porque a service_role ignora RLS por definição.

-- ---------------------------------------------------------
-- Seed de exemplo
-- ---------------------------------------------------------
insert into restaurant_settings (name, whatsapp_phone_number_id, whatsapp_number, delivery_fee)
values ('Gordo Salgados', 'SUBSTITUA_PELO_PHONE_NUMBER_ID', '5586998532928', 5.00);

insert into categories (name, display_order) values
  ('Fritos', 1),
  ('Assados', 2),
  ('Kits Festa', 3),
  ('Bebidas', 4);

insert into products (category_id, name, description, price, image_url, display_order)
select id, 'Coxinha de Frango', 'Massa cremosa de batata com recheio suculento de frango desfiado e temperos especiais.', 8.50,
  'https://blog.vapza.com.br/wp-content/uploads/2020/10/coxinha-de-frango.jpg', 1
from categories where name = 'Fritos';

insert into products (category_id, name, description, price, image_url, display_order)
select id, 'Esfiha de Carne', 'Massa macia com recheio de carne moída, tomate, cebola e um toque de limão.', 7.00,
  'https://guiadacozinha.com.br/wp-content/uploads/2018/01/Esfirra-de-carne-desfiada-350x230.jpg', 1
from categories where name = 'Assados';

insert into admins (email, name, password_hash, role) values
  ('admin@gordosalgados.com', 'Administrador', '$2b$12$El73rfA2C.toVRWDiqFYLuurPIfg0Ri/WDJ3MLpqU.fi0LI5.nl7O', 'super_admin');
-- Senha do seed acima: admin123 — TROQUE assim que logar pela primeira vez.
