import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductById,
  useAddVariant,
  useUpdateVariant,
  useDeleteVariant
} from '../../services/api/productsApi';
import { ProductVariant } from '../../types/api.types';
import { Plus, Edit2, Trash2, X, AlertCircle, ArrowLeft, Package, ImageIcon } from 'lucide-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const VariantsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { data: productData, isLoading, isError } = useGetProductById(productId || null);
  const addVariant = useAddVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  // Form State
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [inventoryQuantity, setInventoryQuantity] = useState('');
  const [variantImageFile, setVariantImageFile] = useState<File | null>(null);

  const product = productData?.data;
  const variants = product?.variants || [];

  const handleOpenModal = (variant?: ProductVariant) => {
    if (variant) {
      setEditingVariant(variant);
      setSize(variant.size);
      setPrice(variant.price.toString());
      setInventoryQuantity(variant.inventoryQuantity.toString());
      setVariantImageFile(null);
    } else {
      setEditingVariant(null);
      setSize('');
      setPrice('');
      setInventoryQuantity('');
      setVariantImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVariant(null);
    setSize('');
    setPrice('');
    setInventoryQuantity('');
    setVariantImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    if (!size || !price || !inventoryQuantity) {
      toast.error('Size, price, and inventory quantity are required');
      return;
    }

    const formData = new FormData();
    formData.append('size', size);
    formData.append('price', price);
    formData.append('inventoryQuantity', inventoryQuantity);

    if (variantImageFile) {
      formData.append('variantImage', variantImageFile);
    }

    try {
      if (editingVariant) {
        await updateVariant.mutateAsync({
          variantId: editingVariant.id,
          productId,
          data: formData
        });
        toast.success('Variant updated successfully');
      } else {
        await addVariant.mutateAsync({
          productId,
          data: formData
        });
        toast.success('Variant created successfully');
      }
      handleCloseModal();
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
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 gap-4">
        <AlertCircle size={48} />
        <h2 className="text-xl font-semibold">Failed to load product details</h2>
        <button 
          onClick={() => navigate('/admin/products')}
          className="text-orange-500 hover:underline"
        >
          Return to Products
        </button>
      </div>
    );
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
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex-shrink-0">
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No variants found</h3>
          <p className="mt-1 text-sm text-slate-500">Add some variants (e.g., sizes like 750ml, 1L) to this product.</p>
        </div>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingVariant ? 'Edit Variant' : 'Add New Variant'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Size *
                </label>
                <input
                  type="text"
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="e.g. 750ml"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Inventory *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={inventoryQuantity}
                    onChange={(e) => setInventoryQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="Quantity"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Variant Image {editingVariant && editingVariant.variantImage ? '(Optional)' : ''}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVariantImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                />
                {editingVariant && !variantImageFile && editingVariant.variantImage && (
                  <p className="text-xs text-slate-500 mt-2">Current variant image will be kept.</p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addVariant.isPending || updateVariant.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {(addVariant.isPending || updateVariant.isPending) ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    editingVariant ? 'Save Changes' : 'Create Variant'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantsPage;
