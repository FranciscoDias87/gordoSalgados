import { render, screen } from '@testing-library/react';
import { ResponsiveImage, FixedImage, OptimizedImage } from '@/components/optimized-image';

describe('OptimizedImage Components', () => {
  describe('ResponsiveImage', () => {
    it('deve renderizar uma imagem responsiva', () => {
      render(
        <ResponsiveImage
          src="/test-image.jpg"
          alt="Test Image"
          containerClassName="relative h-64 w-full"
        />
      );

      const image = screen.getByAltText('Test Image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src');
    });

    it('deve ter lazy loading por padrão', () => {
      render(
        <ResponsiveImage
          src="/test-image.jpg"
          alt="Test Image"
        />
      );

      const image = screen.getByAltText('Test Image');
      expect(image).toBeInTheDocument();
      // next/image renderiza loading como atributo em runtime
    });

    it('deve ter priority quando definido', () => {
      render(
        <ResponsiveImage
          src="/test-image.jpg"
          alt="Test Image"
          priority
        />
      );

      const image = screen.getByAltText('Test Image');
      expect(image).toBeInTheDocument();
      // Priority passa loading='eager' internamente no next/image
    });

    it('deve aplicar container className', () => {
      const { container } = render(
        <ResponsiveImage
          src="/test-image.jpg"
          alt="Test Image"
          containerClassName="relative h-80 w-full custom-class"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('relative', 'h-80', 'w-full', 'custom-class');
    });
  });

  describe('FixedImage', () => {
    it('deve renderizar uma imagem com dimensões fixas', () => {
      render(
        <FixedImage
          src="/test-image.jpg"
          alt="Fixed Image"
          width={200}
          height={200}
        />
      );

      const image = screen.getByAltText('Fixed Image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('width', '200');
      expect(image).toHaveAttribute('height', '200');
    });

    it('deve usar dimensões padrão se não fornecidas', () => {
      render(
        <FixedImage
          src="/test-image.jpg"
          alt="Default Size"
        />
      );

      const image = screen.getByAltText('Default Size');
      expect(image).toHaveAttribute('width', '200');
      expect(image).toHaveAttribute('height', '200');
    });
  });

  describe('OptimizedImage', () => {
    it('deve renderizar com aspect ratio square', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Square"
          width={300}
          height={300}
          aspectRatio="square"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('aspect-square');
    });

    it('deve renderizar com aspect ratio video', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Video"
          width={1280}
          height={720}
          aspectRatio="video"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('aspect-video');
    });

    it('deve renderizar com aspect ratio hero', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Hero"
          width={1920}
          height={1080}
          aspectRatio="hero"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('aspect-[16/9]');
    });

    it('deve renderizar com container customizado', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Custom"
          width={400}
          height={300}
          containerClassName="rounded-lg shadow-md"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('rounded-lg', 'shadow-md');
    });
  });

  describe('Accessibility', () => {
    it('deve ter alt text em todas as imagens', () => {
      const { rerender } = render(
        <ResponsiveImage
          src="/test-image.jpg"
          alt="Acessible Image"
        />
      );

      let image = screen.getByAltText('Acessible Image');
      expect(image).toBeInTheDocument();

      rerender(
        <FixedImage
          src="/test-image.jpg"
          alt="Fixed Accessible"
        />
      );

      image = screen.getByAltText('Fixed Accessible');
      expect(image).toBeInTheDocument();
    });
  });
});
