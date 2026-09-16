import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from './supabase';

// Sem fallback hardcoded de propósito: um segredo público no repositório
// permite forjar tokens de admin válidos. Se a env var não existir, a
// aplicação quebra no boot em vez de rodar "segura" com um segredo conhecido.
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurado no .env — defina uma string aleatória longa antes de iniciar a aplicação.');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'super_admin' | 'editor' | 'viewer';
}

export class AuthService {
  /**
   * Hash uma senha usando bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verificar se uma senha corresponde ao hash
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Gerar token JWT
   */
  static generateToken(payload: JWTPayload): string {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'gordo-salgados-admin',
      audience: 'gordo-salgados-users'
    });
  }

  /**
   * Verificar e decodificar token JWT
   */
  static verifyToken(token: string): JWTPayload | null {
    if (!JWT_SECRET) {
      console.error('JWT_SECRET não configurado');
      return null;
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'gordo-salgados-admin',
        audience: 'gordo-salgados-users'
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Extrair token do header Authorization
   */
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  /**
   * Criar resposta de sucesso com token
   */
  static createAuthResponse(admin: Admin) {
    const token = this.generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role
    });

    return {
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  }

  /**
   * Criar resposta de erro
   */
  static createErrorResponse(message: string, statusCode = 401) {
    return {
      success: false,
      error: message,
      statusCode
    };
  }
}