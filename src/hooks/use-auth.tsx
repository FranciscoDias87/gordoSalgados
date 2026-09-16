'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Admin } from '@/lib/supabase';
import { AuthService, JWTPayload } from '@/lib/auth';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!admin;

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // Verificar se há token no cookie fazendo requisição para API
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include', // Importante para enviar cookies
      });

      const data = await response.json();

      if (data.authenticated && data.user) {
        // Buscar dados completos do admin
        const adminResponse = await fetch(`/api/admin/${data.user.userId}`);
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          setAdmin(adminData);
        } else {
          // Fallback: criar admin básico a partir do token
          setAdmin({
            id: data.user.userId,
            email: data.user.email,
            name: 'Admin', // Placeholder
            password_hash: '', // Não usado neste contexto
            role: data.user.role,
            is_active: true
          });
        }
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para receber cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.admin);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Erro no login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setAdmin(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}