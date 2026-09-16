# 🖼️ Guia de Otimização de Imagens com Next.js

## Otimizações Implementadas

### 1. **next.config.ts**
- ✅ Suporte a AVIF e WebP (formatos modernos)
- ✅ Device sizes otimizados
- ✅ Cache de imagens por 1 ano em produção
- ✅ Padrões de domínio remoto configurados

### 2. **Componentes Otimizados** (`src/components/optimized-image.tsx`)

#### `OptimizedImage`
Componente base com suporte a:
- Lazy loading automático
- Placeholder blur
- Aspect ratios predefinidos
- Fallback customizável

```tsx
import { OptimizedImage } from '@/components/optimized-image';

<OptimizedImage
  src="/image.jpg"
  alt="Descrição"
  width={400}
  height={300}
  priority={false}
  aspectRatio="square"
/>
```

#### `ResponsiveImage`
Para imagens que preenchem todo o container (fill):
```tsx
import { ResponsiveImage } from '@/components/optimized-image';

<ResponsiveImage
  src="/image.jpg"
  alt="Hero"
  containerClassName="relative h-80 w-full"
  priority
/>
```

#### `FixedImage`
Para imagens com dimensões fixas:
```tsx
import { FixedImage } from '@/components/optimized-image';

<FixedImage
  src="/image.jpg"
  alt="Avatar"
  width={200}
  height={200}
/>
```

## Benefícios

✅ **Redução de Tamanho**: Conversão automática para AVIF/WebP (~30-50% menores)
✅ **Lazy Loading**: Carregamento sob demanda (melhora performance)
✅ **Responsividade**: Srcset automático para diferentes dispositivos
✅ **Cache**: Imagens cacheadas por 1 ano em produção
✅ **Segurança**: Validação de domínios remotos

## Métricas Esperadas

- **LCP (Largest Contentful Paint)**: ⬇️ 20-30%
- **CLS (Cumulative Layout Shift)**: ✅ 0 (aspect ratio reservado)
- **Tamanho Total**: ⬇️ 40-60%

## Boas Práticas

1. **Use `priority` em imagens acima da fold (above the fold)**
2. **Sempre defina `alt` para acessibilidade**
3. **Use `loading="lazy"` para imagens abaixo da fold**
4. **Defina `width` e `height` para evitar layout shift**
5. **Use aspect ratios predefinidos quando possível**

## Exemplo de Migração

### Antes
```tsx
<img src="/image.jpg" alt="Product" />
```

### Depois
```tsx
<ResponsiveImage
  src="/image.jpg"
  alt="Product"
  containerClassName="relative h-64 w-full"
  loading="lazy"
/>
```

## Recursos Adicionais

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Image Component API](https://nextjs.org/docs/app/api-reference/components/image)
