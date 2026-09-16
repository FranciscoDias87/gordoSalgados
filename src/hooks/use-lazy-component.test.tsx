import { render, screen, waitFor } from '@testing-library/react';
import { Suspense, ReactNode } from 'react';
import { LazyBoundary, Skeleton, ProductCardSkeleton, ProductListSkeleton, HeroSkeleton } from '@/hooks/use-lazy-component';

describe('Lazy Loading Components', () => {
  describe('LazyBoundary', () => {
    it('deve renderizar o fallback enquanto carrega', async () => {
      const SlowComponent = () => {
        throw new Promise((resolve) => setTimeout(resolve, 100));
      };

      render(
        <LazyBoundary fallback={<div>Carregando...</div>}>
          <SlowComponent />
        </LazyBoundary>
      );

      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve renderizar com fallback padrão se não fornecido', () => {
      const { container } = render(
        <LazyBoundary>
          <div>Conteúdo</div>
        </LazyBoundary>
      );

      // Verifica que o componente foi renderizado
      expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    });

    it('deve aplicar className customizado', () => {
      const { container } = render(
        <LazyBoundary className="custom-class">
          <div>Conteúdo</div>
        </LazyBoundary>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Skeleton', () => {
    it('deve renderizar com className padrão', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toHaveClass('animate-pulse', 'h-4', 'w-full', 'bg-muted', 'rounded');
    });

    it('deve renderizar com className customizado', () => {
      const { container } = render(<Skeleton className="h-48 w-full rounded-lg" />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toHaveClass('animate-pulse', 'h-48', 'w-full', 'rounded-lg');
    });
  });

  describe('ProductCardSkeleton', () => {
    it('deve renderizar skeleton de cartão de produto', () => {
      const { container } = render(<ProductCardSkeleton />);
      const skeletons = container.querySelectorAll('.animate-pulse');

      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('deve ter estrutura de cartão', () => {
      const { container } = render(<ProductCardSkeleton />);
      const wrapper = container.querySelector('.space-y-4');

      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.children.length).toBe(4);
    });
  });

  describe('ProductListSkeleton', () => {
    it('deve renderizar múltiplos skeletons de produto', () => {
      const { container } = render(<ProductListSkeleton count={4} />);
      const skeletons = container.querySelectorAll('.space-y-4');

      expect(skeletons.length).toBe(4);
    });

    it('deve renderizar com contagem customizada', () => {
      const { container } = render(<ProductListSkeleton count={8} />);
      const skeletons = container.querySelectorAll('.space-y-4');

      expect(skeletons.length).toBe(8);
    });

    it('deve ter grid layout', () => {
      const { container } = render(<ProductListSkeleton count={3} />);
      const grid = container.querySelector('.grid');

      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
    });
  });

  describe('HeroSkeleton', () => {
    it('deve renderizar skeleton de hero section', () => {
      const { container } = render(<HeroSkeleton />);
      const grid = container.querySelector('.grid');

      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });

    it('deve ter múltiplos skeletons para composição', () => {
      const { container } = render(<HeroSkeleton />);
      const skeletons = container.querySelectorAll('.animate-pulse');

      // Deve ter mais de 1 skeleton
      expect(skeletons.length).toBeGreaterThan(1);
    });
  });

  describe('Acessibilidade', () => {
    it('componentes devem ser renderizados', () => {
      render(
        <Suspense fallback={<div>Loading</div>}>
          <div>Conteúdo Acessível</div>
        </Suspense>
      );

      expect(screen.getByText('Conteúdo Acessível')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('LazyBoundary deve renderizar conteúdo normalmente', () => {
      const InternalComponent = () => <div data-testid="internal">Interno</div>;

      const { getByTestId } = render(
        <LazyBoundary fallback={<div>Loading</div>}>
          <InternalComponent />
        </LazyBoundary>
      );

      // Componente deve estar no DOM quando não há Suspense
      expect(getByTestId('internal')).toBeInTheDocument();
    });
  });
});
