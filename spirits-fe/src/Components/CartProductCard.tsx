import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { Product } from "../types/api.types";

type CartProductCardProps = {
  product: Product;
  selectedVariantId: string;
  quantity: number;
};

const CartProductCard = ({
  product,
  selectedVariantId,
  quantity,
}: CartProductCardProps) => {
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseCartQuantity = useCartStore((state) => state.increaseCartQuantity);
  const decreaseCartQuantity = useCartStore((state) => state.decreaseCartQuantity);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const price = selectedVariant?.discountedPrice || product.minDiscountedPrice;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-2">
        <img
          src={product.thumbnail_url}
          alt={product.name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
        <div>
          <div className="flex justify-between items-start gap-4 mb-1">
            <h3 className="font-semibold text-lg text-slate-900 truncate leading-tight">
              {product.name}
            </h3>
            <p className="text-xl font-semibold text-slate-900 whitespace-nowrap">
              NPR {(price * quantity).toFixed(2)}
            </p>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-3">
            {product.categoryName} {selectedVariant && `• ${selectedVariant.size}`}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => decreaseCartQuantity(selectedVariantId)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 rounded-md transition-all hover:shadow-sm"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-medium text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => increaseCartQuantity(product, selectedVariantId)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 rounded-md transition-all hover:shadow-sm"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => removeFromCart(selectedVariantId)}
            className="flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
