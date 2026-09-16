import { NextRequest, NextResponse } from 'next/server'
import { adminProductService } from '@/lib/supabase-admin'
import { getAdminFromRequest } from '@/lib/require-admin'

// GET /api/products -> lista TODOS os produtos (incluindo indisponíveis),
// usado pelo painel admin. Requer login (a listagem pública do cardápio
// usa o cliente supabase anon direto, que só vê os disponíveis via RLS).
export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const products = await adminProductService.getAll()
    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar produtos.' }, { status: 500 })
  }
}

// POST /api/products -> cria produto
export async function POST(request: NextRequest) {
  const admin = getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const body = await request.json()
    const product = await adminProductService.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao criar produto.' }, { status: 500 })
  }
}
