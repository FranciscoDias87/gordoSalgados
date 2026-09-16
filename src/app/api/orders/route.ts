import { NextRequest, NextResponse } from 'next/server'
import { orderService, settingsService } from '@/lib/supabase-admin'
import { sendTemplateMessage, formatOrderMessage } from '@/lib/whatsapp'
import { getAdminFromRequest } from '@/lib/require-admin'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import type { OrderItem } from '@/lib/supabase'

// POST /api/orders -> rota PÚBLICA (é o cliente do site que chama isso
// ao finalizar o carrinho). Salva o pedido e notifica o restaurante
// automaticamente via template da Cloud API.
export async function POST(request: NextRequest) {
  // Rate limit por IP: 5 pedidos a cada 10 minutos. É uma rota pública
  // sem login, então é o alvo óbvio pra spam/flood — isso não impede um
  // cliente legítimo de fazer pedidos normalmente, mas barra scripts.
  const ip = getClientIp(request)
  const rateLimit = checkRateLimit(`orders:${ip}`, 5, 10 * 60 * 1000)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Muitos pedidos em pouco tempo. Tente novamente em alguns minutos.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.resetInSeconds) } }
    )
  }

  try {
    const body = await request.json()
    const {
      customer_name,
      customer_phone,
      items,
      delivery_type,
      address,
    }: {
      customer_name: string
      customer_phone: string
      items: OrderItem[]
      delivery_type: 'entrega' | 'retirada'
      address?: string
    } = body

    if (!customer_name?.trim() || !customer_phone?.trim() || !items?.length) {
      return NextResponse.json({ error: 'Dados do pedido incompletos.' }, { status: 400 })
    }

    const subtotal = items.reduce((sum, i) => sum + i.qty * i.unit_price, 0)
    const settings = await settingsService.get()
    const delivery_fee = delivery_type === 'entrega' ? Number(settings.delivery_fee || 0) : 0
    const total = subtotal + delivery_fee

    const order = await orderService.create({
      customer_name,
      customer_phone,
      items,
      subtotal,
      delivery_fee,
      total,
      delivery_type,
      address,
    })

    // Notifica o dono via template (ele normalmente está fora da janela
    // de 24h, então texto livre não funcionaria — precisa ser template).
    try {
      const waResponse = await sendTemplateMessage(settings.whatsapp_number, 'novo_pedido', 'pt_BR', [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: String(order.order_number) },
            { type: 'text', text: customer_name },
            { type: 'text', text: `R$ ${total.toFixed(2)}` },
          ],
        },
      ])
      if (waResponse.messages?.[0]?.id) {
        await orderService.updateWhatsappMessageId(order.id, waResponse.messages[0].id)
      }
    } catch (waError) {
      console.error('Falha ao enviar notificação automática via WhatsApp:', waError)
      // Não derruba o pedido — o link wa.me abaixo funciona como plano B.
    }

    const mensagemFormatada = formatOrderMessage(order)
    const whatsapp_link = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(mensagemFormatada)}`

    return NextResponse.json({ order, whatsapp_link }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao criar pedido.' }, { status: 500 })
  }
}

// GET /api/orders -> lista pedidos, só pro painel admin
export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const orders = await orderService.getAll()
    return NextResponse.json(orders)
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao buscar pedidos.' }, { status: 500 })
  }
}
