'use client';

import { ProductForm, type AdminProduct } from '../../../components/admin/product-form';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useProductsManagement } from '@/hooks/use-products-management';

type AdminProductRow = AdminProduct & { categories?: { id: string; name: string } | null };

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductsManagement();

  const handleAddProduct = async (newProduct: Omit<AdminProduct, 'id'>) => {
    const result = await addProduct(newProduct);
    if (!result.success) {
      alert(result.error || 'Erro ao criar produto. Tente novamente.');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Omit<AdminProduct, 'id'>, id: string) => {
    const result = await updateProduct(id, updatedProduct);
    if (!result.success) {
      alert(result.error || 'Erro ao atualizar produto. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    const result = await deleteProduct(id);
    if (!result.success) {
      alert(result.error || 'Erro ao excluir produto. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h1>
        <ProductForm
          onSave={handleAddProduct}
          trigger={
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          }
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(products as AdminProductRow[]).map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-100" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      {product.description && (
                        <div className="max-w-xs truncate text-xs text-gray-500">{product.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {product.categories?.name || 'Sem categoria'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ {product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.available ? 'Disponível' : 'Indisponível'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ProductForm
                    product={product}
                    onSave={(updated) => handleUpdateProduct(updated, product.id)}
                    trigger={
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="w-4 h-4" />
                      </button>
                    }
                  />
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
