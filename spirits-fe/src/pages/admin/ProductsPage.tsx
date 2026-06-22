import React, { useState } from 'react';
import { 
  useGetProducts, 
  useAddProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from '../../services/api/productsApi';
import { useGetCategories } from '../../services/api/categoryApi';
import { Product } from '../../types/api.types';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import ProductFormDialog from '@/components/ProductFormDialog';

const ProductsPage = () => {
  const navigate = useNavigate();
  const { data: productsData, isLoading, isError } = useGetProducts({ limit: 100 });
  const { data: categoriesData } = useGetCategories();
  
  const createProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          data: formData
        });
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(formData);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      let errorMessage = 'An error occurred';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product? All its variants will be lost.')) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success('Product deleted successfully');
      } catch (err: unknown) {
        let errorMessage = 'Failed to delete product';
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <ClipLoader color="#f97316" size={50} />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="Failed to load products" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Products Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage base products. Click a product to manage its variants.</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm transition-all h-10 px-4"
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products yet" description="Get started by creating a new product." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={() => navigate(`/admin/products/${product.id}/variants`)}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img 
                  src={product.thumbnail_url} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }}
                    className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-blue-600 rounded-lg shadow-sm transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, product.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-600 rounded-lg shadow-sm transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-[11px] font-bold text-orange-500 mb-2 tracking-wider uppercase bg-orange-50 w-fit px-2 py-1 rounded-md">
                  {product.categoryName || 'Uncategorized'}
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-1" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {product.description || 'No description provided.'}
                </p>
                <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg w-fit border border-slate-100">
                  <Layers size={16} className="mr-2 text-slate-400" />
                  {product.variants?.length || 0} Variant{(product.variants?.length !== 1) ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ProductFormDialog 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingProduct={editingProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
        isSubmitting={createProduct.isPending || updateProduct.isPending}
      />
    </div>
  );
};

export default ProductsPage;