'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingBag, LogOut, Users } from 'lucide-react';
import { Admin } from './supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [mounted, setMounted] = useState(false);

  // Verifica se está na página de login para não renderizar o layout
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);

    if (!isLoginPage) {
      // Verificar se há dados de admin no localStorage
      const adminData = localStorage.getItem('adminData');

      if (adminData) {
        try {
          const admin = JSON.parse(adminData);
          setCurrentAdmin(admin);
        } catch (error) {
          console.error('Erro ao parsear dados do admin:', error);
          localStorage.removeItem('adminData');
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
    }
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    setCurrentAdmin(null);
    router.push('/admin/login');
  };

  if (!mounted) return null;
  if (isLoginPage) return <>{children}</>;
  if (!currentAdmin) return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', roles: ['super_admin', 'editor', 'viewer'] },
    { name: 'Produtos', icon: ShoppingBag, path: '/admin/products', roles: ['super_admin', 'editor'] },
    { name: 'Admins', icon: Users, path: '/admin/admins', roles: ['super_admin'] },
  ];

  // Filtrar menu baseado na role do admin
  const allowedMenuItems = menuItems.filter(item =>
    item.roles.includes(currentAdmin.role)
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-red-600">Painel Admin</h2>
          <div className="mt-2 text-sm text-gray-600">
            <p>Olá, {currentAdmin.name}</p>
            <p className="text-xs capitalize">{currentAdmin.role.replace('_', ' ')}</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {allowedMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                pathname === item.path
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
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