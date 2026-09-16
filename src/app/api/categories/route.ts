import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/require-admin'
import { adminCategoryService } from '@/lib/supabase-admin'

// GET /api/categories -> lista categorias (usa service role pra sempre
// retornar todas quando chamado pelo admin autenticado; anon key já
// resolve a listagem pública direto no client via supabase.ts).
export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const categories = await adminCategoryService.getAll()
    return NextResponse.json(categories)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar categorias.' }, { status: 500 })
  }
}
