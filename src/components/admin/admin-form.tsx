'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

export interface AdminFormValues {
  email: string;
  name: string;
  role: 'super_admin' | 'editor' | 'viewer';
  is_active: boolean;
  password?: string; // senha em texto puro — o hash acontece no servidor (/api/admins)
}

export interface AdminRow {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor' | 'viewer';
  is_active: boolean;
  last_login?: string | null;
}

interface AdminFormProps {
  admin?: AdminRow;
  onSave: (admin: AdminFormValues) => void;
  trigger: React.ReactNode;
}

export function AdminForm({ admin, onSave, trigger }: AdminFormProps) {
  const [email, setEmail] = useState(admin?.email || '');
  const [name, setName] = useState(admin?.name || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'super_admin' | 'editor' | 'viewer'>(admin?.role || 'editor');
  const [isActive, setIsActive] = useState(admin?.is_active ?? true);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      email,
      name,
      role,
      is_active: isActive,
      // Só manda a senha se ela foi preenchida (obrigatória na criação,
      // opcional na edição — significa "trocar a senha").
      ...(password ? { password } : {}),
    });
    setIsOpen(false);
    if (!admin) {
      setEmail('');
      setName('');
      setPassword('');
      setRole('editor');
      setIsActive(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{admin ? 'Editar Admin' : 'Novo Admin'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">{admin ? 'Nova senha (deixe em branco para manter)' : 'Senha'}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!admin}
            />
          </div>
          <div>
            <Label htmlFor="role">Função</Label>
            <Select value={role} onValueChange={(value: 'super_admin' | 'editor' | 'viewer') => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Visualizador</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="is-active">Ativo</Label>
          </div>
          <Button type="submit" className="w-full">
            {admin ? 'Salvar Alterações' : 'Criar Admin'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
