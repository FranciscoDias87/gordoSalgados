import { NextRequest } from 'next/server'
import { AuthService, JWTPayload } from './auth'

/**
 * Lê o cookie httpOnly 'auth-token' e valida o JWT.
 * Retorna o payload do token ou null se não autenticado / inválido.
 * Use no início de toda rota de API que só o painel admin deve acessar.
 */
export function getAdminFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  return AuthService.verifyToken(token)
}

export function requireRole(admin: JWTPayload | null, roles: JWTPayload['role'][]): boolean {
  if (!admin) return false
  return roles.includes(admin.role)
}
