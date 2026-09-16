import { createClient } from '@supabase/supabase-js'

// Cliente PÚBLICO — usa a anon key, é seguro de importar em componentes
// client-side ('use client'). Depende inteiramente da RLS do banco pra
// segurança: por isso só consegue ler categorias/produtos disponíveis
// (veja supabase-setup-v2.sql). NUNCA use este cliente para escrever
// dados de admin, produtos ou pedidos — isso é feito via /api/* usando
// o supabase-admin.ts.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is not defined in environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ---------------------------------------------------------
// Tipos compartilhados (client-safe)
// ---------------------------------------------------------
export interface Category {
  id: string
  name: string
  display_order: number
  active: boolean
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  available: boolean
  display_order: number
  created_at?: string
  updated_at?: string
  // presente quando o produto vem de um select aninhado com categories(*)
  categories?: Category | null
}

export interface OrderItem {
  product_id: string
  name: string
  qty: number
  unit_price: number
  notes?: string
}

export interface Order {
  id: string
  order_number: number
  customer_name: string
  customer_phone: string
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  total: number
  delivery_type: 'entrega' | 'retirada'
  address: string | null
  status: 'pendente' | 'confirmado' | 'preparo' | 'saiu_entrega' | 'concluido' | 'cancelado'
  whatsapp_message_id: string | null
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  email: string
  name: string
  password_hash: string
  role: 'super_admin' | 'editor' | 'viewer'
  is_active: boolean
  last_login?: string
  created_at?: string
  updated_at?: string
}

// ---------------------------------------------------------
// Leitura pública do cardápio — só isso é permitido pela RLS pra anon.
// Usado diretamente por componentes client-side (ex: MenuSection).
// ---------------------------------------------------------
export async function getPublicMenu(): Promise<(Category & { products: Product[] })[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, display_order, active, products(id, name, description, price, image_url, available, display_order)')
    .eq('active', true)
    .order('display_order', { ascending: true })

  if (error) throw error

  return (data || []).map((cat: any) => ({
    ...cat,
    products: (cat.products || [])
      .filter((p: Product) => p.available)
      .sort((a: Product, b: Product) => a.display_order - b.display_order),
  }))
}
