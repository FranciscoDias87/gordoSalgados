import { NextRequest, NextResponse } from 'next/server'
import { adminService } from '@/lib/supabase-admin'
import { AuthService } from '@/lib/auth'
import { getAdminFromRequest, requireRole } from '@/lib/require-admin'

// GET /api/admins -> lista admins (qualquer admin logado pode ver, pro
// dashboard de estatísticas)
export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const admins = await adminService.getAll()
    return NextResponse.json(admins)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar admins.' }, { status: 500 })
  }
}

// POST /api/admins -> cria admin, só super_admin
export async function POST(request: NextRequest) {
  const admin = getAdminFromRequest(request)
  if (!requireRole(admin, ['super_admin'])) {
    return NextResponse.json({ error: 'Apenas super admins podem criar novos admins.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const password_hash = await AuthService.hashPassword(body.password)
    const newAdmin = await adminService.create({
      email: body.email,
      name: body.name,
      role: body.role || 'editor',
      is_active: body.is_active ?? true,
      password_hash,
    })
    const { password_hash: _omit, ...safeAdmin } = newAdmin
    return NextResponse.json(safeAdmin, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao criar admin.' }, { status: 500 })
  }
}
