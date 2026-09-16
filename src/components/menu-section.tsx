'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getPublicMenu, type Category, type Product } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'

type CategoryWithProducts = Category & { products: Product[] }

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function MenuSection() {
  const [menu, setMenu] = useState<CategoryWithProducts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  useEffect(() => {
    getPublicMenu()
      .then((data) => setMenu(data.filter((cat) => cat.products.length > 0)))
      .catch((err) => {
        console.error('Erro ao carregar cardápio:', err)
        setError('Não foi possível carregar o cardápio agora. Tente novamente em instantes.')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (product: Product) => {
    addItem({ product_id: product.id, name: product.name, unit_price: product.price })
    setJustAdded(product.id)
    setTimeout(() => setJustAdded(null), 1200)
  }

  if (loading) {
    return <p className="mt-8 text-center text-foreground/60">Carregando cardápio...</p>
  }

  if (error) {
    return <p className="mt-8 text-center text-destructive">{error}</p>
  }

  if (menu.length === 0) {
    return <p className="mt-8 text-center text-foreground/60">Cardápio em atualização, volte em breve!</p>
  }

  return (
    <Tabs defaultValue={menu[0].name} className="mt-8">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {menu.map((category) => (
          <TabsTrigger key={category.id} value={category.name}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {menu.map((category) => (
        <TabsContent key={category.id} value={category.name}>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.products.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full bg-muted">
                    {item.image_url && (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        loading="lazy"
                        className="object-cover"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-2 p-4">
                  <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                  {item.description && (
                    <p className="text-sm text-foreground/70">{item.description}</p>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-0">
                  <p className="text-lg font-bold">{priceFormatter.format(item.price)}</p>
                  <Button onClick={() => handleAdd(item)}>
                    <Plus className="mr-1 h-4 w-4" />
                    {justAdded === item.id ? 'Adicionado!' : 'Adicionar'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
