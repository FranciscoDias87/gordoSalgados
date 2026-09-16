if (typeof window !== 'undefined') {
  throw new Error('rate-limit.ts foi importado no navegador. Use apenas em route.ts.')
}

/**
 * Rate limiter em memória, janela fixa por chave.
 *
 * ⚠️ LIMITAÇÃO IMPORTANTE: isso vive na memória do processo Node. Em um
 * único container (Railway, Render, um VPS) funciona bem. Em ambiente
 * serverless com múltiplas instâncias (várias regiões da Vercel, por
 * exemplo), cada instância tem seu próprio contador — um atacante
 * distribuído entre instâncias pode passar do limite combinado.
 * Para produção com tráfego real ou múltiplas instâncias, troque por
 * um rate limiter compartilhado (ex: @upstash/ratelimit + Upstash
 * Redis, que tem free tier e é a opção mais simples pra Vercel).
 *
 * Mesmo com essa limitação, isso já barra 100% dos scripts simples de
 * spam/flood, que é o cenário mais provável contra uma rota pública
 * como /api/orders.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

// Evita crescimento infinito do Map em processos de vida longa —
// limpa entradas expiradas a cada 5 minutos.
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt < now) buckets.delete(key)
  }
}, 5 * 60 * 1000).unref?.()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInSeconds: number
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) }
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetInSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { allowed: true, remaining: limit - bucket.count, resetInSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
}

/** Extrai um identificador razoável do requisitante a partir dos headers. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}
