import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { Trash2 } from "lucide-react";
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
  const increaseCartQuantity = useCartStore(
    (state) => state.increaseCartQuantity
  );
  const decreaseCartQuantity = useCartStore(
    (state) => state.decreaseCartQuantity
  );

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );

  return (
    <div className="px-6 py-6 transition-all duration-200">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 lg:col-span-5 flex lg:flex-row flex-col justify-center lg:justify-normal items-center gap-4">
          <div className="relative group">
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity duration-200"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {product.categoryName}
              {selectedVariant && ` - ${selectedVariant.size}`}
            </p>
            <button
              onClick={() => removeFromCart(selectedVariantId)}
              className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-md transition-colors duration-200 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>

        <div className="col-span-2 flex justify-center">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => decreaseCartQuantity(selectedVariantId)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white hover:bg-red-500 rounded-md transition-colors duration-200"
              aria-label="Decrease quantity"
            >
              <CiCircleMinus className="text-xl" strokeWidth={1} />
            </button>
            <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() =>
                increaseCartQuantity(product, selectedVariantId)
              }
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white hover:bg-green-500 rounded-md transition-colors duration-200"
              aria-label="Increase quantity"
            >
              <CiCirclePlus className="text-xl" strokeWidth={1} />
            </button>
          </div>
        </div>

        <div className="col-span-2 text-center">
          <p className="text-lg font-semibold text-gray-900">
            Rs. {selectedVariant?.discountedPrice || product.minDiscountedPrice}
          </p>
          <p className="text-xs text-gray-500">per item</p>
        </div>

        <div className="col-span-2 text-center">
          <p className="text-xl font-bold text-green-600">
            Rs.{" "}
            {(
              (selectedVariant?.discountedPrice ||
                product.minDiscountedPrice) *
              quantity
            ).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {quantity} × Rs.{" "}
            {selectedVariant?.discountedPrice || product.minDiscountedPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
