import React, { useState } from "react";
import {
  useGetProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../services/api/productsApi";
import { useGetCategories } from "../../services/api/categoryApi";
import { Product } from "../../types/api.types";
import { Plus } from "lucide-react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ErrorState from "../../components/shared/ErrorState";
import EmptyState from "../../components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import ProductFormDialog from "@/components/ProductFormDialog";
import ProductCardAdmin from "../../components/ProductCardAdmin";

const ProductsPage = () => {
  const navigate = useNavigate();
  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetProducts({ limit: 100 });
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
          data: formData,
        });
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(formData);
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      let errorMessage = "An error occurred";
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
    if (
      window.confirm(
        "Are you sure you want to delete this product? All its variants will be lost.",
      )
    ) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("Product deleted successfully");
      } catch (err: unknown) {
        let errorMessage = "Failed to delete product";
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Products Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage base products. Click a product to manage its variants.
          </p>
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
        <EmptyState
          title="No products yet"
          description="Get started by creating a new product."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCardAdmin
              key={product.id}
              product={product}
              onClick={(id) => navigate(`/admin/products/${id}/variants`)}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
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
