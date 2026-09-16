'use client';

import { useState, useEffect } from 'react';

export interface Testimonial {
  id: number;
  name: string;
  avatarUrl: string;
  avatarHint: string;
  rating: number;
  quote: string;
}

// Dados estáticos de depoimentos - podem ser movidos para uma API depois
export const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Ana Silva',
    avatarUrl: 'https://picsum.photos/seed/ana/150/150',
    avatarHint: 'woman avatar',
    rating: 5,
    quote:
      'Nunca comi uma coxinha tão recheada! O tempero me lembrou a comida da minha avó. Recomendo muito!',
  },
  {
    id: 2,
    name: 'Carlos Oliveira',
    avatarUrl: 'https://picsum.photos/seed/carlos/150/150',
    avatarHint: 'man avatar',
    rating: 5,
    quote:
      'Melhor kibe que já comi! Chegou quentinho e muito rápido. Recomendo demais!',
  },
  {
    id: 3,
    name: 'Juliana Santos',
    avatarUrl: 'https://picsum.photos/seed/juliana/150/150',
    avatarHint: 'woman avatar',
    rating: 5,
    quote:
      'O kit festa salvou meu aniversário! Todos os convidados elogiaram os salgados. Qualidade impecável.',
  },
  {
    id: 4,
    name: 'Rafael Costa',
    avatarUrl: 'https://picsum.photos/seed/rafael/150/150',
    avatarHint: 'man avatar',
    rating: 4,
    quote:
      'A bolinha de queijo é uma delícia, muito queijo mesmo! Só a entrega que demorou um pouquinho, mas valeu a pena.',
  },
  {
    id: 5,
    name: 'Fernanda Lima',
    avatarUrl: 'https://picsum.photos/seed/fernanda/150/150',
    avatarHint: 'woman avatar',
    rating: 5,
    quote:
      'Pedi a esfiha de carne e me surpreendi. Massa fofinha e recheio muito bem temperado. Parabéns!',
  },
];

/**
 * Hook personalizado para gerenciar depoimentos
 * Centraliza a lógica de negócio dos depoimentos da homepage
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de depoimentos (poderia vir de uma API)
    const loadTestimonials = async () => {
      try {
        // Em produção, isso viria de uma API
        // Por enquanto, usa dados estáticos
        setTestimonials(STATIC_TESTIMONIALS);
      } catch (error) {
        console.error('Erro ao carregar depoimentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const getAverageRating = () => {
    if (testimonials.length === 0) return 0;
    const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
    return sum / testimonials.length;
  };

  const getTopRatedTestimonials = (limit: number = 3) => {
    return testimonials
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  };

  return {
    testimonials,
    loading,
    getAverageRating,
    getTopRatedTestimonials,
  };
}