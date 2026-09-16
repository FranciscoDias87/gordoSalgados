import { useState, useEffect } from 'react';
import type { AdminProduct } from '@/components/admin/product-form';

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalRevenuePotential: number;
  totalOrders: number;
  pendingOrders: number;
  totalAdmins: number;
  activeAdmins: number;
}

export interface AdminData {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'editor' | 'viewer';
  is_active: boolean;
}

/**
 * Hook de estatísticas do dashboard admin.
 * Antes lia produtos/admins direto do Supabase com a anon key (mesmo
 * furo de segurança das outras telas). Agora usa as rotas protegidas
 * /api/products, /api/admins e /api/orders, que exigem o cookie de
 * login e usam a service_role key só no servidor.
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalRevenuePotential: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalAdmins: 0,
    activeAdmins: 0,
  });
  const [recentProducts, setRecentProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, adminsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admins'),
        fetch('/api/orders'),
      ]);

      const products: AdminProduct[] = productsRes.ok ? await productsRes.json() : [];
      const admins: AdminData[] = adminsRes.ok ? await adminsRes.json() : [];
      const orders: { status: string }[] = ordersRes.ok ? await ordersRes.json() : [];

      const activeProducts = products.filter((p) => p.available);
      const totalRevenuePotential = products.reduce((sum, p) => sum + p.price, 0);
      const activeAdmins = admins.filter((a) => a.is_active);
      const pendingOrders = orders.filter((o) => o.status === 'pendente');

      setStats({
        totalProducts: products.length,
        activeProducts: activeProducts.length,
        totalRevenuePotential,
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        totalAdmins: admins.length,
        activeAdmins: activeAdmins.length,
      });

      setRecentProducts(products.slice(0, 5));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao carregar dados do dashboard: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getRevenueFormatted = () =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenuePotential);

  return {
    stats,
    recentProducts,
    loading,
    currentAdmin,
    setCurrentAdmin,
    error,
    refreshStats: loadDashboardData,
    getRevenueFormatted,
  };
}
