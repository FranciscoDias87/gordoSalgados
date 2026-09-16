# 🚀 Guia de Lazy Loading em Componentes

## Implementações Disponíveis

### 1. **React.lazy() + Suspense** (`use-lazy-component.tsx`)
Para componentes renderizados no cliente com Suspense.

```tsx
import { useLazyComponent, LazyBoundary } from '@/hooks/use-lazy-component';

// Abordagem 1: Hook customizado
const MyComponent = useLazyComponent(
  () => import('@/components/MyComponent'),
  <div>Carregando...</div>
);

// Abordagem 2: Boundary wrapper
<LazyBoundary fallback={<ProductListSkeleton />}>
  <ProductList />
</LazyBoundary>
```

### 2. **Next.js Dynamic** (`use-dynamic-component.tsx`)
Para componentes com code splitting automático.

```tsx
import { useDynamicComponent, LazyWhatsAppFab } from '@/hooks/use-dynamic-component';

// Abordagem 1: Hook wrapper
const HeavyComponent = useDynamicComponent(
  () => import('@/components/HeavyComponent'),
  { ssr: false }
);

// Abordagem 2: Componentes pré-configurados
<LazyWhatsAppFab /> // Carrega apenas no cliente
```

## Skeleton Components

### Componentes Predefinidos
- **`Skeleton`** - Skeleton genérico
- **`ProductCardSkeleton`** - Para cartões de produto
- **`ProductListSkeleton`** - Para listas de produtos
- **`HeroSkeleton`** - Para seção hero

```tsx
<ProductListSkeleton count={4} />
<HeroSkeleton />
```

## Estratégias de Lazy Loading

### 1. **Route-based Lazy Loading**
```tsx
// Componentes de rota carregam apenas quando visitados
// Next.js faz isso automaticamente com app router
```

### 2. **Component-based Lazy Loading**
```tsx
const HeavyChart = dynamic(
  () => import('@/components/Chart'),
  { 
    ssr: false,
    loading: () => <ChartSkeleton />
  }
);
```

### 3. **Conditional Lazy Loading**
```tsx
{showCarousel && (
  <LazyBoundary fallback={<CarouselSkeleton />}>
    <Carousel />
  </LazyBoundary>
)}
```

## Melhores Práticas

✅ **Use SSR quando apropriado** - Para SEO em produção
```tsx
const Component = dynamic(() => import('@/components/Component'), {
  ssr: true // Renderiza no servidor e cliente
});
```

✅ **Use ssr: false para componentes client-only**
```tsx
const InteractiveComponent = dynamic(
  () => import('@/components/Interactive'),
  { ssr: false } // Apenas no cliente
);
```

✅ **Sempre forneça fallback customizado**
```tsx
<LazyBoundary fallback={<ProductCardSkeleton />}>
  <Product />
</LazyBoundary>
```

✅ **Agrupe componentes relacionados**
```tsx
const AdminPanel = dynamic(
  () => import('@/components/admin/Panel'),
  { ssr: false, loading: () => <AdminSkeleton /> }
);
```

## Impacto na Performance

### JavaScript Bundle
- ✅ Code splitting: Reduz bundle inicial
- ✅ Carregamento sob demanda: Melhora FCP
- ✅ Priorização: LCP otimizado

### Métricas Esperadas
- **FCP**: ⬇️ 30-40%
- **TTI**: ⬇️ 20-30%
- **Bundle Size**: ⬇️ 15-25%

## Exemplo Completo

```tsx
'use client';

import { LazyBoundary, ProductListSkeleton } from '@/hooks/use-lazy-component';
import dynamic from 'next/dynamic';

// Carrega dinamicamente
const ProductList = dynamic(
  () => import('@/components/ProductList'),
  {
    ssr: false,
    loading: () => <ProductListSkeleton count={4} />
  }
);

export function Page() {
  return (
    <LazyBoundary fallback={<ProductListSkeleton />}>
      <ProductList />
    </LazyBoundary>
  );
}
```

## Problemas Comuns

### ❌ Problema: Componentes não carregam
```tsx
// ❌ Errado - usar dynamic fora do escopo
const Component = dynamic(() => import('@/components/Component'));

// ✅ Correto - usar dentro do componente ou no nível de módulo
export default dynamic(() => import('@/components/Component'));
```

### ❌ Problema: Layout shift durante carregamento
```tsx
// ❌ Errado - sem container reservado
<LazyBoundary fallback={<div>Loading</div>}>
  <Component />
</LazyBoundary>

// ✅ Correto - com tamanho reservado
<LazyBoundary fallback={<ProductCardSkeleton />}>
  <Component />
</LazyBoundary>
```

### ❌ Problema: SSR desabilitado sem motivo
```tsx
// ❌ Errado - pode prejudicar SEO
const Button = dynamic(() => import('@/components/Button'), {
  ssr: false
});

// ✅ Correto - apenas para componentes que precisam
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false
});
```

## Recursos Adicionais

- [React.lazy() Documentation](https://react.dev/reference/react/lazy)
- [Suspense Documentation](https://react.dev/reference/react/Suspense)
- [Next.js dynamic() API](https://nextjs.org/docs/app/building-your-application/optimizing/dynamic-imports)
