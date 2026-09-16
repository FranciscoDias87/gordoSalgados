import { NextRequest, NextResponse } from 'next/server'
import { adminService } from '@/lib/supabase-admin'
import { AuthService } from '@/lib/auth'
import { getAdminFromRequest, requireRole } from '@/lib/require-admin'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(request)
  if (!requireRole(admin, ['super_admin'])) {
    return NextResponse.json({ error: 'Apenas super admins podem editar admins.' }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const updates: Record<string, unknown> = { ...body }
    if (body.password) {
      updates.password_hash = await AuthService.hashPassword(body.password)
      delete updates.password
    }
    const updated = await adminService.update(id, updates)
    const { password_hash: _omit, ...safeAdmin } = updated
    return NextResponse.json(safeAdmin)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao atualizar admin.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(request)
  if (!requireRole(admin, ['super_admin'])) {
    return NextResponse.json({ error: 'Apenas super admins podem excluir admins.' }, { status: 403 })
  }

  try {
    const { id } = await params
    if (admin?.userId === id) {
      return NextResponse.json({ error: 'Você não pode excluir sua própria conta.' }, { status: 400 })
    }
    await adminService.delete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao excluir admin.' }, { status: 500 })
  }
}
