import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductById,
  useAddVariant,
  useUpdateVariant,
  useDeleteVariant
} from '../../services/api/productsApi';
import { ProductVariant } from '../../types/api.types';
import { Plus, Edit2, Trash2, ArrowLeft, ImageIcon } from 'lucide-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import VariantFormDialog from '../../components/VariantFormDialog';

const VariantsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { data: productData, isLoading, isError } = useGetProductById(productId || null);
  const addVariant = useAddVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  const product = productData?.data;
  const variants = product?.variants || [];

  const handleOpenModal = (variant?: ProductVariant) => {
    setEditingVariant(variant || null);
    setIsModalOpen(true);
  };

  const handleVariantFormSubmit = async (formData: FormData) => {
    if (!productId) return;

    try {
      if (editingVariant) {
        await updateVariant.mutateAsync({
          variantId: editingVariant.id,
          productId,
          data: formData,
        });
        toast.success('Variant updated successfully');
      } else {
        await addVariant.mutateAsync({
          productId,
          data: formData,
        });
        toast.success('Variant created successfully');
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

  const handleDelete = async (variantId: string) => {
    if (!productId) return;
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        await deleteVariant.mutateAsync({ variantId, productId });
        toast.success('Variant deleted successfully');
      } catch (err: unknown) {
        let errorMessage = 'Failed to delete variant';
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

  if (isError || !product) {
    return <ErrorState title="Failed to load product details" onRetry={() => navigate('/admin/products')} buttonText="Return to Products" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section with back button */}
      <div>
        <button 
          onClick={() => navigate('/admin/products')}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Products
        </button>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0">
              <img 
                src={product.thumbnail_url} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Variants: {product.name}</h1>
              <p className="text-slate-500 text-sm mt-1">Manage sizes, prices, and inventory for this product.</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <Plus size={20} />
            Add Variant
          </button>
        </div>
      </div>

      {variants.length === 0 ? (
        <EmptyState title="No variants found" description="Add some variants (e.g., sizes like 750ml, 1L) to this product." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Image</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Size</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Inventory</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        {variant.variantImage?.url ? (
                          <img 
                            src={variant.variantImage.url} 
                            alt={variant.size} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{variant.size}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      Rs. {variant.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        variant.inventoryQuantity > 10 ? 'bg-green-100 text-green-700' :
                        variant.inventoryQuantity > 0 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {variant.inventoryQuantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleOpenModal(variant)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(variant.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <VariantFormDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingVariant={editingVariant}
        onSubmit={handleVariantFormSubmit}
        isSubmitting={addVariant.isPending || updateVariant.isPending}
      />
    </div>
  );
};

export default VariantsPage;
