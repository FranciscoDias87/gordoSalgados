import { useEffect, useState } from 'react';
import type { Order } from '@/lib/supabase';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error((await res.json()).error || 'Erro ao carregar pedidos');
      setOrders(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar status');
      setOrders((prev) => prev.map((o) => (o.id === id ? data : o)));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return { orders, loading, error, loadOrders, updateStatus };
}
