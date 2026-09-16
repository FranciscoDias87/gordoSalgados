import Image, { ImageProps } from 'next/image';
import { ReactNode } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  fallback?: ReactNode;
  aspectRatio?: 'square' | 'video' | 'hero';
  containerClassName?: string;
}

const aspectRatioMap = {
  square: 'aspect-square',
  video: 'aspect-video',
  hero: 'aspect-[16/9]',
};

/**
 * Componente otimizado para imagens com next/image
 * Suporta lazy loading, placeholder blur, e diferentes aspect ratios
 */
export function OptimizedImage({
  alt,
  fallback,
  aspectRatio,
  containerClassName = '',
  placeholder = 'empty',
  priority = false,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) {
  const aspectClass = aspectRatio ? aspectRatioMap[aspectRatio] : '';

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${aspectClass} ${containerClassName}`}
    >
      <Image
        alt={alt}
        placeholder={placeholder as any}
        priority={priority}
        loading={priority ? 'eager' : loading}
        {...props}
      />
      {fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          {fallback}
        </div>
      )}
    </div>
  );
}

/**
 * Componente para imagem com fill (responsive)
 */
export function ResponsiveImage({
  alt,
  containerClassName = 'relative w-full h-full',
  objectFit = 'cover',
  objectPosition = 'center',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & {
  objectFit?: 'cover' | 'contain' | 'fill';
  objectPosition?: string;
}) {
  return (
    <div className={containerClassName}>
      <Image
        alt={alt}
        fill
        className={`object-${objectFit}`}
        style={{
          objectFit,
          objectPosition,
        }}
        {...props}
      />
    </div>
  );
}

/**
 * Componente para imagem com dimensões fixas
 */
export function FixedImage({
  alt,
  width = 200,
  height = 200,
  containerClassName = '',
  ...props
}: OptimizedImageProps & {
  width?: number;
  height?: number;
}) {
  return (
    <div className={containerClassName}>
      <Image
        alt={alt}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
}
