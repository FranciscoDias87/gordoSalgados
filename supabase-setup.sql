-- Criar tabela de produtos no Supabase
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de admins
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais (opcional)
INSERT INTO products (name, category, price, status) VALUES
  ('Coxinha de Frango', 'Fritos', 5.50, 'active'),
  ('Esfiha de Carne', 'Assados', 6.00, 'active'),
  ('Kibe com Queijo', 'Fritos', 6.50, 'inactive');

-- Inserir admin inicial (você pode alterar o email e nome)
-- Senha: admin123 (hash gerado com bcrypt saltRounds=12)
INSERT INTO admins (email, name, password_hash, role) VALUES
  ('admin@gordosalgados.com', 'Administrador', '$2b$12$El73rfA2C.toVRWDiqFYLuurPIfg0Ri/WDJ3MLpqU.fi0LI5.nl7O', 'super_admin');

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security) - permitir tudo por enquanto
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (ajuste conforme necessário)
CREATE POLICY "Allow all operations for products" ON products
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for admins" ON admins
    FOR ALL USING (true);