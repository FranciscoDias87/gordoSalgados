import '@testing-library/jest-dom';

// Mock de variáveis de ambiente para testes
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '7d';

// Suppressar logs de console nos testes (opcional)
// global.console.error = jest.fn();
// global.console.warn = jest.fn();
