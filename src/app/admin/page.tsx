'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, TrendingUp, ClipboardList, DollarSign, Clock, Shield } from 'lucide-react';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboard() {
  const { admin: currentAdmin } = useAuth();
  const { stats, recentProducts, loading, error, getRevenueFormatted } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Carregando dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total de Produtos', value: stats.totalProducts, icon: ShoppingBag, color: 'text-blue-600' },
    { title: 'Produtos Disponíveis', value: stats.activeProducts, icon: TrendingUp, color: 'text-green-600' },
    { title: 'Valor Potencial do Cardápio', value: getRevenueFormatted(), icon: DollarSign, color: 'text-yellow-600' },
    { title: 'Pedidos (total)', value: stats.totalOrders, icon: ClipboardList, color: 'text-purple-600' },
    { title: 'Pedidos Pendentes', value: stats.pendingOrders, icon: Clock, color: 'text-orange-600' },
    { title: 'Admins Ativos', value: stats.activeAdmins, icon: Shield, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/products">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Gerenciar Produtos
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button className="w-full justify-start" variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" />
                Gerenciar Pedidos
              </Button>
            </Link>
            {currentAdmin?.role === 'super_admin' && (
              <Link href="/admin/admins">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Gerenciar Admins
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <p className="text-sm font-medium">{product.name}</p>
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ {product.price.toFixed(2)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                </div>
              ))}
              {recentProducts.length === 0 && (
                <p className="text-gray-500 text-sm">Nenhum produto cadastrado ainda.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
