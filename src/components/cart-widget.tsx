'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { useCartStore } from '@/lib/cart-store'
import { useToast } from '@/hooks/use-toast'

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Informe seu nome'),
  customer_phone: z
    .string()
    .min(10, 'Informe um telefone válido com DDD')
    .regex(/^\d+$/, 'Use só números, com DDD (ex: 11988887777)'),
  delivery_type: z.enum(['entrega', 'retirada']),
  address: z.string().optional(),
}).refine((data) => data.delivery_type === 'retirada' || !!data.address?.trim(), {
  message: 'Informe o endereço de entrega',
  path: ['address'],
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export function CartWidget() {
  const { items, updateQty, removeItem, clear, subtotal, totalItems } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customer_name: '', customer_phone: '', delivery_type: 'retirada', address: '' },
  })

  const deliveryType = form.watch('delivery_type')

  async function onSubmit(values: CheckoutForm) {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: values.customer_name,
          customer_phone: `55${values.customer_phone.replace(/\D/g, '')}`,
          delivery_type: values.delivery_type,
          address: values.address,
          items: items.map((i) => ({
            product_id: i.product_id,
            name: i.name,
            qty: i.qty,
            unit_price: i.unit_price,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar pedido')

      // Abre o WhatsApp com a mensagem já formatada, como confirmação
      // final do cliente — é isso que também abre a janela de 24h pra
      // ele poder receber os avisos de status automaticamente.
      window.open(data.whatsapp_link, '_blank')

      toast({ title: 'Pedido enviado!', description: `Pedido #${data.order.order_number} recebido.` })
      clear()
      form.reset()
      setIsCheckoutOpen(false)
      setIsCartOpen(false)
    } catch (err) {
      toast({
        title: 'Não foi possível enviar o pedido',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems() > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {totalItems()}
              </span>
            )}
            <span className="sr-only">Carrinho</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Seu carrinho</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <p className="mt-8 text-center text-foreground/60">Seu carrinho está vazio.</p>
          ) : (
            <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between gap-2 border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-foreground/60">{priceFormatter.format(item.unit_price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQty(item.product_id, item.qty - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center">{item.qty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQty(item.product_id, item.qty + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => removeItem(item.product_id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <SheetFooter className="mt-4 flex-col gap-3 sm:flex-col">
              <div className="flex w-full items-center justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>{priceFormatter.format(subtotal())}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setIsCartOpen(false)
                  setIsCheckoutOpen(true)
                }}
              >
                Finalizar pedido
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar pedido</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="customer_name">Nome</Label>
              <Input id="customer_name" {...form.register('customer_name')} />
              {form.formState.errors.customer_name && (
                <p className="mt-1 text-sm text-destructive">{form.formState.errors.customer_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="customer_phone">WhatsApp (com DDD)</Label>
              <Input id="customer_phone" placeholder="11988887777" {...form.register('customer_phone')} />
              {form.formState.errors.customer_phone && (
                <p className="mt-1 text-sm text-destructive">{form.formState.errors.customer_phone.message}</p>
              )}
            </div>

            <div>
              <Label>Tipo de pedido</Label>
              <RadioGroup
                value={deliveryType}
                onValueChange={(v) => form.setValue('delivery_type', v as 'entrega' | 'retirada')}
                className="mt-2 flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="retirada" id="retirada" />
                  <Label htmlFor="retirada">Retirar no local</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="entrega" id="entrega" />
                  <Label htmlFor="entrega">Entrega</Label>
                </div>
              </RadioGroup>
            </div>

            {deliveryType === 'entrega' && (
              <div>
                <Label htmlFor="address">Endereço completo</Label>
                <Input id="address" {...form.register('address')} />
                {form.formState.errors.address && (
                  <p className="mt-1 text-sm text-destructive">{form.formState.errors.address.message}</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-3 text-lg font-bold">
              <span>Subtotal</span>
              <span>{priceFormatter.format(subtotal())}</span>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Confirmar e abrir WhatsApp'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
