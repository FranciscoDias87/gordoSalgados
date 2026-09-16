import { useState, useEffect } from 'react';
import type { AdminProduct } from '@/components/admin/product-form';

/**
 * Hook de CRUD de produtos do admin.
 * Antes chamava o Supabase diretamente do navegador com a anon key
 * (o que só funcionava porque a RLS estava "allow all" — furo de
 * segurança corrigido no schema v2). Agora fala com /api/products,
 * que usa a service_role key só no servidor e exige o cookie de login.
 */
export function useProductsManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error((await res.json()).error || 'Erro ao carregar produtos');
      setProducts(await res.json());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao carregar produtos: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (newProduct: Omit<AdminProduct, 'id'>) => {
    try {
      setError(null);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar produto');
      setProducts((prev) => [data, ...prev]);
      return { success: true, product: data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao criar produto: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const updateProduct = async (id: string, updatedProduct: Omit<AdminProduct, 'id'>) => {
    try {
      setError(null);
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar produto');
      setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
      return { success: true, product: data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao atualizar produto: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Erro ao excluir produto');
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao excluir produto: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
