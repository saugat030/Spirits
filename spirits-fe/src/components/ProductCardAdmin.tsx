import { Edit2, Trash2, Layers } from "lucide-react";
import { Product } from "../types/api.types";
import { useImageLoad } from "../hooks/useImageLoad";
import ClipLoader from "react-spinners/ClipLoader";

interface ProductCardAdminProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  onClick: (productId: string) => void;
}

const ProductCardAdmin = ({
  product,
  onEdit,
  onDelete,
  onClick,
}: ProductCardAdminProps) => {
  const { showSpinner, handleLoad, handleError, imageError, imageLoaded } =
    useImageLoad(product.id);

  return (
    <div
      onClick={() => onClick(product.id)}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer group flex flex-col"
    >
      <div className="aspect-4/3 bg-slate-100 relative overflow-hidden">
        {showSpinner && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <ClipLoader color="#f97316" size={40} />
          </div>
        )}
        <img
          src={imageError ? "/placeholder-image.png" : product.thumbnail_url}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            !imageLoaded && !imageError ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-blue-600 rounded-lg shadow-sm transition-colors"
            title="Edit Product"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => onDelete(e, product.id)}
            className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-600 rounded-lg shadow-sm transition-colors"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[11px] font-bold text-orange-500 mb-2 tracking-wider uppercase bg-orange-50 w-fit px-2 py-1 rounded-md">
          {product.categoryName || "Uncategorized"}
        </div>
        <h3
          className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-1"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {product.description || "No description provided."}
        </p>
        <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg w-fit border border-slate-100">
          <Layers size={16} className="mr-2 text-slate-400" />
          {product.variants?.length || 0} Variant
          {product.variants?.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};

export default ProductCardAdmin;
