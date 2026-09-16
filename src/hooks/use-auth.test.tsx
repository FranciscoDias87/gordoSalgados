import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { useAuth, AuthProvider } from './use-auth';

// Mock da API fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Componente de teste que usa o hook
function TestComponent() {
  const { admin, isLoading, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Ready'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
      <div data-testid="admin-email">{admin?.email || 'No email'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('useAuth Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthProvider and initial state', () => {
    it('deve renderizar com estado inicial não autenticado', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: false })
      } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
    });

    it('deve chamar checkAuth ao montar', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: false })
      } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/verify', expect.any(Object));
      });
    });
  });

  describe('login function', () => {
    it('deve fazer login com sucesso', async () => {
      const mockAdmin = {
        id: 'admin-123',
        email: 'test@example.com',
        name: 'Test Admin',
        role: 'super_admin',
        is_active: true
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ authenticated: false })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            admin: mockAdmin
          })
        } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      });

      expect(screen.getByTestId('admin-email')).toHaveTextContent('test@example.com');
    });

    it('deve retornar erro para login com falha', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ authenticated: false })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: false,
            error: 'Invalid credentials'
          })
        } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
      });
    });

    it('deve enviar credenciais corretas para o endpoint de login', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ authenticated: false })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: false,
            error: 'Invalid credentials'
          })
        } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        const loginCall = mockFetch.mock.calls.find(
          call => (call[0] as string).includes('/api/auth/login')
        );
        expect(loginCall).toBeDefined();
        expect(loginCall?.[0]).toBe('/api/auth/login');
        expect(loginCall?.[1]?.method).toBe('POST');
      });
    });
  });

  describe('logout function', () => {
    it('deve fazer logout com sucesso', async () => {
      const mockAdmin = {
        id: 'admin-123',
        email: 'test@example.com',
        name: 'Test Admin',
        role: 'super_admin',
        is_active: true
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ authenticated: false })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            admin: mockAdmin
          })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
      });

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      });

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
      });
    });

    it('deve chamar endpoint de logout', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ authenticated: false })
      } as Response);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        const logoutCall = mockFetch.mock.calls.find(
          call => (call[0] as string).includes('/api/auth/logout')
        );
        expect(logoutCall).toBeDefined();
      });
    });
  });

  describe('error handling', () => {
    it('deve lidar com erro de rede gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
      });
    });

    it('deve usar AuthProvider', () => {
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });

  describe('loading states', () => {
    it('deve mostrar loading ao verificar autenticação', async () => {
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => 
            resolve({
              ok: true,
              json: async () => ({ authenticated: false })
            } as Response),
            100
          )
        )
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
      });
    });

    it('deve mostrar loading durante login', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ authenticated: false })
        } as Response)
        .mockImplementation(() =>
          new Promise(resolve =>
            setTimeout(() =>
              resolve({
                ok: true,
                json: async () => ({
                  success: true,
                  admin: {
                    id: 'admin-123',
                    email: 'test@example.com',
                    name: 'Test Admin',
                    role: 'super_admin',
                    is_active: true
                  }
                })
              } as Response),
              100
            )
          )
        );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
      });

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      // Durante o login, isLoading deve ser true
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
      });
    });
  });
});
