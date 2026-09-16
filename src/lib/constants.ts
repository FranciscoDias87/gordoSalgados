// Constantes da aplicação

export const APP_CONFIG = {
  name: 'Gordo Salgados',
  description: 'Os melhores salgados artesanais da região',
  version: '1.0.0',
} as const;

export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    verify: '/api/auth/verify',
  },
  products: '/api/products',
  admins: '/api/admins',
} as const;

export const ROUTES = {
  home: '/',
  admin: {
    dashboard: '/admin',
    login: '/admin/login',
    products: '/admin/products',
    admins: '/admin/admins',
  },
} as const;

export const STORAGE_KEYS = {
  // Legacy - será removido após migração completa
  adminData: 'adminData',
  isAdmin: 'isAdmin',
} as const;

export const UI_CONFIG = {
  toast: {
    duration: 4000,
    position: 'top-right' as const,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  forms: {
    debounceDelay: 300,
  },
} as const;

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

export const ERROR_MESSAGES = {
  network: 'Erro de conexão. Verifique sua internet.',
  unauthorized: 'Acesso não autorizado.',
  forbidden: 'Acesso proibido.',
  notFound: 'Recurso não encontrado.',
  serverError: 'Erro interno do servidor.',
  validation: 'Dados inválidos.',
} as const;