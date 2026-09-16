import { NextRequest, NextResponse } from 'next/server'
import { adminProductService } from '@/lib/supabase-admin'
import { getAdminFromRequest } from '@/lib/require-admin'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const product = await adminProductService.update(id, body)
    return NextResponse.json(product)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao atualizar produto.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const { id } = await params
    await adminProductService.delete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao excluir produto.' }, { status: 500 })
  }
}
