import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

/**
 * Hook para buscar produtos com cache
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar produtos');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook para buscar um produto específico
 */
export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar produto');
      }
      
      return response.json();
    },
    enabled: !!productId,
  });
}

/**
 * Hook para buscar admins com cache
 */
export function useAdmins() {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const response = await fetch('/api/admin', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar admins');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook para buscar um admin específico
 */
export function useAdmin(adminId: string) {
  return useQuery({
    queryKey: ['admin', adminId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/${adminId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar admin');
      }
      
      return response.json();
    },
    enabled: !!adminId,
  });
}

/**
 * Hook para criar/atualizar produto
 */
export function useUpsertProduct() {
  return useMutation({
    mutationFn: async (product: any) => {
      const isUpdating = !!product.id;
      const method = isUpdating ? 'PUT' : 'POST';
      const url = isUpdating ? `/api/products/${product.id}` : '/api/products';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar produto');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries relacionadas ao produto
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Hook para deletar produto
 */
export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar produto');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries relacionadas ao produto
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Hook para criar/atualizar admin
 */
export function useUpsertAdmin() {
  return useMutation({
    mutationFn: async (admin: any) => {
      const isUpdating = !!admin.id;
      const method = isUpdating ? 'PUT' : 'POST';
      const url = isUpdating ? `/api/admin/${admin.id}` : '/api/admin';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(admin),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar admin');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

/**
 * Hook para deletar admin
 */
export function useDeleteAdmin() {
  return useMutation({
    mutationFn: async (adminId: string) => {
      const response = await fetch(`/api/admin/${adminId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar admin');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}
