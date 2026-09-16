import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { useProducts, useProduct, useUpsertProduct, useDeleteProduct } from '@/hooks/use-queries';
import { ReactNode } from 'react';

// Mock da API fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const queryWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('React Query Hooks', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    queryClient.clear();
  });

  describe('useProducts', () => {
    it('deve buscar produtos com sucesso', async () => {
      const mockProducts = [
        { id: '1', name: 'Coxinha', price: 5.00 },
        { id: '2', name: 'Kibe', price: 4.50 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      const { result } = renderHook(() => useProducts(), { wrapper: queryWrapper });

      // Aguarda o carregamento
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verifica os dados
      expect(result.current.data).toEqual(mockProducts);
      expect(mockFetch).toHaveBeenCalledWith('/api/products', expect.any(Object));
    });
  });

  describe('useProduct', () => {
    it('deve buscar um produto específico', async () => {
      const mockProduct = { id: '1', name: 'Coxinha', price: 5.00 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      const { result } = renderHook(() => useProduct('1'), { wrapper: queryWrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProduct);
      expect(mockFetch).toHaveBeenCalledWith('/api/products/1', expect.any(Object));
    });

    it('não deve fazer requisição se productId não estiver definido', () => {
      const { result } = renderHook(() => useProduct(''), { wrapper: queryWrapper });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useUpsertProduct', () => {
    it('deve criar um novo produto', async () => {
      const newProduct = { name: 'Pastel', price: 3.50 };
      const savedProduct = { id: 'new-1', ...newProduct };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => savedProduct,
      } as Response);

      const { result } = renderHook(() => useUpsertProduct(), { wrapper: queryWrapper });

      result.current.mutate(newProduct);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(savedProduct);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/products',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('deve atualizar um produto existente', async () => {
      const product = { id: '1', name: 'Coxinha Premium', price: 6.00 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => product,
      } as Response);

      const { result } = renderHook(() => useUpsertProduct(), { wrapper: queryWrapper });

      result.current.mutate(product);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/products/1',
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  });

  describe('useDeleteProduct', () => {
    it('deve deletar um produto', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useDeleteProduct(), { wrapper: queryWrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/products/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Configuração do React Query', () => {
    it('deve ter configurações padrão corretas', () => {
      expect(queryClient.getDefaultOptions()).toBeDefined();
      expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(1000 * 60 * 5);
      expect(queryClient.getDefaultOptions().queries?.gcTime).toBe(1000 * 60 * 10);
    });
  });
});
