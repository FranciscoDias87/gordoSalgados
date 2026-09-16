import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/lib/supabase-admin'
import { verifyMetaWebhookSignature } from '@/lib/verify-webhook-signature'

// GET /api/webhook -> a Meta chama isso UMA VEZ para validar a URL do webhook
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse(null, { status: 403 })
}

// POST /api/webhook -> eventos de mensagens recebidas
export async function POST(request: NextRequest) {
  // Lê o corpo como texto BRUTO antes de qualquer parse — a assinatura
  // é calculada sobre os bytes exatos que a Meta enviou, então um
  // JSON.parse seguido de stringify já quebraria a comparação.
  const rawBody = await request.text()
  const signature = request.headers.get('x-hub-signature-256')

  if (!verifyMetaWebhookSignature(rawBody, signature)) {
    console.warn('Webhook recebido com assinatura inválida ou ausente — descartado.')
    // 401 é intencional: isso não veio da Meta, então não faz sentido
    // devolver 200 "de boa fé" como fazemos pros eventos legítimos.
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 })
  }

  try {
    const body = JSON.parse(rawBody)
    const entry = body.entry?.[0]
    const change = entry?.changes?.[0]?.value
    const message = change?.messages?.[0]

    if (!message) return NextResponse.json({ ok: true }) // evento de status (entregue/lido), ignorado

    const text = (message.text?.body || '').trim().toLowerCase()

    // Automação simples: dono responde "confirmar 42" no WhatsApp pra
    // confirmar o pedido #42 sem precisar abrir o painel.
    const match = text.match(/^confirmar\s+(\d+)/)
    if (match) {
      const orderNumber = Number(match[1])
      try {
        const order = await orderService.findByOrderNumber(orderNumber)
        await orderService.updateStatus(order.id, 'confirmado')
      } catch {
        // pedido não encontrado — ignora silenciosamente
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Erro processando webhook:', err)
    return NextResponse.json({ ok: true }) // sempre 200 pra Meta não reenviar
  }
}
