import { createClient } from '@supabase/supabase-js'
import type { Admin, Order, Product } from './supabase'

// ⚠️ ARQUIVO SERVER-ONLY. Nunca importe isso de um componente 'use client'
// ou de qualquer código que rode no navegador — a service_role key
// ignora TODA a Row Level Security do banco. Se ela vazar pro bundle do
// cliente, é o mesmo problema de segurança que estamos corrigindo aqui.
if (typeof window !== 'undefined') {
  throw new Error(
    'supabase-admin.ts foi importado no navegador. Isso nunca deve acontecer — ' +
      'use apenas dentro de src/app/api/**/route.ts.'
  )
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados no .env.')
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

// ---------------------------------------------------------
// Produtos (CRUD completo do admin)
// ---------------------------------------------------------
export const adminProductService = {
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(id, name)')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data as (Product & { categories: { id: string; name: string } | null })[]
  },

  async create(product: Partial<Product>) {
    const { data, error } = await supabaseAdmin.from('products').insert([product]).select().single()
    if (error) throw error
    return data as Product
  },

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Product
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
    if (error) throw error
  },
}

// ---------------------------------------------------------
// Categorias
// ---------------------------------------------------------
export const adminCategoryService = {
  async getAll() {
    const { data, error } = await supabaseAdmin.from('categories').select('*').order('display_order')
    if (error) throw error
    return data
  },
}

// ---------------------------------------------------------
// Pedidos
// ---------------------------------------------------------
export const orderService = {
  async create(order: {
    customer_name: string
    customer_phone: string
    items: Order['items']
    subtotal: number
    delivery_fee: number
    total: number
    delivery_type: Order['delivery_type']
    address?: string
  }) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([{ ...order, status: 'pendente' }])
      .select()
      .single()
    if (error) throw error
    return data as Order
  },

  async getAll(limit = 100) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data as Order[]
  },

  async updateStatus(id: string, status: Order['status']) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Order
  },

  async updateWhatsappMessageId(id: string, whatsapp_message_id: string) {
    await supabaseAdmin.from('orders').update({ whatsapp_message_id }).eq('id', id)
  },

  async findByOrderNumber(orderNumber: number) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()
    if (error) throw error
    return data as Order
  },
}

// ---------------------------------------------------------
// Configurações do restaurante
// ---------------------------------------------------------
export const settingsService = {
  async get() {
    const { data, error } = await supabaseAdmin.from('restaurant_settings').select('*').limit(1).single()
    if (error) throw error
    return data as {
      id: string
      name: string
      whatsapp_phone_number_id: string
      whatsapp_number: string
      delivery_fee: number
      is_open: boolean
    }
  },
}

// ---------------------------------------------------------
// Admins
// ---------------------------------------------------------
export const adminService = {
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, name, role, is_active, last_login, created_at, updated_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin.from('admins').select('*').eq('id', id).single()
    if (error) throw error
    return data as Admin
  },

  async getByEmail(email: string) {
    const { data, error } = await supabaseAdmin.from('admins').select('*').eq('email', email).single()
    if (error) throw error
    return data as Admin
  },

  async create(admin: Omit<Admin, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin.from('admins').insert([admin]).select().single()
    if (error) throw error
    return data as Admin
  },

  async update(id: string, updates: Partial<Omit<Admin, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Admin
  },

  async updateLastLogin(id: string) {
    await supabaseAdmin.from('admins').update({ last_login: new Date().toISOString() }).eq('id', id)
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin.from('admins').delete().eq('id', id)
    if (error) throw error
  },
}
