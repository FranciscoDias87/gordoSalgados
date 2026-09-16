'use client';

import { useState, useEffect } from 'react';
import { AdminForm, type AdminFormValues, type AdminRow } from '../../../components/admin/admin-form';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Shield, Eye, Edit3 } from 'lucide-react';
import { useAdmins } from '@/hooks/use-admins';

export default function AdminsPage() {
  const {
    admins,
    loading,
    error,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    clearError,
  } = useAdmins();

  const handleAddAdmin = async (newAdmin: AdminFormValues) => {
    try {
      await createAdmin(newAdmin);
    } catch (error) {
      // Error já é tratado pelo hook
    }
  };

  const handleUpdateAdmin = async (updatedAdmin: AdminFormValues, id: string) => {
    try {
      await updateAdmin(id, updatedAdmin);
    } catch (error) {
      // Error já é tratado pelo hook
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este admin?')) return;

    try {
      await deleteAdmin(id);
    } catch (error) {
      // Error já é tratado pelo hook
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'editor':
        return <Edit3 className="w-4 h-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-green-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'editor':
        return 'Editor';
      case 'viewer':
        return 'Visualizador';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Carregando admins...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Admins</h1>
        <AdminForm
          onSave={handleAddAdmin}
          trigger={
            <Button className="bg-red-600 text-white bold hover:bg-red-700 hover:text-white hover:font-bold hover:uppercase">
              <Plus className="w-4 h-4 mr-2" />
              Novo Admin
            </Button>
          }
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Login</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{admin.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getRoleIcon(admin.role)}
                    <span className="ml-2 text-sm text-gray-900">{getRoleLabel(admin.role)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    admin.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.last_login
                    ? new Date(admin.last_login).toLocaleString('pt-BR')
                    : 'Nunca'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <AdminForm
                    admin={admin}
                    onSave={(updated) => handleUpdateAdmin(updated, admin.id)}
                    trigger={
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="w-4 h-4" />
                      </button>
                    }
                  />
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {admins.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Nenhum admin encontrado.
          </div>
        )}
      </div>
    </div>
  );
}