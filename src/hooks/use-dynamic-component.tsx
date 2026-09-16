'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface DynamicOptions {
  loading?: () => React.ReactNode;
  ssr?: boolean;
}

/**
 * Hook wrapper para dynamic() do Next.js com tipos melhorados
 */
export function useDynamicComponent<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options?: DynamicOptions
) {
  return dynamic(importFunc, {
    loading: options?.loading,
    ssr: options?.ssr !== false, // SSR habilitado por padrão
  });
}

/**
 * Carrega componentes pesados dinamicamente
 * Útil para componentes que só são renderizados em certas condições
 */
export const LazyCarousel = dynamic(
  () => import('@/components/ui/carousel').then((mod) => ({
    default: mod.Carousel,
  })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-muted animate-pulse rounded-lg" />,
  }
);

/**
 * Carrega o admin layout dinamicamente
 */
export const LazyAdminLayout = dynamic(
  () => import('@/app/admin/layout'),
  {
    ssr: true,
    loading: () => <div className="h-screen bg-muted animate-pulse" />,
  }
);

/**
 * Carrega o WhatsApp FAB dinamicamente (apenas no client)
 */
export const LazyWhatsAppFab = dynamic(
  () => import('@/components/whatsapp-fab').then((mod) => ({
    default: mod.WhatsAppFab,
  })),
  {
    ssr: false,
  }
);

/**
 * Carrega admin form dinamicamente
 */
export const LazyAdminForm = dynamic(
  () => import('@/components/admin/admin-form').then((mod) => mod.AdminForm),
  {
    ssr: false,
    loading: () => <div className="space-y-4">
      <div className="h-10 bg-muted animate-pulse rounded" />
      <div className="h-10 bg-muted animate-pulse rounded" />
      <div className="h-10 bg-muted animate-pulse rounded" />
    </div>,
  }
);

/**
 * Carrega product form dinamicamente
 */
export const LazyProductForm = dynamic(
  () => import('@/components/admin/product-form').then((mod)=>mod.ProductForm),
  {
    ssr: false,
    loading: () => <div className="space-y-4">
      <div className="h-10 bg-muted animate-pulse rounded" />
      <div className="h-10 bg-muted animate-pulse rounded" />
      <div className="h-10 bg-muted animate-pulse rounded" />
    </div>,
  }
);
