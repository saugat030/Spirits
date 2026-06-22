import { PiStarFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { Product } from "../types/api.types";
import { useImageLoad } from "../hooks/useImageLoad";

const ProductCard = ({ product }: { product: Product }) => {
  const { showSpinner, handleLoad, handleError, imageError, imageLoaded } = useImageLoad(product.id);
  const navigate = useNavigate();

  const totalStock = product.variants.reduce(
    (sum, v) => sum + v.inventoryQuantity,
    0
  );

  function handleClick() {
    navigate(`/products/${product.id}`);
  }

  return (
    <section
      onClick={handleClick}
      className="group w-[256px] flex flex-col bg-amber-50 rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <figure className="relative h-[240px] w-full rounded-xl overflow-hidden bg-slate-50 flex justify-center items-center">
        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-[#0D1B39] text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
          {product.categoryName}
        </div>
        {totalStock <= 0 && (
          <div className="absolute top-2 right-2 z-10 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Sold Out
          </div>
        )}
        {showSpinner && (
          <div className="absolute inset-0 flex justify-center items-center z-0">
            <ClipLoader color="#0D1B39" size={40} />
          </div>
        )}
        <img
          src={imageError ? "/placeholder-image.png" : product.thumbnail_url}
          alt={`${product.categoryName} - ${product.name}`}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            !imageLoaded && !imageError ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      </figure>
      <div className="flex flex-col grow mt-3">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex text-yellow-400 text-sm">
            <PiStarFill />
            <PiStarFill />
            <PiStarFill />
            <PiStarFill />
            <PiStarFill />
          </div>
        </div>

        <h2
          className="text-lg font-bold text-[#0D1B39] line-clamp-1"
          title={product.name}
        >
          {product.name}
        </h2>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between w-full">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
              Starting from
            </span>
            <span className="text-xl font-extrabold text-[#0D1B39]">
              Rs. {product.minDiscountedPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;
