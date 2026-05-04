import React, { useState } from 'react';
import { 
  useGetCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '../../services/api/categoryApi';
import { Category } from '../../types/api.types';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const { data: categoriesData, isLoading, isError } = useGetCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ category_name: '', category_image_url: '' });
  
  const categories = categoriesData?.data || [];

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        category_name: category.category_name,
        category_image_url: category.category_image_url
      });
    } else {
      setEditingCategory(null);
      setFormData({ category_name: '', category_image_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ category_name: '', category_image_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_name || !formData.category_image_url) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          payload: formData
        });
        toast.success('Category updated successfully');
      } else {
        await createCategory.mutateAsync(formData);
        toast.success('Category created successfully');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory.mutateAsync(id);
        toast.success('Category deleted successfully');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to delete category');
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
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 gap-4">
        <AlertCircle size={48} />
        <h2 className="text-xl font-semibold">Failed to load categories</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories Management</h1>
          <p className="text-slate-500 text-sm mt-1">Add, edit, or delete product categories.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Image</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img 
                          src={category.category_image_url} 
                          alt={category.category_name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{category.category_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="e.g. Whiskey"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.category_image_url}
                  onChange={(e) => setFormData({ ...formData, category_image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {formData.category_image_url && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500 mb-2">Image Preview:</p>
                  <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img 
                      src={formData.category_image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
                      }}
                    />
                  </div>
                </div>
              )}

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
                  disabled={createCategory.isPending || updateCategory.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {(createCategory.isPending || updateCategory.isPending) ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    editingCategory ? 'Save Changes' : 'Create Category'
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

export default CategoriesPage;
