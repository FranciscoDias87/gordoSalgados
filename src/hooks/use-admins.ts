'use client';

import { useState, useEffect } from 'react';
import type { AdminFormValues, AdminRow } from '@/components/admin/admin-form';

export function useAdmins() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admins');
      if (!res.ok) throw new Error((await res.json()).error || 'Erro ao carregar admins');
      setAdmins(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar admins');
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (admin: AdminFormValues) => {
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin),
    });
    const data = await res.json();
    if (!res.ok) {
      const errorMessage = data.error || 'Erro ao criar admin';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    setAdmins((prev) => [data, ...prev]);
    return data;
  };

  const updateAdmin = async (id: string, updates: AdminFormValues) => {
    const res = await fetch(`/api/admins/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) {
      const errorMessage = data.error || 'Erro ao atualizar admin';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    setAdmins((prev) => prev.map((a) => (a.id === id ? data : a)));
    return data;
  };

  const deleteAdmin = async (id: string) => {
    const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      const errorMessage = data.error || 'Erro ao excluir admin';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  return {
    admins,
    loading,
    error,
    loadAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    clearError: () => setError(null),
  };
}
