import type { NextConfig } from 'next';

// Libera automaticamente o domínio do projeto Supabase configurado no
// .env, caso o admin passe a subir imagens pro Supabase Storage em vez
// de colar URLs externas.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      ...(supabaseHostname
        ? [{ protocol: 'https' as const, hostname: supabaseHostname, pathname: '/**' }]
        : []),
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'guiadacozinha.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'institucional.vapza.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'blog.vapza.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'aguanabocabh.com', pathname: '/**' },
      { protocol: 'https', hostname: 'andinacocacola.vtexassets.com', pathname: '/**' },
      { protocol: 'https', hostname: 'carrefourbrfood.vtexassets.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;