'use client';

import { lazy, Suspense, ComponentType, ReactNode } from 'react';

interface LazyLoadProps {
  fallback?: ReactNode;
  className?: string;
}

/**
 * Cria um componente com lazy loading automático
 * @param importFunc Função que importa o componente dinamicamente
 * @param fallback Componente a renderizar enquanto carrega (padrão: Skeleton)
 */
export function useLazyComponent<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) {
  const Component = lazy(importFunc);

  return function LazyComponent(props: P & LazyLoadProps) {
    const { fallback: customFallback, className, ...componentProps } = props;
    const finalFallback = customFallback || fallback || <DefaultSkeleton />;

    return (
      <Suspense fallback={finalFallback}>
        <div className={className}>
          <Component {...(componentProps as P)} />
        </div>
      </Suspense>
    );
  };
}

/**
 * Wrapper para componentes com Suspense e fallback customizável
 */
export function LazyBoundary({
  children,
  fallback,
  className = '',
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <Suspense fallback={fallback || <DefaultSkeleton />}>
      <div className={className}>{children}</div>
    </Suspense>
  );
}

/**
 * Skeleton padrão para loading
 */
function DefaultSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  );
}

/**
 * Componente skeleton customizável
 */
export function Skeleton({
  className = 'h-4 w-full bg-muted rounded',
}: {
  className?: string;
}) {
  return <div className={`animate-pulse ${className}`} />;
}

/**
 * Skeleton para cartão de produto
 */
export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

/**
 * Skeleton para lista de produtos
 */
export function ProductListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton para hero section
 */
export function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-80 md:h-[450px] w-full rounded-2xl" />
    </div>
  );
}
