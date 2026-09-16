'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingBag, LogOut, ShieldPlus, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Verifica se está na página de login para não renderizar o layout
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoginPage, isAuthenticated, isLoading, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (isLoginPage) return <>{children}</>;
  if (!isAuthenticated) return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Produtos', icon: ShoppingBag, path: '/admin/products' },
    { name: 'Pedidos', icon: ClipboardList, path: '/admin/orders' },
    { name: 'Admins', icon: ShieldPlus, path: '/admin/admins' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-red-600">Painel Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                pathname === item.path
                  ? 'bg-red-700 text-white bold uppercase'
                  : 'text-gray-600 bold hover:bg-red-500 hover:text-white bold '
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={async () => { await logout(); router.push('/admin/login'); }} className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}