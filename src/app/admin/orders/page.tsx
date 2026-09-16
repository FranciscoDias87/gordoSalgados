'use client';

import { useOrders } from '@/hooks/use-orders';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Order } from '@/lib/supabase';

const STATUS_LABELS: Record<Order['status'], string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  preparo: 'Em preparo',
  saiu_entrega: 'Saiu para entrega',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

const STATUS_VARIANTS: Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pendente: 'outline',
  confirmado: 'secondary',
  preparo: 'secondary',
  saiu_entrega: 'default',
  concluido: 'default',
  cancelado: 'destructive',
};

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export default function OrdersPage() {
  const { orders, loading, error, updateStatus } = useOrders();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Carregando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">
                  Pedido #{order.order_number} — {order.customer_name}
                </p>
                <p className="text-sm text-gray-500">
                  {order.customer_phone} · {dateFormatter.format(new Date(order.created_at))} ·{' '}
                  {order.delivery_type === 'entrega' ? 'Entrega' : 'Retirada'}
                </p>
                {order.address && <p className="text-sm text-gray-500">{order.address}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                <Select
                  value={order.status}
                  onValueChange={(value) => updateStatus(order.id, value as Order['status'])}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ul className="mt-3 space-y-1 border-t pt-3 text-sm">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.qty}x {item.name}</span>
                  <span>{priceFormatter.format(item.qty * item.unit_price)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2 flex justify-between border-t pt-2 text-sm font-semibold">
              <span>Total {order.delivery_fee > 0 && '(com entrega)'}</span>
              <span>{priceFormatter.format(order.total)}</span>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="py-10 text-center text-gray-500">Nenhum pedido recebido ainda.</p>
        )}
      </div>
    </div>
  );
}
