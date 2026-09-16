import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/lib/supabase-admin'
import { sendTextMessage } from '@/lib/whatsapp'
import { getAdminFromRequest } from '@/lib/require-admin'
import type { Order } from '@/lib/supabase'

const STATUS_MESSAGES: Record<Order['status'], string | null> = {
  pendente: null,
  confirmado: 'Seu pedido foi confirmado! ✅',
  preparo: 'Seu pedido está sendo preparado 👨‍🍳',
  saiu_entrega: 'Seu pedido saiu para entrega 🛵',
  concluido: 'Pedido entregue. Bom apetite! 🎉',
  cancelado: 'Seu pedido foi cancelado.',
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const { id } = await params
    const { status }: { status: Order['status'] } = await request.json()

    const validStatuses: Order['status'][] = [
      'pendente', 'confirmado', 'preparo', 'saiu_entrega', 'concluido', 'cancelado',
    ]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
    }

    const order = await orderService.updateStatus(id, status)

    const message = STATUS_MESSAGES[status]
    if (message) {
      try {
        // Só funciona se o cliente estiver dentro da janela de 24h (ou
        // seja, ele mandou mensagem pro número recentemente — o que
        // normalmente acontece, já que ele confirma o pedido pelo wa.me).
        await sendTextMessage(order.customer_phone, message)
      } catch {
        console.warn('Cliente fora da janela de 24h — aviso de status não enviado automaticamente.')
      }
    }

    return NextResponse.json(order)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao atualizar status do pedido.' }, { status: 500 })
  }
}
