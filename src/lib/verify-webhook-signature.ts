import crypto from 'crypto'

if (typeof window !== 'undefined') {
  throw new Error('verify-webhook-signature.ts foi importado no navegador. Use apenas em route.ts.')
}

/**
 * Verifica o header X-Hub-Signature-256 que a Meta envia em todo POST
 * de webhook. Sem isso, qualquer pessoa que descobrir a URL do webhook
 * consegue mandar um POST forjado (ex: "confirmar 42") e mexer em
 * pedidos sem nunca ter passado pela Meta de verdade.
 *
 * A assinatura é um HMAC-SHA256 do corpo BRUTO da requisição, usando o
 * App Secret do app na Meta (Configurações Básicas do App > App Secret
 * — NÃO é o WHATSAPP_TOKEN). Por isso é essencial ler o body como texto
 * puro antes de fazer JSON.parse: qualquer diferença de espaçamento
 * gerada por um parse+stringify faria a assinatura não bater.
 */
export function verifyMetaWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET

  if (!appSecret) {
    // Sem app secret configurado não dá pra verificar nada — falha
    // fechada (nega) em vez de aberta, pra não criar uma falsa sensação
    // de segurança.
    console.error('WHATSAPP_APP_SECRET não configurado — recusando webhook por segurança.')
    return false
  }

  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false
  }

  const receivedSignature = signatureHeader.slice('sha256='.length)
  const expectedSignature = crypto.createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex')

  const receivedBuffer = Buffer.from(receivedSignature, 'hex')
  const expectedBuffer = Buffer.from(expectedSignature, 'hex')

  // Buffers de tamanho diferente quebrariam o timingSafeEqual — trata
  // isso como "não bate" em vez de deixar a exceção vazar.
  if (receivedBuffer.length !== expectedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
}
