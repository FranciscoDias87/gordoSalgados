import type { Order } from './supabase'

if (typeof window !== 'undefined') {
  throw new Error('whatsapp.ts foi importado no navegador. Use apenas em src/app/api/**/route.ts.')
}

const GRAPH_URL = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

async function callGraphApi(body: Record<string, unknown>) {
  const res = await fetch(GRAPH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Meta Cloud API error: ${JSON.stringify(data)}`)
  }
  return data
}

/**
 * Mensagem de texto livre. Só funciona dentro da janela de 24h — ou seja,
 * depois que o destinatário mandou mensagem pro número recentemente.
 */
export async function sendTextMessage(to: string, body: string) {
  return callGraphApi({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body },
  })
}

/**
 * Mensagem via template aprovado. Funciona mesmo fora da janela de 24h —
 * é o único jeito de iniciar uma conversa (ex: avisar o dono de pedido novo).
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  components: Record<string, unknown>[] = []
) {
  return callGraphApi({
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: { name: templateName, language: { code: languageCode }, components },
  })
}

export function formatOrderMessage(order: Order) {
  const itemsText = order.items
    .map((i) => `${i.qty}x ${i.name} — R$ ${(i.qty * i.unit_price).toFixed(2)}`)
    .join('\n')

  return (
    `*Novo pedido #${order.order_number}*\n\n` +
    `${itemsText}\n\n` +
    `*Subtotal:* R$ ${order.subtotal.toFixed(2)}\n` +
    `*Taxa de entrega:* R$ ${order.delivery_fee.toFixed(2)}\n` +
    `*Total:* R$ ${order.total.toFixed(2)}\n\n` +
    `*Cliente:* ${order.customer_name}\n` +
    `*Tipo:* ${order.delivery_type}` +
    (order.address ? `\n*Endereço:* ${order.address}` : '')
  )
}
