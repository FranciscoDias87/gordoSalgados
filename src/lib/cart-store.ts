import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  product_id: string
  name: string
  unit_price: number
  qty: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (product_id: string) => void
  updateQty: (product_id: string, qty: number) => void
  clear: () => void
  subtotal: () => number
  totalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id ? { ...i, qty: i.qty + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, qty: 1 }] }
        }),

      removeItem: (product_id) =>
        set((state) => ({ items: state.items.filter((i) => i.product_id !== product_id) })),

      updateQty: (product_id, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.product_id !== product_id) }
          }
          return {
            items: state.items.map((i) => (i.product_id === product_id ? { ...i, qty } : i)),
          }
        }),

      clear: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.unit_price * i.qty, 0),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'gordo-salgados-cart' } // persiste no localStorage do navegador
  )
)
