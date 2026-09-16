import { NextRequest, NextResponse } from 'next/server';
import { adminService } from '@/lib/supabase-admin';
import { AuthService } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import type { Admin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  // 10 tentativas a cada 15 minutos por IP — suficiente pra alguém
  // errar a senha algumas vezes, mas inviabiliza força bruta.
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      AuthService.createErrorResponse('Muitas tentativas de login. Tente novamente mais tarde.', 429),
      { status: 429, headers: { 'Retry-After': String(rateLimit.resetInSeconds) } }
    );
  }

  try {
    const { email, password } = await request.json();

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        AuthService.createErrorResponse('Email e senha são obrigatórios'),
        { status: 400 }
      );
    }

    // Buscar admin por email (getByEmail usa .single() do Supabase, que
    // lança erro quando não encontra nada — por isso o try/catch aqui em
    // vez de checar `if (!admin)`, que nunca seria alcançado)
    let admin: Admin;
    try {
      admin = await adminService.getByEmail(email);
    } catch {
      return NextResponse.json(
        AuthService.createErrorResponse('Credenciais inválidas'),
        { status: 401 }
      );
    }

    // Verificar se admin está ativo
    if (!admin.is_active) {
      return NextResponse.json(
        AuthService.createErrorResponse('Conta desativada'),
        { status: 401 }
      );
    }

    // Verificar senha com bcrypt
    const isValidPassword = await AuthService.verifyPassword(password, admin.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        AuthService.createErrorResponse('Credenciais inválidas'),
        { status: 401 }
      );
    }

    // Atualizar last_login
    await adminService.updateLastLogin(admin.id);

    // Criar resposta com token
    const authResponse = AuthService.createAuthResponse(admin);

    // Criar resposta com cookie httpOnly
    const response = NextResponse.json(authResponse);

    // Configurar cookie httpOnly seguro
    response.cookies.set('auth-token', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    });

    //console.log(`✅ Login bem-sucedido: ${admin.email} (${admin.role})`);

    return response;

  } catch (error) {
    return NextResponse.json(
      AuthService.createErrorResponse('Erro interno do servidor'),
      { status: 500 }
    );
  }
}