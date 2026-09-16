import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Criar resposta de logout
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

    // Remover cookie de autenticação
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expira imediatamente
      path: '/'
    });

    //console.log('✅ Logout realizado com sucesso');

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}