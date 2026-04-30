import { Package, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import CartProductCard from "./CartProductCard";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);
  const grandTotal = cartItems.reduce((accumulator, item) => {
    const selectedVariant = item.product.variants.find(
      (v) => v.id === item.selectedVariantId
    );
    const price = selectedVariant?.discountedPrice || item.product.minDiscountedPrice;
    return accumulator + price * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="bg-slate-200 rounded-full w-32 h-32 mb-8 flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-3xl font-semibold text-slate-900 mb-4 tracking-tight">
          Your cart is empty
        </h2>
        <p className="text-slate-500 mb-8 max-w-md text-lg">
          Looks like you haven't added any items to your cart yet. Start exploring our collection to find your favorite spirits.
        </p>
        <Link to="/products">
          <button className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-medium shadow-sm hover:shadow-md active:scale-[0.98] flex items-center gap-2">
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
          Your Cart
        </h1>
        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-3xl border border-orange-100">
          <Package className="w-4 h-4 text-orange-600" />
          <span className="font-medium text-xs text-orange-800">
            {cartQuantity} {cartQuantity === 1 ? "Item" : "Items"}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div key={item.selectedVariantId} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <CartProductCard
                quantity={item.quantity}
                product={item.product}
                selectedVariantId={item.selectedVariantId}
              />
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-3xl p-8 sticky top-28 text-slate-900 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-slate-900">NPR {grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Shipping</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium">Calculated at checkout</span>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100 my-6"></div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-medium text-slate-700">Grand Total</span>
              <span className="text-3xl font-semibold text-orange-500 tracking-tighter">NPR {grandTotal.toFixed(2)}</span>
            </div>

            <div>
              <Link to="/checkout" className="block w-full">
                <button className="w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-semibold shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5 text-sm">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
