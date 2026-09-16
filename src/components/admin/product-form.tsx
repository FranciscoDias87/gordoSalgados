'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export interface AdminProduct {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  available: boolean;
  display_order: number;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: AdminProduct;
  onSave: (product: Omit<AdminProduct, 'id'>) => void;
  trigger: React.ReactNode;
}

export function ProductForm({ product, onSave, trigger }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [available, setAvailable] = useState(product?.available ?? true);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description: description || null,
      category_id: categoryId || null,
      price: parseFloat(price),
      image_url: imageUrl || null,
      available,
      display_order: product?.display_order ?? 0,
    });
    setIsOpen(false);
    if (!product) {
      setName('');
      setDescription('');
      setCategoryId('');
      setPrice('');
      setImageUrl('');
      setAvailable(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que tem nesse item, ingredientes, etc."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="image_url">URL da imagem</Label>
            <Input
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-muted-foreground">
              O domínio da imagem precisa estar liberado em next.config.ts (remotePatterns).
            </p>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="available">Disponível no cardápio</Label>
            <Switch id="available" checked={available} onCheckedChange={setAvailable} />
          </div>

          <Button type="submit" className="w-full">
            {product ? 'Salvar Alterações' : 'Criar Produto'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
