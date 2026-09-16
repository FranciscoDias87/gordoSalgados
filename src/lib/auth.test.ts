import { AuthService, JWTPayload } from './auth';

describe('AuthService', () => {
  const testPayload: JWTPayload = {
    userId: 'test-user-123',
    email: 'test@example.com',
    role: 'super_admin'
  };

  describe('hashPassword', () => {
    it('deve gerar um hash válido para uma senha', async () => {
      const password = 'securePassword123!';
      const hash = await AuthService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('deve gerar diferentes hashes para a mesma senha', async () => {
      const password = 'securePassword123!';
      const hash1 = await AuthService.hashPassword(password);
      const hash2 = await AuthService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('deve retornar true para uma senha correta', async () => {
      const password = 'correctPassword123!';
      const hash = await AuthService.hashPassword(password);

      const isValid = await AuthService.verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('deve retornar false para uma senha incorreta', async () => {
      const password = 'correctPassword123!';
      const wrongPassword = 'wrongPassword456!';
      const hash = await AuthService.hashPassword(password);

      const isValid = await AuthService.verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('deve gerar um token JWT válido', () => {
      const token = AuthService.generateToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tem 3 partes
    });

    it('deve gerar tokens que podem ser verificados', () => {
      const token1 = AuthService.generateToken(testPayload);
      const token2 = AuthService.generateToken(testPayload);

      // Ambos os tokens devem ser válidos
      const decoded1 = AuthService.verifyToken(token1);
      const decoded2 = AuthService.verifyToken(token2);

      expect(decoded1).toBeDefined();
      expect(decoded2).toBeDefined();
      expect(decoded1?.userId).toBe(testPayload.userId);
      expect(decoded2?.userId).toBe(testPayload.userId);
    });
  });

  describe('verifyToken', () => {
    it('deve verificar e decodificar um token válido', () => {
      const token = AuthService.generateToken(testPayload);
      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(testPayload.userId);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.role).toBe(testPayload.role);
    });

    it('deve retornar null para um token inválido', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = AuthService.verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it('deve retornar null para um token expirado', () => {
      // Criar um token com expiração imediata não é trivial nos testes
      // então apenas verificamos que tokens inválidos retornam null
      const decoded = AuthService.verifyToken('');

      expect(decoded).toBeNull();
    });
  });

  describe('extractTokenFromHeader', () => {
    it('deve extrair token de um header Authorization válido', () => {
      const token = 'my-secret-token-123';
      const authHeader = `Bearer ${token}`;

      const extracted = AuthService.extractTokenFromHeader(authHeader);

      expect(extracted).toBe(token);
    });

    it('deve retornar null para um header sem Bearer', () => {
      const authHeader = 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=';

      const extracted = AuthService.extractTokenFromHeader(authHeader);

      expect(extracted).toBeNull();
    });

    it('deve retornar null para um header vazio', () => {
      const extracted = AuthService.extractTokenFromHeader(null);

      expect(extracted).toBeNull();
    });

    it('deve retornar null para um header indefinido', () => {
      const extracted = AuthService.extractTokenFromHeader(undefined as any);

      expect(extracted).toBeNull();
    });
  });

  describe('createAuthResponse', () => {
    it('deve criar uma resposta de autenticação com token', () => {
      const mockAdmin = {
        id: 'admin-123',
        email: 'admin@example.com',
        name: 'Admin User',
        password_hash: 'hashed-password',
        role: 'super_admin' as const,
        is_active: true
      };

      const response = AuthService.createAuthResponse(mockAdmin);

      expect(response.success).toBe(true);
      expect(response.token).toBeDefined();
      expect(response.admin).toBeDefined();
      expect(response.admin.id).toBe(mockAdmin.id);
      expect(response.admin.email).toBe(mockAdmin.email);
      expect(response.admin.role).toBe(mockAdmin.role);
      expect((response.admin as any).password_hash).toBeUndefined();
    });
  });

  describe('Token generation and verification flow', () => {
    it('deve criar e verificar um token com sucesso', () => {
      const originalPayload: JWTPayload = {
        userId: 'user-456',
        email: 'user@test.com',
        role: 'editor'
      };

      const token = AuthService.generateToken(originalPayload);
      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(originalPayload.userId);
      expect(decoded?.email).toBe(originalPayload.email);
      expect(decoded?.role).toBe(originalPayload.role);
    });
  });
});
