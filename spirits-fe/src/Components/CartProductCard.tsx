import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { Trash2, Loader2 } from "lucide-react";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { ProductData } from "../types/api.types";

type CartProductCardProps = {
  id: number;
  quantity: number;
  product?: ProductData;
  isLoading?: boolean;
  error?: unknown;
};

const CartProductCard = ({
  id,
  quantity,
  product,
  isLoading,
  error,
}: CartProductCardProps) => {
  const { removeFromCart, increaseCartQuantity, decreaseCartQuantity } =
    useShoppingCart();

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 lg:col-span-5 flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
          <div className="col-span-2 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
          <div className="col-span-2 text-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-16"></div>
          </div>
          <div className="col-span-2 text-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-6 py-8">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 text-center text-red-500 font-medium">
            Error loading product details
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 transition-all duration-200">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="col-span-6 lg:col-span-5 flex lg:flex-row flex-col justify-center lg:justify-normal items-center gap-4">
          <div className="relative group">
            <img
              src={product.image_link}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity duration-200"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{product.type_name}</p>
            <button
              onClick={() => removeFromCart(id)}
              className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-md transition-colors duration-200 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="col-span-2 flex justify-center">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => decreaseCartQuantity(id)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white hover:bg-red-500 rounded-md transition-colors duration-200"
              aria-label="Decrease quantity"
            >
              <CiCircleMinus className="text-xl" strokeWidth={1} />
            </button>
            <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => increaseCartQuantity(id)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white hover:bg-green-500 rounded-md transition-colors duration-200"
              aria-label="Increase quantity"
            >
              <CiCirclePlus className="text-xl" strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* Unit Price */}
        <div className="col-span-2 text-center">
          <p className="text-lg font-semibold text-gray-900">
            Rs. {product.price}
          </p>
          <p className="text-xs text-gray-500">per item</p>
        </div>

        {/* Total Price */}
        <div className="col-span-2 text-center">
          <p className="text-xl font-bold text-green-600">
            Rs. {(product.price * quantity).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {quantity} × Rs. {product.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
