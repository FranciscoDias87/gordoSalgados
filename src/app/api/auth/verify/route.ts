import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Extrair token do cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'Token não encontrado' },
        { status: 401 }
      );
    }

    // Verificar token
    const payload = AuthService.verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, message: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: payload
    });

  } catch (error) {
    console.error('Erro na verificação de autenticação:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}