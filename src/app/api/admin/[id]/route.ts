import { NextRequest, NextResponse } from 'next/server'
import { adminService } from '@/lib/supabase-admin'
import { getAdminFromRequest } from '@/lib/require-admin'

// GET /api/admin/:id -> retorna os dados públicos de UM admin.
// Antes desta rota, o hook use-auth.tsx chamava esse endpoint e sempre
// caía no fallback (404), preenchendo o admin com dados placeholder.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requester = getAdminFromRequest(request)
  if (!requester) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const { id } = await params
    // Um admin comum só pode ver os próprios dados; super_admin pode ver qualquer um.
    if (requester.userId !== id && requester.role !== 'super_admin') {
      return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 })
    }

    const admin = await adminService.getById(id)
    const { password_hash: _omit, ...safeAdmin } = admin
    return NextResponse.json(safeAdmin)
  } catch (err) {
    return NextResponse.json({ error: 'Admin não encontrado.' }, { status: 404 })
  }
}
