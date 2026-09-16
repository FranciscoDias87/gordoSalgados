// Exemplo de uso de React Query com o admin de produtos
// Este arquivo mostra como refatorar componentes existentes para usar React Query

import { useProducts, useUpsertProduct, useDeleteProduct } from '@/hooks/use-queries';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function ProductListExample() {
  const { data: products, isLoading, error } = useProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { toast } = useToast();

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      deleteProduct(productId, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Produto deletado com sucesso',
          });
        },
        onError: (error) => {
          toast({
            title: 'Erro',
            description: error.message,
            variant: 'destructive',
          });
        },
      });
    }
  };

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div>
      <h2>Produtos</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product: any) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>R$ {product.price.toFixed(2)}</td>
              <td>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deletando...' : 'Deletar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductFormExample() {
  const { mutate: upsertProduct, isPending } = useUpsertProduct();
  const { toast } = useToast();

  const handleSubmit = (formData: any) => {
    upsertProduct(formData, {
      onSuccess: () => {
        toast({
          title: 'Sucesso',
          description: 'Produto salvo com sucesso',
        });
      },
      onError: (error) => {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleSubmit(Object.fromEntries(formData));
      }}
    >
      {/* Form fields aqui */}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  );
}
