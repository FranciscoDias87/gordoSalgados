import type { Metadata } from 'next';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-coxinha');

export const siteMetadata: Metadata = {
  title: 'Gordo Salgados - Os Melhores Salgados da Região',
  description:
    'Os melhores salgados artesanais da região, feitos com ingredientes premium e fritos na hora. Peça já o seu!',
  openGraph: {
    title: 'Gordo Salgados - Os Melhores Salgados da Região',
    description:
      'Os melhores salgados artesanais da região, feitos com ingredientes premium e fritos na hora. Peça já o seu!',
    images: heroImage ? [heroImage.imageUrl] : [],
    siteName: 'Gordo Salgados',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gordo Salgados - Os Melhores Salgados da Região',
    description:
      'Os melhores salgados artesanais da região, feitos com ingredientes premium e fritos na hora. Peça já o seu!',
    images: heroImage ? [heroImage.imageUrl] : [],
  },
};